import mongoose from "mongoose";

const OrganisationSchema= new mongoose.Schema({
//   organisationId: { type: mongoose.Schema.Types.ObjectId, ref: "Organisation" },
  name: String,
 isActive: Boolean,
});

export default mongoose.models.Organisation || mongoose.model("Organisation", OrganisationSchema);
