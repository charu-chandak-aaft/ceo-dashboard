import mongoose from "mongoose";

const SchoolSchema = new mongoose.Schema({
  organisationId: { type: mongoose.Schema.Types.ObjectId, ref: "Organisation" },
  date: String,
  name: String,
  total_actual: Number,
  total_present: Number,
  total_absent: Number,
}, { timestamps: true });

export default mongoose.models.School || mongoose.model("School", SchoolSchema);
