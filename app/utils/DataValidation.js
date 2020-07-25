require('./constents');
require('./code_messages');
require('./error_code');
require('./message_code');



exports.data_validate = function (value, type) {
    let error = new Error("VALIDATION ERROR ");
    let code = 0;
    return new Promise((resole, reject) => {

        if (type === DATA_TYPES.PASSWORD) {
            if (!value) {
                code = USER_MESSAGE_CODE.EMPTY_FIELD_MISSING
                error.code = code;
                reject(error)
            } else if (value.length > 24) {
                code = USER_MESSAGE_CODE.PASSWORD_LENGHT_MAX_EXCEEDED;
                error.code = code;
                reject(error)
            }
        } else if (type === DATA_TYPES.STRING) {
            if (!value) {
                code = USER_MESSAGE_CODE.TOKEN_MISSING;
                error.code = code;
                reject(error)
            }
        } else if (type === DATA_TYPES.EMAIL) {
            if (!value) {
                code = USER_MESSAGE_CODE.EMPTY_FIELD_MISSING;
                error.code = code;
                reject(error)
            } else {
                if (!isEmailValid(value)) {
                    code = USER_MESSAGE_CODE.INVALID_EMAIL_FORMAT;
                    error.code = code;
                    reject(error);
                }
            }
        }
        resole(value);
    });


}

var emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

function isEmailValid(email) {
    if (!email)
        return false;

    if (email.length > 254)
        return false;

    var valid = emailRegex.test(email);
    if (!valid)
        return false;

    // Further checking of some things regex can't handle
    var parts = email.split("@");
    if (parts[0].length > 64)
        return false;

    var domainParts = parts[1].split(".");
    if (domainParts.some(function (part) {
        return part.length > 63;
    }))
        return false;

    return true;
}
