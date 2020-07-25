let mongoose = require('mongoose');
let schema = mongoose.Schema;
const bcrypt = require('bcrypt');


let validateEmail = function (email) {
    let re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};
let emailSettings = new schema({
    'email_address': {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
        validate: [validateEmail, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    'email_password': {
        type: String,
        required: true
    }
}, {
    strict: true,
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

// let SALT_WORK_FACTOR = 5
// emailSettings.pre('save', function (next) {
//     let settings = this;
//     if (!settings.isModified('email_password')) return next();
//     bcrypt.genSalt(SALT_WORK_FACTOR, function (error, salt) {
//         if (error) return next(error);
//         bcrypt.hash(settings.email_password, salt, function (err, hash) {
//             if (err) return next(err);
//             settings.email_password = hash;
//             next();
//         })
//     })
// });

emailSettings.statics.updateEmailSettings = function (email_address, email_password, callback) {
    const filter = {};
    const update = {email_password: email_password, email_address: email_address};
    return mongoose.model('email_settings').findOneAndUpdate(filter, update, {
        new: true,
        projection: {"password": 0}
    }, callback)
}

emailSettings.statics.getEmailSettings = function (callback) {
    return this.model('email_settings').findOne({},callback);
}


module.exports = mongoose.model('email_settings', emailSettings);
