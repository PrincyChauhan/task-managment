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
      return res
        .status(400)
        .json({ success: false, message: "Admin already exists." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: "admin",
    });
    await newUser.save();
    res
      .status(201)
      .json({ success: true, message: "Admin Register successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error during signup." });
  }
};

const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Admin not found." });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials." });
    }
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).json({
      success: true,
      message: "Signin successfully.",
      token,
      role: user.role,
      userId: user._id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error during signin." });
  }
};

const createInviteUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const adminId = req.user.userId;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User Already Exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user object
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: role || "user",
      isInvited: true,
      invitedBy: adminId,
    });

    // Save the new user to the database
    await newUser.save();

    // Send invite email
    const subject = "Welcome! Your Account Details";
    const message = `
      <p>Hi ${username},</p>
      <p>Your account has been successfully created.</p>
      <p>Login with the following credentials:</p>
      <ul>
      <li>Username:${username}</li>
        <li>Email: ${email}</li>
        <li>Password: ${password}</li>
      </ul>
      <p>Best Regards, Your Team</p>
    `;

    // Send the invitation email

    try {
      await sendMail(newUser, subject, message);
    } catch (emailError) {
      console.error("Error sending email:", emailError);
      return res.status(500).json({
        message: "User created but invitation email failed to send",
        error: emailError.message,
      });
    }
    // Respond with success message
    res.status(200).json({
      success: true,
      message: "User created and invited successfully.",
      user: newUser,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({
      message: "Error creating user",
      error: error.message,
    });
  }
};

const acceptInvitation = async (req, res) => {
  try {
    const { inviteToken, password } = req.body;
    if (!inviteToken) {
      return res
        .status(400)
        .json({ success: false, message: "Invite token is required." });
    }

    const user = await User.findOne({ inviteToken, isInvited: true });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired invite token." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.isInvited = false;
    user.isAccepted = true;

    user.inviteToken = null;

    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Invitation accepted successfully." });
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

const getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" });
    console.log(users, "---------------");
    return res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: error.message,
    });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({
      success: true,
      message: "Logout successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error during logout",
    });
  }
};
export {
  signup,
  signin,
  acceptInvitation,
  forgotPassword,
  resetPassword,
  getUsers,
  createInviteUser,
  logout,
};
