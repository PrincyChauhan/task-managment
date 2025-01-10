import mongoose from "mongoose";
import commonFields from "./commonFields.js";

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
  invitedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    default: null,
  },
  inviteToken: { type: String, unique: true, sparse: true },
  inviteSentAt: { type: Date },
  isAccepted: { type: Boolean, default: false },

  // Fields for forgot password functionality
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },

  ...commonFields,
});

const userModel = mongoose.models.User || mongoose.model("User", userSchema);
export default userModel;
