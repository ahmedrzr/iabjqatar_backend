let bannerController = require('../../controllers/admin/banners');


module.exports = function (app, upload) {
    app.route('/api/banners').post(upload.array('photo', 10), bannerController.banner_upload);
    app.route('/api/get_banners').get(bannerController.get_banners);


}
