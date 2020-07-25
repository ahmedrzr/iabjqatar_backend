let async = require('async');
let jwt = require('jsonwebtoken');
let config = require('./../../../config/jwt-secret');
let TokenModel = require('../../models/users/user_tokens_model');
require('../../utils/constents');
module.exports.generate = function (user, status, callback) {
    async.waterfall([
        (done) => {
            jwt.sign({
                user_id: user._id,
                user_email: user.email,
                user_name: user.name,
                user_type: user.user_type
            }, config.secret, {expiresIn: config.expiration_time_in_second}, function (err, token) {
                if (err) done(err, null);
                else done(null, token);
            });
        }, (token, done) => {
            if (status === DATA_TYPES.UPDATE_DOCUMENT) {
                TokenModel.setTokenUpdate(user._id, token)
                    .then(result => {
                        done(null, token);
                    }).catch(error => {
                    done(error, null);
                })
            } else {
                let tokenModel = new TokenModel({
                    user_id: user._id,
                    user_name: user.name,
                    user_email: user.email,
                    user_type: user.user_type,
                    token: token
                });
                tokenModel.save()
                    .then(() => {
                        done(null, token);
                    }).catch(error => {
                    done(error, null);
                })
            }


        }
    ], (error, result) => {
        callback(error, result);
    });
}

module.exports.validate = function (token, callback) {
    jwt.verify(token, config.secret, (error, decoded) => {
        if (error) {
            callback(error, null);
        } else {
            callback(null, decoded);
        }
    });
}
