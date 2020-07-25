let emailSettingModel = require('../../models/admin/MailSettings');
let responseHandler = require('./../handlers/ResponseHandler');
let validator = require("../../utils/DataValidation");
let async = require('async');

exports.email_settings = function (request_data, response_data,next) {
    let reqData = request_data.body;
    async.parallel([
        function (done) {
            validator.data_validate(reqData.email_address.trim(), DATA_TYPES.EMAIL)
                .then(value => {
                    done(null, true);
                }).catch(error => {
                done(error, null);
            })
        },
        function (done) {
            validator.data_validate(reqData.email_password.trim(), DATA_TYPES.PASSWORD)
                .then(value => {
                    done(null, true)
                }).catch(error => {
                done(error, null);
            });
        },
    ], function (error, result) {
        if (error) {
            responseHandler.error_handler(response_data, error);
        } else {
            emailSettings(request_data.body, response_data);
        }
    });

}

exports.email_settings_update = function (request_data, response_data) {
    console.log("Mail setting_update controller");
    let reqData = request_data.body;
    async.parallel([
        function (done) {
            validator.data_validate(reqData.email_address.trim(), DATA_TYPES.EMAIL)
                .then(value => {
                    done(null, true);
                }).catch(error => {
                done(error, null);
            })
        },
        function (done) {
            validator.data_validate(reqData.email_password.trim(), DATA_TYPES.PASSWORD)
                .then(value => {
                    done(null, true)
                }).catch(error => {
                done(error, null);
            });
        },
    ], function (error, result) {
        if (error) {
            responseHandler.error_handler(response_data, error);
        } else {
            emailSettingUpdate(request_data.body, response_data);
        }
    });

}

function emailSettings(reqBodyData, response_data) {
    console.log(reqBodyData);
    let emailSettings = new emailSettingModel({
        'email_address': reqBodyData.email_address,
        'email_password': reqBodyData.email_password
    });

    emailSettings.save(function (error, result) {
        if (error) {
            responseHandler.error_handler(response_data, error);
        } else {
            responseHandler.success_handler(response_data, result);
        }
    });
}

function emailSettingUpdate(reqBodyData, response_data) {
    emailSettingModel.updateEmailSettings(reqBodyData.email_address,
        reqBodyData.email_password, (error, result) => {
            if (error) {
                responseHandler.error_handler(response_data, error);
            } else {
                responseHandler.success_handler(response_data, result);
            }
        });
}
