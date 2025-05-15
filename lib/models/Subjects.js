import mongoose from "mongoose";

const SubjectSchema = new mongoose.Schema({
  organisationId: { type: mongoose.Schema.Types.ObjectId, ref: "Organisation" },
  semesterName: String,
  programName: String,
  schoolName: String,
  date: String,
  name: String,
  actual: Number,
  present: Number,
  absent: Number,
  staff_id: String,
  staff_name: String,
}, { timestamps: true });

export default mongoose.models.Subject || mongoose.model("Subject", SubjectSchema);
