import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // We will hash this later
  role: { 
    type: String, 
    enum: ['EVIDENCE_MANAGER', 'FIELD_OFFICER', 'INVESTIGATOR', 'CUSTODIAN'], 
    required: true 
  },
  badge: String,
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
