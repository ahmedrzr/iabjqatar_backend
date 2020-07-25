


exports.success_handler = function (response, data) {
    response.json({success: true, result: data});
}

exports.error_handler = function (response, error) {
    response.json({success: false, message: error.message, code: error.code});
}
