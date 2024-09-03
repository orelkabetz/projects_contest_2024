const mongoose = require('mongoose');
const client = require('../');

// Schema definition
const project_assignment_Schema = new mongoose.Schema({
    name: { type: String, required: true },
    assigned_projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'project_Schema' }], 
    judges:[{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }], 
}, { timestamps: true });

// Model creation
const Projects_assignmentsDB = mongoose.model('projects_assignment', project_assignment_Schema);
module.exports = Projects_assignmentsDB;