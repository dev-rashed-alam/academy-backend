const mongoose = require('mongoose');

const blacklistedTokenSchema = mongoose.Schema({
    token: {type: String, required: true, unique: true}
}, {timestamps: true});

const BlacklistedToken = mongoose.model('BlacklistedToken', blacklistedTokenSchema);

module.exports = BlacklistedToken
