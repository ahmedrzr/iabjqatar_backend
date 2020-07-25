const mailSettings = require('../../controllers/admin/mailsettings');
const tokenValidator = require('./../../controllers/auth/token_validator');

module.exports = function (app) {
    app.route('/api/email_settings').post(tokenValidator.validate, mailSettings.email_settings);
    app.route('/api/update_email_settings').post(mailSettings.email_settings_update);
}
