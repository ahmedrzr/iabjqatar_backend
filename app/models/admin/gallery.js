const mongoose = require('mongoose');
const schema = mongoose.Schema;

let gallery = new schema({
    event_name: {type: String},
    event_date: {type: Date, default: Date.now()},
    event_desc: {type: String},
    event_images: {type: Array}
}, {
    strict: true,
    timestamps: {
        created_at: 'created_at',
        updated_at: ' updated_at'
    }
});

gallery.statics.getEventGalleries = function (cb) {
    return this.model('gallery').find({}, cb);
}

gallery.statics.deleteEventGallery = function (id, cb) {
    return this.model('gallery').findOneAndDelete({_id: id}, cb);
}

gallery.statics.updateEventGallery = function (event, cb) {
    const filter = {_id: event.id};
    // const update = {'$push': {event_images: event.event_images}};
    return this.model('gallery').updateOne(filter, event, {new: true}, cb);
}

module.exports = mongoose.model('gallery', gallery);

