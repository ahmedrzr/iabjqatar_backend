let User = require('../../models/users/users');
let nodeMailer = require('./mail_sender');
const bcrypt = require('bcrypt');
let async = require('async');
let util = require('../../utils/util');
require('../../utils/error_code');
require('../../utils/message_code');
require('../../utils/code_messages');
require('../../utils/constents');
var validator = require('../../utils/DataValidation');
const responseHandler = require('../../controllers/handlers/ResponseHandler');
let emailSettings = require('../../models/admin/MailSettings');
let tokenGenerator = require('../../controllers/auth/TokenGenerators');
require('../../utils/constents');
const avatarDirectoryPath = './public/images/avatars';

// USER REGISTER API
exports.user_register = function (request_data, response_data) {
    let reqData = request_data.body;
    async.parallel([
        (done) => {
            validator.data_validate(reqData.email.trim(), DATA_TYPES.EMAIL)
                .then(value => {
                    done(null, true);
                }).catch(error => {
                done(error, null);
            })
        },
        (done) => {
            validator.data_validate(reqData.password.trim(), DATA_TYPES.PASSWORD)
                .then(value => {
                    done(null, true)
                }).catch(error => {
                done(error, null);
            });
        },
        (done) => {
            validator.data_validate(reqData.name.trim(), DATA_TYPES.STRING)
                .then(value => {
                    done(null, true)
                }).catch(error => {
                done(error, null);
            });
        }

    ], (error, result) => {
        if (error) {
            responseHandler.error_handler(response_data, error);
        } else {
            registerUser(request_data, response_data);
        }
    })
};

exports.get_users = function (request_data, response_data) {
    User.getUsers()
        .then(result => {
            responseHandler.success_handler(response_data, result);
        }).catch(error => {
        responseHandler.error_handler(response_data, error);
    })
}

// USER LOGIN API
exports.user_login = function (request_data, response_data) {

    let reqData = request_data.body;
    async.parallel([
        function (done) {
            validator.data_validate(reqData.email.trim(), DATA_TYPES.EMAIL)
                .then(value => {
                    done(null, true);
                }).catch(error => {
                done(error, null);
            })
        },
        function (done) {
            validator.data_validate(reqData.password.trim(), DATA_TYPES.PASSWORD)
                .then(value => {
                    done(null, true)
                }).catch(error => {
                done(error, null);
            });
        },
    ], function (error, result) {
        if (error) {
            errorHandler(response_data, error);
        } else {
            userLogin(reqData, response_data);
        }
    });


}

//USER FORGOT PASSWORD
exports.user_forgot_password = function (request_data, response_data) {
    let reqData = request_data.body;
    validator.data_validate(reqData.email.trim(), DATA_TYPES.EMAIL)
        .then(value => {
            forgotPassword(request_data, response_data);
        }).catch(error => {
        errorHandler(response_data, error);
    });

}

//USER RESET PASSWORD
exports.user_password_reset = function (request_data, response_data) {
    var reqData = request_data.body;

    async.parallel([
        function (done) {
            validator.data_validate(reqData.email.trim(), DATA_TYPES.EMAIL)
                .then(value => {
                    done(null, true);
                }).catch(error => {
                done(error, null);
            })
        },
        function (done) {
            validator.data_validate(reqData.password.trim(), DATA_TYPES.PASSWORD)
                .then(value => {
                    done(null, true)
                }).catch(error => {
                done(error, null);
            });
        },
        function (done) {
            validator.data_validate(reqData.token.trim(), DATA_TYPES.STRING)
                .then(value => {
                    done(null, true)
                }).catch(error => {
                done(error, null);
            });
        }

    ], function (error, result) {
        if (error) {
            errorHandler(response_data, error);
        } else {
            resetPassword(request_data, response_data);
        }
    });
}

//USER ACTIVATE/DEACTIVATE
exports.user_activation = function (request_data, response_data) {
    let reqData = request_data.body;
    validator.data_validate(reqData.id, DATA_TYPES.STRING)
        .then(value => {
            activateUser(reqData, response_data);
        }).catch(error => {
        responseHandler.error_handler(response_data, error);
    });
}

//USER DELETE

exports.user_delete = function (request_data, response_data) {
    let reqData = request_data.body;
    validator.data_validate(reqData.id, DATA_TYPES.STRING)
        .then(value => {
            deleteUser(reqData, response_data);
        }).catch(error => {
        responseHandler.error_handler(response_data, error);

    });
}

//GET USER BY ID
exports.getUserById = function (request_data, response_data) {
    console.log('ID ' + request_data.body.id);
    User.findUserById(request_data.body.id)
        .then(user => {
            console.log(user);
            responseHandler.success_handler(response_data, user);
        }).catch(error => {
        if (error) responseHandler.error_handler(response_data, error);
    })

}

//UPDATE USER
let SALT_WORK_FACTOR = 5;
exports.update_user = async function (request_data, response_data) {
    let preImagePath = null;
    let id = null;
    let update = {};
    for (let x in request_data.body) {
        if (x === "pre_avatar_path") {
            preImagePath = request_data.body[x];
            continue;
        }
        if (x === "_id") {
            id = request_data.body[x];
            continue;
        }
        update[x] = request_data.body[x];
    }
    console.log(update);
    updateUser(id, preImagePath, update, request_data, response_data);

};

//SEARCH USER
exports.user_search = function (request_data, response_data) {
    const userHint = request_data.body.search;
    const pageNumber = request_data.body.page;
    const myCustomLabels = {
        totalDocs: 'itemCount',
        docs: 'users',
        limit: 'perPage',
        nextPage: 'next',
        prevPage: 'prev',
        hasPrevPage: 'hasPrev',
        hasNextPage: 'hasNext',
        pagingCounter: 'pageCounter'
    };
    const options = {
        page: pageNumber,
        limit: 6,
        customLabels: myCustomLabels

    };
    let u = new User();
    let myAggregate = User.aggregate();
    myAggregate.match({name: new RegExp('^' + userHint, "i")})
    User.aggregatePaginate(myAggregate, options).then(function (results) {
        responseHandler.success_handler(response_data, results);
    }).catch(function (err) {
        responseHandler.error_handler(response_data, err);
    })


};

//PAGINATION
exports.user_pagination = function (request_data, response_data) {
    console.log('PAGINATION');

}

function userLogin(req_body, response_data) {
    async.waterfall([
            function (done) {
                User.findUserByEmail(req_body.email)
                    .then(user => {
                        if (user != null) {
                            console.log(user.activated);
                            if (user.activated) {
                                done(null, user);
                            } else {
                                let error = new Error("USER_NOT_ACTIVE");
                                error.code = USER_MESSAGE_CODE.USER_NOT_ACTIVE;
                                done(error, null);
                            }

                        } else {
                            let error = new Error("INVALID_EMAIL_OR_PASSWORD");
                            error.code = USER_MESSAGE_CODE.INVALID_EMAIL_OR_PASSWORD;
                            done(error, null);
                        }

                    }).catch(error => {
                    done(error, null);
                })
            }, function (user, done) {
                bcrypt.compare(req_body.password, user.password, function (error, isMatch) {
                    if (error) {
                        done(error, null);
                    } else {
                        if (isMatch) {
                            done(null, user);
                        } else {
                            let error = new Error("INVALID_EMAIL_OR_PASSWORD");
                            error.code = USER_MESSAGE_CODE.INVALID_EMAIL_OR_PASSWORD;
                            done(error, null);
                        }
                    }
                });
            }, function (user, done) {
                User.findUserAndUpdateLastLogin(req_body.email)
                    .then(updatedResult => {
                        done(null, updatedResult);
                    }).catch(error => {
                    done(error, null);
                })
            }, function (user, done) {
                tokenGenerator.generate(user, DATA_TYPES.NEW_DOCUMENT, (error, token) => {
                    if (error) {
                        done(error, null);
                    } else {
                        done(null, {
                            user: user,
                            token: token
                        });
                    }
                });
            }
        ], function (error, result) {
            if (error) {
                responseHandler.error_handler(response_data, error);
            } else {
                responseHandler.success_handler(response_data, result);
            }
        }
    )
}

function registerUser(request_data, response_data) {
    async.waterfall([
        (done) => {
            util.create_directory(avatarDirectoryPath).then((path) => {
                done(null, path);
            }).catch((error) => {
                done(error, null)
            });
        }, (path, done) => {
            util.moveImage(request_data.file, './uploads/', avatarDirectoryPath, '/images/avatars/')
                .then(result => {
                    done(null, result);
                }).catch(error => {
                done(error, null);
            });
        },
        (result, done) => {
            let user_data = new User(request_data.body);
            user_data.avatar = result;
            user_data.save(function (err, result) {
                if (err) {
                    done(err, null);
                } else {
                    done(null, result);
                }
            });
        }
    ], (error, result) => {
        if (error) {
            responseHandler.error_handler(response_data, error);
        } else {
            responseHandler.success_handler(response_data, result);
        }
    })


}

function resetPassword(request_data, response_data) {
    let email = request_data.body.email;
    let token = request_data.body.token;
    let newPwd = request_data.body.password;
    let request_user;
    async.waterfall([
            function (done) {
                User.findUserByToken(email, token, function (error, user) {
                    if (error) {
                        done(error, null);
                    } else {
                        request_user = user;
                        done(null, user);
                    }

                });
            },
            function (user, done) {
                if (user != null) {
                    User.findUserAndUpdatePassword(email, newPwd, function (error, update) {
                        if (error) {
                            done(error, null);
                        } else {
                            done(null, update);
                        }
                    })
                } else {
                    done(null, null);
                }
            },
            function (user, done) {
                if (user != null) {
                    nodeMailer.send_mail_reset_notification(request_user)
                        .then(result => {
                            done(null, MESSAGES.PASSWORD_RESET_SUCCESSFULLY)
                        }).catch(error => {
                        done(error, null);
                    });
                } else {
                    let error = new Error();
                    error.code = ERROR_CODE.TOKEN_EXPIRED;
                    done(error, null);
                }
            }
        ],
        function (error, result) {
            if (error) {
                responseHandler.error_handler(response_data, error);
            } else {
                responseHandler.success_handler(response_data, result);
            }
        })
}

function forgotPassword(request_data, response_data) {
    let reset_email = request_data.body.email;
    async.waterfall([
        function (done) {
            User.findUserByEmail(reset_email, (error, user) => {
                if (error) {
                    done(error, null);
                } else {
                    done(null, user);
                }
            })
        },
        function (user, done) {
            if (user != null) {
                User.findUserAndResetPassword(reset_email, (error, updatedUser) => {
                    if (error) {
                        done(error, null);
                    } else {
                        done(null, updatedUser);
                    }
                })
            } else {
                let error = new Error();
                error.code = USER_MESSAGE_CODE.INVALID_EMAIL;
                done(error, null);
            }

        },
        function (user, done) {
            emailSettings.getEmailSettings(function (error, settings) {
                if (error) {
                    console.error("ERROR");
                    console.log(error);
                    done(error, null);
                } else {
                    done(null, user, settings);
                }
            });
        },
        function (user, settings, done) {
            if (settings != null) {
                nodeMailer.send_password_reset_code(user, settings)
                    .then(result => {
                        done(null, MESSAGES.EMAIL_SENT)
                    }).catch(error => {
                    done(error, null);
                })
            } else {
                let error = new Error("");
                error.code = USER_MESSAGE_CODE.EMAIL_SETTING_NOT_FOUND;
                done(error, null);
            }


        }
    ], function (error, result) {
        if (error) {
            responseHandler.error_handler(response_data, error);
        } else {
            responseHandler.success_handler(response_data, result);
        }
    })

}

function activateUser(req_body, response_data) {
    User.updateUserStatus(req_body.id.trim(), req_body.status)
        .then(result => {
            let statusCode;
            if (result != null) {
                if (req_body.status)
                    statusCode = USER_MESSAGE_CODE.USER_ACTIVATED;
                else statusCode = USER_MESSAGE_CODE.USER_DEACTIVATED;
            } else {
                statusCode = USER_MESSAGE_CODE.USER_DATA_NOT_FOUND;
            }
            responseHandler.success_handler(response_data, statusCode);
        }).catch(error => {
        responseHandler.error_handler(response_data, error);
    })

}

function deleteUser(req_body, response_data) {
    User.findUserAndDelete(req_body.id)
        .then(status => {
            console.log('STATUS ' + status);
            if (status) {
                responseHandler.success_handler(response_data, USER_MESSAGE_CODE.USED_DELETED);
            } else {
                responseHandler.error_handler(response_data, USER_MESSAGE_CODE.USER_DATA_NOT_FOUND);
            }


        }).catch(error => {
        responseHandler.error_handler(response_data, error);
    })
}


function updateUser(id, preImagePath, updateData, request_data, response_data) {
    async.waterfall([
            (done) => {
                if (preImagePath != null) {
                    util.deleteFile('./public' + preImagePath)
                        .then(result => {
                            done(null, id, preImagePath, updateData)
                        }).catch(error => {
                        done(error, null);
                    })
                } else {
                    done(null, id, preImagePath, updateData);
                }
            },
            (id, preImagePath, update, done) => {
                if (preImagePath != null) {
                    util.create_directory(avatarDirectoryPath).then((path) => {
                        done(null, id, preImagePath, update);
                    }).catch((error) => {
                        done(error, null)
                    });
                } else done(null, id, preImagePath, update);
            }, (id, preImagePath, update, done) => {
                if (preImagePath != null) {
                    util.moveImage(request_data.file, './uploads/', avatarDirectoryPath, '/images/avatars/')
                        .then(path => {
                            update.avatar = path;
                            done(null, id, update);
                        }).catch(error => {
                        done(error, null);
                    });
                } else done(null, id, update);
            }, (id, update, done) => {
                if (update.password) {
                    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
                        if (err) done(err, null);
                        else {
                            bcrypt.hash(update.password, salt, function (err, hash) {
                                if (err) done(err, null);
                                else {
                                    update.password = hash;
                                    done(null, id, update)
                                }
                            });
                        }
                    });
                } else {
                    done(null, id, update);
                }
            }, (id, update, done) => {
                User.updateUser({_id: id}, update)
                    .then(result => {
                        done(null, result);
                    }).catch(error => {
                    done(error, null);
                })
            }
        ],

        function (error, result) {
            if (error) {
                console.log('ERROR');
                responseHandler.error_handler(response_data, error);
            } else {
                console.log('SUCCESS');
                responseHandler.success_handler(response_data, result);
            }
        }
    )
}



