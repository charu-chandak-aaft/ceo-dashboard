import mongoose from "mongoose";

const SemesterSchema = new mongoose.Schema({
  organisationId: { type: mongoose.Schema.Types.ObjectId, ref: "Organisation" },
  programName: String,
  schoolName: String,
  date: String,
  name: String,
  total_actual: Number,
  total_present: Number,
  total_absent: Number,
}, { timestamps: true });

export default mongoose.models.Semester || mongoose.model("Semester", SemesterSchema);
