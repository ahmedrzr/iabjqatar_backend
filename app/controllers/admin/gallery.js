let responseHandler = require('../handlers/ResponseHandler')
let util = require('../../utils/util');
let async = require('async');
let fs = require('fs');
let GalleryModel = require('../../models/admin/gallery');

const galleryDirectoryPath = './public/images/gallery';

exports.getEventGalleries = function (request_data, response_data) {
    GalleryModel.getEventGalleries((error, result) => {
         if(error) responseHandler.error_handler(response_data,error);
         else responseHandler.success_handler(response_data,result);
    })
}

exports.add_event_gallery = function (request_data, response_data) {
    addEventGallery(request_data, response_data);

}

exports.delete_event_gallery = function (request_data, response_data) {
    deleteEventGallery(request_data.body.id, response_data);
}

exports.update_event_gallery = function (request_data, response_data) {
    console.log("UPDATE EVENT CONTROLLER");
    updateEventGallery(request_data, response_data);
}

function updateEventGallery(request_data, response_data) {
    async.waterfall([
        (done) => {
            util.create_directory(galleryDirectoryPath).then((path) => {
                done(null, path);
            }).catch((error) => {
                done(error, null)
            });
        }, (path, done) => {
            moveGalleryImages(request_data.files)
                .then(result => {
                    done(null, result);
                }).catch(error => {
                done(error, null);
            });
        },
        (eventImages, done) => {
            const req_body = request_data.body;
            let event = {
                id: req_body.id,
                event_name: req_body.event_name,
                event_date: req_body.event_date,
                event_desc: req_body.event_desc,
                event_images: eventImages
            }
            console.log(event);
            GalleryModel.updateEventGallery(event, (error, result) => {
                if (error) console.error(error.message);
                else console.log(result);
            })
            // let galleryModel = new GalleryModel(event);
            // galleryModel.save((error, result) => {
            //     if (error) done(error, null);
            //     else done(null, result);
            // })

        }
    ], (error, result) => {
        if (error) {
            responseHandler.error_handler(response_data, error);
        } else {
            responseHandler.success_handler(response_data, result);
        }
    })
}

function addEventGallery(request_data, response_data) {
    async.waterfall([
        (done) => {
            util.create_directory(galleryDirectoryPath).then((path) => {
                done(null, path);
            }).catch((error) => {
                done(error, null)
            });
        }, (path, done) => {
            moveGalleryImages(request_data.files)
                .then(result => {
                    done(null, result);
                }).catch(error => {
                done(error, null);
            });
        },
        (eventImages, done) => {
            const req_body = request_data.body;
            let event = {
                event_name: req_body.event_name,
                event_date: req_body.event_date,
                event_desc: req_body.event_desc,
                event_images: eventImages
            }
            let galleryModel = new GalleryModel(event);
            galleryModel.save((error, result) => {
                if (error) done(error, null);
                else done(null, result);
            })

        }
    ], (error, result) => {
        if (error) {
            responseHandler.error_handler(response_data, error);
        } else {
            responseHandler.success_handler(response_data, result);
        }
    })
}

function deleteEventGallery(eventId, response_data) {
    GalleryModel.deleteEventGallery(eventId, (error, status) => {
        if (error) responseHandler.error_handler(response_data, error);
        else responseHandler.success_handler(response_data, status);
    })
}

async function asyncProcessing(file) {
    await new Promise((resolve, reject) => {
        fs.rename('./uploads/' + file.filename, galleryDirectoryPath + "/" + file.filename, function (err) {
            if (err) throw err;
            resolve(file.filename)
        });
    });
    return '/images/banners/' + file.filename;
}

async function moveGalleryImages(files) {
    const promises = files.map(file =>
        asyncProcessing(file));
    const result = await Promise.all(promises)
    return result
}

