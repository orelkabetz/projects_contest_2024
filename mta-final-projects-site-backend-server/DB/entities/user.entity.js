const mongoose = require('mongoose');
const client = require('../');

// Schema definition
const userSchema = new mongoose.Schema({
    ID: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    type: { type: String, required: true, default: "judge" },
    selected_preferences: [{ type: String }], 
}, { timestamps: true });

// Model creation
const UserDB = mongoose.model('user', userSchema);
module.exports = UserDB;