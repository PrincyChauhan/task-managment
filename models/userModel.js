const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["admin", "user", "guest"],
    default: "user",
  },
  isInvited: { type: Boolean, default: false },
  inviteToken: { type: String, unique: true },
  inviteSentAt: { type: Date },
  isAccepted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
