import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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

export { signup, signin };
