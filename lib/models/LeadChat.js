import mongoose from "mongoose";

// Chatbot Interactions Schema
const ChatbotInteractionSchema = new mongoose.Schema({
    // user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    session_id: { type: String, required: true },
    interaction_count: { type: Number, required: true },
    unique: { type: Boolean, default: true },
    messages: [
      { question: String, response: String }
    ],
    timestamp: { type: Date, default: Date.now }
  });
const LeadsChat = mongoose.model("leadsChat", ChatbotInteractionSchema);
export default LeadsChat;


