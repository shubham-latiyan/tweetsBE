"use strict";
const mongoose = require('mongoose');
const Promise = require('bluebird');
Promise.promisifyAll(mongoose);

const Tweets = new mongoose.Schema({
    user_id: {
        type: String,
        ref: 'Users'
    },
    text: {
        type: String,
        trim: true,
    },
    id_str: {
        type: String
    },
    lang: {
        type: String
    },
    favorite_count: {
        type: Number,
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    created_on: {
        type: Date,
        default: new Date()
    },
    created_at: {
        type: Date,
    },
    retweeted:{
        type: Boolean
    },
    source: {
        type: String
    },
    truncated: {
        type: Boolean
    }

}, { versionKey: false });

const tweets = mongoose.model('Tweets', Tweets);
module.exports = tweets;
