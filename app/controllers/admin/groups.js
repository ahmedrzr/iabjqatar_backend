let Group = require('../../models/groups/groups');
let Modules = require('../../models/groups/modules');
let responseHandler = require('../../controllers/handlers/ResponseHandler')

module.exports.group_register = function (request_data, response_data) {
    let groupName = request_data.body.group_name;
    let group = new Group({
        group_name: groupName
    });
    group.save(function (err, result) {
        if (err) {
            responseHandler.error_handler(response_data, err);
        } else {
            responseHandler.success_handler(response_data, result);
        }
    });
}

module.exports.getRegisteredGroups = function (request_data, response_data) {
    Group.getAllGroups((error, result) => {
        if (error) {
            responseHandler.error_handler(response_data, error);
        } else {
            responseHandler.success_handler(response_data, result);
        }
    })
}

module.exports.module_creation = function (request_data, response_data) {
    const moduleName = request_data.body.module_name;
    moduleCreation(moduleName, response_data);
}

module.exports.updateGroupModules = function (request_data, response_data) {
    const groupId = request_data.body.group_id;
    const modules = request_data.body.group_modules;
    updateGroupModule(groupId, modules, response_data);
}

module.exports.delete_group = function (request_data, response_data) {
    const groupId = request_data.body.group_id;
    deleteGroup(groupId, response_data);
}

function updateGroupModule(groupId, modules, response_data) {
    Group.updateModules(groupId, modules, (error, result) => {
        if (error) responseHandler.error_handler(response_data, error);
        else responseHandler.success_handler(response_data, result);
    })
}

function deleteGroup(id, response_data) {
    Group.deleteGroup(id, (error, result) => {
        if (error) responseHandler.error_handler(response_data, error);
        else responseHandler.success_handler(response_data, result);
    })
}

function moduleCreation(moduleName, response_data) {
    let webModules = new Modules({
        module_name: moduleName
    });
    webModules.save(webModules)
        .then(result => {
            responseHandler.success_handler(response_data, result);
        }).catch(error => {
        responseHandler.error_handler(response_data, error);
    })
}





