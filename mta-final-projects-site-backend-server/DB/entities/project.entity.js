const mongoose = require('mongoose');
const client = require('../');

// Schema definition
const project_Schema = new mongoose.Schema({
    Title: { type: String, required: true },
    WorkshopName: { type: String, required: true },
    WorkshopId: { type: String, required: true },
    ProjectNumber: { type: String , unique: true, required: true},
    ProjectInfo: { type: String},
    ProjectOwners: { type: String, required: true },
    ProjectImage: { type: String },
    Lecturer: { type: String, required: true },
    StudentName: { type: String, required: true },
    StudentEmail: { type: String, required: true },
    StudentPhone: { type: String, required: true },
    Projects_title: { type: String },
    Projects_all: { type: String },
    VideoSource: { type: String },
    Approved_project: { type: Boolean },
    ProjectOwnersId: { type: String },
    Projects_ID: { type: String },
    GitHubLink: { type: String },
    Poster: { type: String },
    Presentation: { type: String },
    ProjectYear: { type: String },
    Projects_All: { type: String },
    CourseOfStudy: { type: String },
} ,{timestamps: true});



// Model creation
const projectsDB = mongoose.model('project_Schema', project_Schema);
module.exports = projectsDB;
