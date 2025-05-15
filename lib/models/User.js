import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstLogin: { type: Boolean, default: true },
    role: { type: String, enum: ['admin', 'sales', 'marketing', 'management'], required: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    designation: { type: String, required: true },
    mobile: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now } // Tracks last update
  });

  // Middleware to update `updated_at` before saving
UserSchema.pre("save", function (next) {
  this.updated_at = Date.now();
  next();
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
