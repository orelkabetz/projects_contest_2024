const mongoose = require('mongoose');

const projectsJudgesGroupSchema = new mongoose.Schema({
  id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  project_ids: [{ type: String, ref: 'Project', required: true }],
  judge_ids: [{ type: String, ref: 'Judge', required: true }],
}, { timestamps: true });

const ProjectsJudgesGroup = mongoose.model('projects_judges_group', projectsJudgesGroupSchema);

module.exports = ProjectsJudgesGroup;