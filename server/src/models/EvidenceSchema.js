import mongoose from 'mongoose';

const evidenceSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // EV-001
  title: { type: String, required: true },
  type: { type: String, required: true },
  caseId: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['active', 'pending', 'in-lab', 'disposed'], 
    default: 'active' 
  },
  location: {
    lat: Number,
    lng: Number,
    address: String
  },
  submittedBy: String,
  submittedDate: { type: String, default: () => new Date().toISOString().split('T')[0] },
  description: String,
  storedAt: String,
  markedForCourt: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('evidence', evidenceSchema);
