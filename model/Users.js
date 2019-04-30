"use strict";
const mongoose = require('mongoose');
const Promise = require('bluebird');
Promise.promisifyAll(mongoose);

const Users = new mongoose.Schema({
    user_id: {
        type: String
    },
    alias: {
        type: String
    },
    name: {
        type: String
    },
    created_on: {
        type: Date,
        default: new Date()
    },

}, { versionKey: false });

const users = mongoose.model('Users', Users);
module.exports = users;
