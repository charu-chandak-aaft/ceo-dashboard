import mongoose from "mongoose";

const ProgramSchema = new mongoose.Schema({
  organisationId: { type: mongoose.Schema.Types.ObjectId, ref: "Organisation" },
  schoolName: String,
  date: String,
  name: String,
  total_actual: Number,
  total_present: Number,
  total_absent: Number,
}, { timestamps: true });

export default mongoose.models.Program || mongoose.model("Program", ProgramSchema);
