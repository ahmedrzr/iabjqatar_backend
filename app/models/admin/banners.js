let mongoose = require('mongoose');
let schema = mongoose.Schema;

let banners = new schema({
    banner_name: {type: String},
    banner_msg: {type: String},
    image_url: {type: Array}
}, {
    strict: true,
    timestamps: {
        created_at: 'created_at',
        updated_at: 'updated_at'
    }
});

banners.statics.getBannerCount = function (cb) {
    return this.model('banners').countDocuments({}, cb);
}

banners.statics.updateBanner = function (images, cb) {
    return this.model('banners').update({}, {$push: {image_url: {$each: images}}}, {upsert: true}, cb);
}

banners.statics.getBanners = function (cb) {
    return this.model('banners').findOne({},cb);
}
module.exports = mongoose.model('banners', banners);

