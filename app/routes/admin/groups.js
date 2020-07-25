let groups = require('../../controllers/admin/groups');

module.exports = function (app) {
    app.route('/api/group/register').post(groups.group_register);
    app.route('/api/group/all').get(groups.getRegisteredGroups);
    app.route('/api/group/modules').post(groups.module_creation);
    app.route('/api/group/delete').post(groups.delete_group);
    app.route('/api/group/update_modules').post(groups.updateGroupModules);
}
