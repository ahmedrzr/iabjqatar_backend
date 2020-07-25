let jwt = require('jsonwebtoken');
let config = require('./../../../config/jwt-secret');
let async = require('async');
let tokenModel = require('../../models/users/user_tokens_model');
let tokenGenerator = require('./TokenGenerators');
require('../../utils/constents');
require('../../utils/message_code');
let responsehandler = require('../handlers/ResponseHandler');


exports.validate = function (req, res, next) {
    if (req.headers['authorization']) {
        let token = req.headers['x-access-token'] || req.headers['authorization'];
        if (token.startsWith('Bearer ')) {
            token = token.slice(7, token.length);
        }
        if (token) {
            async.waterfall([
                (done) => {
                    tokenGenerator.validate(token, (error, result) => {
                        if (error) {
                            if (error.message === "jwt expired") {
                                done(null, null);
                            } else {
                                done(error, null);
                            }
                        } else {
                            done(null, result);
                        }
                    })
                }, (decoded, done) => {
                    if (decoded === null) {
                        tokenModel.getRefreshToken(token)
                            .then(result => {
                                if (result) {
                                    let decodedValue = jwt.decode(token, {complete: true});
                                    let payroll = {
                                        _id: decodedValue.payload.user_id,
                                        name: decodedValue.payload.user_name,
                                        email: decodedValue.payload.user_email,
                                        user_type: decodedValue.payload.user_type
                                    }
                                    tokenGenerator.generate(payroll, DATA_TYPES.UPDATE_DOCUMENT, (error, newToken) => {
                                        if (error) {
                                            done(error, null);
                                        } else {
                                            done(null, true);
                                        }
                                    });
                                } else {
                                    done(getError("TOKEN EXPIRED", " USER_MESSAGE_CODE.TOKEN_EXPIRED"), null);
                                }

                            }).catch(error => {
                            done(error, null);
                        })

                    } else {
                        done(null, true);
                    }
                }
            ], function (error, result) {
                if (error) {
                    responsehandler.error_handler(res, getError(USER_MESSAGE_CODE.TOKEN_EXPIRED, "TOKEN EXPIRED"))
                } else {
                    next();
                }
            })
        } else {

        }
    } else {
        responsehandler.error_handler(res, getError("TOKEN_MISSING", USER_MESSAGE_CODE.TOKEN_MISSING));
    }
}

function getError(code, message) {
    let err = new Error(message)
    err.code = code;
    return err;
}
