import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import sendMail from "../utils/sendMail.js";

const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Admin already exists." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: "admin",
    });
    await newUser.save();
    res.status(201).json({ message: "Admin Register successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error during signup." });
  }
};

const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Admin not found." });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Only admins can sign in." });
    }
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).json({ message: "Signin successfully.", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error during signin." });
  }
};

// Admin creates a user and sends an invitation
const inviteUser = async (req, res) => {
  try {
    const { username, email, role } = req.body;
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Only admins can invite users." });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }
    const inviteToken = crypto.randomBytes(16).toString("hex");
    const newUser = new User({
      username,
      email,
      role: role || "user",
      isInvited: true,
      inviteToken,
      inviteSentAt: new Date(),
      invitedBy: decoded.userId,
    });
    await newUser.save();

    const emailSubject = "Invitation to join Task Manager";
    const emailMessage = `
      <h1>Hello ${username},</h1>
      <p>You have been invited to join our platform as a ${role || "user"}.</p>
      <p>Use the following token to complete your registration:</p>
      <code>${inviteToken}</code>
      <p>Note: This token is valid for 24hr only.</p>
    `;

    await sendMail({ email }, emailSubject, emailMessage);

    res.status(201).json({
      message: "User invited successfully.",
      inviteToken,
      user: newUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error inviting user." });
  }
};

const acceptInvitation = async (req, res) => {
  try {
    const { inviteToken, password } = req.body;
    if (!inviteToken) {
      return res.status(400).json({ message: "Invite token is required." });
    }

    const user = await User.findOne({ inviteToken, isInvited: true });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired invite token." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.isInvited = false;
    user.isAccepted = true;

    user.inviteToken = null;

    await user.save();

    res.status(200).json({ message: "Invitation accepted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error accepting invitation." });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({
      email,
    });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpries = Date.now() + 3600000;

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpries = resetTokenExpries;

    await user.save();

    console.log(
      `Password reset link: http://localhost:5000/reset-password/${resetToken}`
    );

    const resetPasswordLink = `http://localhost:5000/reset-password/${resetToken}`;

    const subject = "Password Reset Request";
    const message = `
    <h1>Password Reset Request</h1>
    <p>Hi ${user.username},</p>
    <p>You have requested to reset your password. Click the link below to reset it:</p>
    <a href="${resetPasswordLink}" target="_blank">Reset Password</a>
    <p>If you did not request this, please ignore this email.</p>
    <p>This link will expire in 1 hour.</p>
  `;

    console.log("---------------");
    await sendMail({ email: user.email }, subject, message);

    console.log("---------------");

    res.status(200).json({
      message: "Password reset email sent successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error in sending password reset email",
      error,
    });
  }
};

const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired token",
      });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error in reseting password",
      error,
    });
  }
};

export {
  signup,
  signin,
  inviteUser,
  acceptInvitation,
  forgotPassword,
  resetPassword,
};
