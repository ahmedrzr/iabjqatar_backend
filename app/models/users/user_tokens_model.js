let mongoose = require('mongoose');
let schema = mongoose.Schema;
const timeToliveDocumentInSecond = 120;

let tokens = new schema({
    user_id: {type: String},
    user_name: {type: String},
    user_email: {type: String},
    user_type: {type: Number},
    token: {type: String},
    expire_at: {type: Date, default: Date.now()}
});

tokens.statics.getRefreshToken = function (token) {
    return this.model('refresh_tokens').findOne({token: token});
}

tokens.statics.setTokenUpdate = function (id, accessToken) {
    let filter = {'user_id': id};
    let update = {'token': accessToken};
    return this.model('refresh_tokens').findOneAndUpdate(filter, update, {new: true});
}

tokens.index('expire_at', {expireAfterSeconds: timeToliveDocumentInSecond});
tokens.index({token: 1, user_id: 1}, {background: true});
module.exports = mongoose.model('refresh_tokens', tokens);
