import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: {
    type: String,
    required: function () {
      return !this.isInvited; // Password is required only if the user is not invited
    },
  },
  role: {
    type: String,
    enum: ["admin", "user", "guest"],
    default: "admin",
  },
  isInvited: { type: Boolean, default: false },
  inviteToken: { type: String, unique: true, sparse: true },
  inviteSentAt: { type: Date },
  isAccepted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const userModel = mongoose.model.user || mongoose.model("user", userSchema);
export default userModel;
