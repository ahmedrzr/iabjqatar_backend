let mongoose = require('mongoose');
let schema = mongoose.Schema;

let modules = new schema({
    module_name: {type: String, required: true}
});

module.exports = mongoose.model("modules", modules);
