import mongoose from 'mongoose';
import { time } from 'node:console';
// Schema for Persons of Interest (matches your interface)
const POISchema = new mongoose.Schema({
  name: String,
  dob: String,
  role: String,
  statement: String,
  contact: String,
  caseId: String,
  investigatorId: String
},{
    timestamps: true
});
export default mongoose.model('POI', POISchema);