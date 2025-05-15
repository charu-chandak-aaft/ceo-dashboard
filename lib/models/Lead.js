import mongoose from "mongoose";

// Leads Schema
const LeadSchema = new mongoose.Schema({
    // user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    lead_source_url: { type: String, required: true },
    contact_type: { type: String, enum: ['email', 'phone', 'chat'], default: 'chat' },
    lead_status: { type: String, enum: ['new', 'contacted', 'converted', 'lost'], default: 'new' },
    timestamp: { type: Date, default: Date.now }
});
const Leads = mongoose.model("leads", LeadSchema);
export default Leads;

