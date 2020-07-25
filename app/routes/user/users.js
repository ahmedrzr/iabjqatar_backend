let users = require('../../controllers/users/users');

module.exports = function (app, upload) {
    app.route('/api/user/register').post(upload.single('avatar'), users.user_register);
    app.route('/api/user/login').post(users.user_login);
    app.route('/api/user/forgot_password').post(users.user_forgot_password);
    app.route('/api/user/reset_password').post(users.user_password_reset)
    app.route('/api/user/activate').post(users.user_activation);
    app.route('/api/user/user_delete').post(users.user_delete);
    app.route('/api/users/all').get(users.get_users);
    app.route('/api/users/user').post(users.getUserById);
    app.route('/api/users/user/update').post(upload.single('avatar'), users.update_user);
    app.route('/api/users/search').post(users.user_search);
};
