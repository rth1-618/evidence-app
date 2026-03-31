import mongoose from 'mongoose';
import { POISchema } from './poiSchema.js';

const evidenceSchema = new mongoose.Schema({
  // Manual ID (e.g., "EV-123")
  evidenceId: { type: String, unique: true },

  title: { type: String, required: true },
  type: { type: String, required: true }, // e.g., 'physical', 'digital'
  description: { type: String },
  // caseId: { type: String, required: true },
  caseId: { type: mongoose.Schema.Types.String, ref: 'Case', default: null },

  // Media Arrays (Storing Cloudinary URLs)
  img: [{ type: String }],
  voiceNote: [{ type: String }],
  video: [{ type: String }],


  status: {
    type: String,
    enum: ['active', 'pending', 'in-lab', 'unassigned', 'disposed'],
    default: 'pending'
  },

  // Location details
  locationFound: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    address: { type: String, required: true }
  },
  currentLocation: {
    lat: Number,
    lng: Number,
    address: String
  },

  // Metadata
  submittedBy: { type: String, required: true }, // User ID or Name
  submittedByBadge: { type: String, required: true },
  investigatorIds: [{ type: String }],
  submittedDate: { type: String, default: () => new Date().toISOString() },

  // Additional Info
  qrCode: { type: String },
  storedAt: { type: String },
  pois: [POISchema],
  markedForCourt: { type: Boolean, default: false }

}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

evidenceSchema.virtual('caseDetails', {
  ref: 'Case',           // The model to use
  localField: 'caseId',  // Find cases where 'caseId' matches...
  foreignField: 'caseId', // ...this field in the Case collection
  justOne: true          // Returns a single object instead of an array
});


// Note: MongoDB automatically creates an '_id', 
// so we use 'evidenceId' for your custom string ID.
export default mongoose.model('Evidence', evidenceSchema);