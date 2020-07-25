let emailSettings = require('../../models/admin/MailSettings');



exports.send_password_reset_code = function (request_user, settings) {
    let sender_email_id = settings.email_address;
    let sender_email_pwd = settings.email_password;
    let service_provider = 'gmail';
    let mail_subject = "Verification code to reset IABJQATAR password!";
    let templatePath = "reset_password";
    return new Promise((resolve, reject) => {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
        let nodemailer = require('nodemailer');
        let transport = nodemailer.createTransport({
            service: service_provider,
            auth: {
                user: sender_email_id,
                pass: sender_email_pwd
            }
        });
        let EmailTemplate = require('email-templates').EmailTemplate;
        let path = require('path');

        let templateDir = path.join(__dirname, '../../templates/' + templatePath);

        let myTemplate = new EmailTemplate(templateDir);
        let locals = {
            user: request_user.name,
            token: request_user.reset_password_token,
            data: request_user
        };
        myTemplate.render(locals, function (err, results) {
            if (err) {
                return console.error(err)
            }

            transport.sendMail({
                from: sender_email_id,
                to: request_user.email,
                subject: mail_subject,
                html: results.html,
                text: results.text
            }, function (err, responseStatus) {
                if (err) {
                    reject(err);
                } else {
                    resolve(responseStatus);
                }
            })
        })
    })

};

exports.send_mail_reset_notification = function (request_user) {

    let sender_email_id = "ahmedrzr@gmail.com";
    let sender_email_pwd = "khkana@01";
    let service_provider = 'gmail';
    let mail_subject = "You've just changed your password";
    let templatePath = "reset_password_notification";


    return new Promise((resolve, reject) => {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
        let nodemailer = require('nodemailer');
        let transport = nodemailer.createTransport({
            service: service_provider,
            auth: {
                user: sender_email_id,
                pass: sender_email_pwd
            }
        });
        let EmailTemplate = require('email-templates').EmailTemplate;
        let path = require('path');

        let templateDir = path.join(__dirname, '../../templates/' + templatePath);

        let myTemplate = new EmailTemplate(templateDir);
        console.log(request_user);
        let locals = {
            user: request_user.name,
            token: request_user.reset_password_token,
            data: request_user
        };
        myTemplate.render(locals, function (err, results) {
            if (err) {
                return (err)
            }

            transport.sendMail({
                from: sender_email_id,
                to: request_user.email,
                subject: mail_subject,
                html: results.html,
                text: results.text
            }, function (err, responseStatus) {
                if (err) {
                    reject(err);
                } else {
                    resolve(responseStatus);
                }
            })
        })
    })
};

function sendRecoveryCode(settings, request_user) {


}
