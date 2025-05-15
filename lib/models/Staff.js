import mongoose from 'mongoose';

const StaffSchema = new mongoose.Schema({
  staff_id: { type: String, required: true },
  staff_name: { type: String, required: true },
  subjectName: { type: String, required: true },
  organisationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organisation', required: true },
  date: String,
  attendance_status: {type: Boolean, required: true},
  actual: Number,
  present: Number,
  absent: Number,
}, { timestamps: true });

// StaffSchema.index({ subjectName: 1, organisationId: 1, date: 1 }, { unique: true });

export default mongoose.models.Staff || mongoose.model('Staff', StaffSchema);
