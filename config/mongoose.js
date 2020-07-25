var config = require('./config.js'),
    mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var autoIncrement = require('mongoose-auto-increment');

module.exports = function () {
    return new Promise((resolve, reject) => {
        mongoose.connect(config.db, {
            useCreateIndex: true,
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useFindAndModify: false
        }).then(connection => {
            // console.log('Connected');
            resolve(connection)
        }).catch(reason => {
            // console.log('not connected');
            resolve(reason);
        });
        autoIncrement.initialize(mongoose.connection);
    });
    try {
        require('../app/models/users/users');
        require('../app/models/groups/groups');
    } catch (e) {

    }
};
