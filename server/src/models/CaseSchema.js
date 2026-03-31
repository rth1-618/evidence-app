import mongoose from 'mongoose';
import { time } from 'node:console';

const caseSchema = new mongoose.Schema({
  caseId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  types: { type: String, required: true },
  type: { type: String, enum: ['Burglary', 'Theft', 'Fraud', 'Assault', 'Other'], required: true },
  status: { type: String, default: 'active' },
  // investigatorId: { type: String, required: true }
  investigatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignedOfficers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // FO IDs
  evidenceIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Evidence' }],
}, {
  timestamps: true
});

export default mongoose.model('Case', caseSchema);