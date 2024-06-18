const mongoose = require('mongoose');
const client = require('../');

// Schema definition
const potential_user_Schema = new mongoose.Schema({
    ID: { type: String, unique: true, required: true },
} ,{timestamps: true});

// Model creation
const potentialUserDB = mongoose.model('potential_user', potential_user_Schema);
module.exports = potentialUserDB;