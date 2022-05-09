const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// creating a model for the users
const TweetSchema = new Schema({
    user: {
        // look into this more
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    text: {
        type: String,
        required: true
    },
    date: {
        // check this out too
        type: Date,
        default: Date.now
    }
});

const Tweet = mongoose.model('Tweet', TweetSchema);
module.exports = Tweet;