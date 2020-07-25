let responseHandler = require('../handlers/ResponseHandler')
let util = require('../../utils/util');
let async = require('async');
let fs = require('fs');
let BannerModel = require('../../models/admin/banners');

const bannerDirectoryPath = './public/images/banners';

exports.banner_upload = function (request_data, response_data) {

    async.waterfall([
        (done) => {
            util.create_directory(bannerDirectoryPath).then((path) => {
                done(null, path);
            }).catch((error) => {
                done(error, null)
            });
        }, (path, done) => {
            moveBanners(request_data.files)
                .then(result => {
                    done(null, result);
                }).catch(error => {
                done(error, null);
            });
        },
        (result, done) => {
            BannerModel.updateBanner(result, (error, update) => {
                if (error) done(error, null);
                else done(null, update);
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
exports.get_banners = function (request_data, response_data) {
    BannerModel.getBanners(function (error, result) {
        if (error) {
            responseHandler.error_handler(response_data, error);
        } else {
            responseHandler.success_handler(response_data, result);
        }
    });
}

async function asyncProcessing(file) {
    await new Promise((resolve, reject) => {
        fs.rename('./uploads/' + file.filename, bannerDirectoryPath + "/" + file.filename, function (err) {
            if (err) throw err;
            resolve(file.filename)
        });
    });
    return '/images/banners/' + file.filename;
}

async function moveBanners(files) {
    const promises = files.map(file =>
        asyncProcessing(file));
    const result = await Promise.all(promises)
    return result
}
