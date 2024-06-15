const mongoose = require('mongoose');
const client = require('..');

// Schema definition
const available_preferences = new mongoose.Schema({
    Preference: { type: String, unique: true, required: true },
} ,{timestamps: true});


// Model creation
const availablePreferencesDB = mongoose.model('available_preferences', available_preferences);
module.exports = availablePreferencesDB;