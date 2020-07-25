let mongoose = require('mongoose');
let schema = mongoose.Schema;

let groups = new schema({
    group_name: {type: String, unique: true},
    groups_default: {type: Boolean},
    group_modules: {type: Array}
}, {
    strict: true,
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

groups.statics.getAllGroups = function (cb) {
    return this.model('groups').find({}, cb);
}

groups.statics.deleteGroup = function (id, cb) {
    const filter = {_id: id};
    return this.model('groups').deleteOne(filter, cb);
}

groups.statics.updateModules = function (id, modules, cb) {
    const filter = {_id: id};
    const update = {group_modules: modules};
    return this.model('groups').update(filter, update, {new: true}, cb);
}
groups.index({group_name: 1}, {background: true});
module.exports = mongoose.model('groups', groups);
