import User from "../models/userModel.js";
import bcrypt from "bcryptjs";

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

export { signup };
