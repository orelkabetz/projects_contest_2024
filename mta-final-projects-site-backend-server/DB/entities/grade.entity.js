const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({
  id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  project_id: { type: Number, required: true },
  judge_id: { type: Number, required: true },
  complexity: { type: Number, required: true },
  usability: { type: Number, required: true },
  innovation: { type: Number, required: true },
  presentation: { type: Number, required: true },
  proficiency: { type: Number, required: true },
  additionalComment: { type: String, default: '' },
  grade: { type: Number, required: true },
}, { timestamps: true });

// Create a unique index on the combination of judge_id and project_id
gradeSchema.index({ judge_id: 1, project_id: 1 }, { unique: true });

const Grade = mongoose.model('Grade', gradeSchema);

module.exports = Grade;