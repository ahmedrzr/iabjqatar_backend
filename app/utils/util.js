const fs = require('fs');
const path = require('path');

module.exports.create_directory = function (directoryPath) {
    const directory = path.normalize(directoryPath);

    return new Promise((resolve, reject) => {
        fs.stat(directory, (error) => {
            if (error) {
                if (error.code === 'ENOENT') {
                    fs.mkdir(directory, (error) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(directory);
                        }
                    });
                } else {
                    reject(error);
                }
            } else {
                resolve(directory);
            }
        });
    });
}

module.exports.moveImage = async function (file, srcPath, destPath, publicPath) {
    await new Promise((resolve, reject) => {
        fs.rename(srcPath + file.filename, destPath + '/' + file.filename, function (err) {
            if (err) throw err;
            resolve(file.filename)
        });
    });
    return publicPath + file.filename;
}

async function asyncProcessing(file, srcPath, destPath, publicPath) {
    await new Promise((resolve, reject) => {
        fs.rename(srcPath + file.filename, destPath + file.filename, function (err) {
            if (err) throw err;
            resolve(file.filename)
        });
    });
    return publicPath + file.filename;
}


module.exports.deleteFile = function (path) {
    return new Promise((resolve, reject) => {
        fs.unlink(path, (err) => {
            if (err) {
                reject(err);
            }
            resolve();
        })
    })
}



