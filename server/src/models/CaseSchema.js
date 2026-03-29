import mongoose from 'mongoose';
import { time } from 'node:console';

const caseSchema = new mongoose.Schema({
  //id: { type: String, required: true, unique: true },
  caseId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  types: { type: String, required: true },
  status: { type: String, default: 'active' },
  investigatorId: { type: String, required: true }
},{
    timestamps: true
});

export default mongoose.model('Case', caseSchema);