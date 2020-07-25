let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let autoIncrement = require('mongoose-auto-increment');
const bcrypt = require('bcrypt');
let aggregatePaginate = require("mongoose-aggregate-paginate-v2");

let validateEmail = function (email) {
    let re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};
const saltRounds = 10;


let user = new Schema({
    unique_id: Number,
    // user_type: {type: String, default: 1},
    user_type: {
        type: Schema.Types.ObjectId,
        ref: "groups"
    },
    name: {type: String, required: true},
    email: {
        type: String,
        // trim: true,
        // lowercase: true,
        // unique: true,
        // required: 'Email address is required',
        // validate: [validateEmail, 'Please fill a valid email address'],
        // match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {type: String, required: true},
    last_login: {type: Date},
    reset_password_token: {type: String},
    reset_password_expires: Date,
    activated: {type: Number, default: false},
    avatar: {type: String}
}, {
    strict: true,
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

let SALT_WORK_FACTOR = 5
user.pre('save', function (next) {
    console.log('SAVE TRIGGERED');
    let newUser = this;
    if (!newUser.isModified('password')) return next();
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err);
        bcrypt.hash(newUser.password, salt, function (err, hash) {
            if (err) return next(err);
            newUser.password = hash;
            next();
        });
    });
});

user.statics.getUsers = function () {
    return this.model('user').find({})
        .populate('user_type')
};


user.statics.updateUser = async function (filter, update) {
    return this.model('user').findOneAndUpdate(filter, update, {new: true});

};

user.statics.findUserByEmail = function (user_email, callback) {
    return this.model('user').findOne({email: user_email}, callback);
};
user.statics.findUserById = function (id) {
    return this.model('user').findOne({_id: id})
        .populate('user_type')
};
user.statics.findUserAndUpdateLastLogin = function (user_email) {
    let filter = {email: user_email};
    let update = {last_login: Date.now()};
    return this.model('user').findOneAndUpdate(filter, update, {
        new: true,
        projection: {"password": 0}
    })
};
user.statics.updateUserStatus = function (id, status, callback) {
    let filter = {_id: id};
    const update = {activated: status};
    return this.model('user').findByIdAndUpdate(filter, update, {
        new: true,
        projection: {activated: 1, name: 1}
    });
};

user.statics.findUserAndResetPassword = function (user_email, callback) {
    const filter = {email: user_email};
    const update = {
        reset_password_token: generateRandomInteger(101456, 999999),
        reset_password_expires: Date.now() + 3600000
    }
    return this.model('user').findOneAndUpdate(filter, update, {
        new: true,
        projection: {"password": 0}
    }, callback)
};

user.statics.findUserByToken = function (user_email, token, callback) {
    return this.model('user').findOne({
        email: user_email,
        reset_password_token: token,
        reset_password_expires: {$gt: Date.now()}
    }, callback);
};

user.statics.findUserAndUpdatePassword = function (user_email, new_password, callback) {
    const filter = {email: user_email};
    bcrypt.hash(new_password, saltRounds)
        .then(function (hash) {
            const update = {password: hash, reset_password_token: generateRandomInteger(100000, 500000)};
            return mongoose.model('user').findOneAndUpdate(filter, update, {
                new: true,
                projection: {"password": 0}
            }, callback)
        }).catch(error => {
            console.error("ERROR " + error);
            return error;
        }
    );

};

user.statics.findUserAndDelete = function (user_id) {
    return this.model('user').deleteOne({_id: user_id});
};

user.statics.searchUser = function (word) {
    console.log('WORD ' + word);
    return this.model('user').find({name: new RegExp('^' + word, "i")});
};



function generateRandomInteger(min, max) {
    return Math.floor(min + Math.random() * (max + 1 - min))
}

user.index({email: 1}, {background: true});
user.index({name: 1}, {background: true});
user.plugin(aggregatePaginate);
user.plugin(autoIncrement.plugin, {model: 'user', field: 'unique_id', startAt: 1, incrementBy: 1});
module.exports = mongoose.model('user', user);



