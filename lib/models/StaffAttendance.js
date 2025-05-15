import mongoose from 'mongoose';

const staffAttendanceSchema = new mongoose.Schema({
  staff_id: { type: String, required: true },
  staff_name: { type: String, required: true },
  subjectName: { type: String, required: true },
  organisationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organisation', required: true },
  date: String,
  attendance_status: { type: Boolean, required: true },
  actual: { type: Number, required: true },
  present: { type: Number, required: true },
  absent: { type: Number, required: true },
}, { timestamps: true });

const StaffAttendance = mongoose.models.staff || mongoose.model('staff', staffAttendanceSchema);

export default StaffAttendance;
