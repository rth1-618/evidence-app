import mongoose from 'mongoose';

const caseSchema = new mongoose.Schema({
  caseId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  types: {
    type: String,
    enum: ['Burglary', 'Theft', 'Fraud', 'Assault', 'Homicide', 'Other'],
    required: true,
    default: 'Other'
  },
  description: { type: String }, // Missing in your previous snippet
  notes: { type: String },       // Missing in your previous snippet
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  status: { type: String, default: 'active' },
  // investigatorId: { type: String, required: true }
  investigatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignedOfficers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // FO IDs
  evidenceIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Evidence' }],
  poiIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'POI' }],
}, {
  timestamps: true
});

export default mongoose.model('Case', caseSchema);