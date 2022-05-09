const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// creating a model for the users
const UserSchema = new Schema({
    handle: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
    }, {
    timestamps: true
});

const User = mongoose.model('User', UserSchema);
module.exports = User;