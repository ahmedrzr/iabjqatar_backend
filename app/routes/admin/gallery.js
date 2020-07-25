let galleryController = require('../../controllers/admin/gallery');

module.exports = function (app, upload) {
    app.route('/api/gallery/get_galleries').get(galleryController.getEventGalleries);
    app.route('/api/gallery/add_event_gallery').post(upload.array('photo', 10), galleryController.add_event_gallery);
    app.route('/api/gallery/delete_event_gallery').post(galleryController.delete_event_gallery);
    app.route('/api/gallery/update_event_gallery').post(upload.array('photo', 10), galleryController.update_event_gallery);
}
