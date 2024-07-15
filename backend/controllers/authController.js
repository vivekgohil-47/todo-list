import User from "../models/userModel.js";
import "dotenv/config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!email || !password || !username) {
      res.status(400).json({
        success: false,
        message: `please fill all the details`,
      });
      return;
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "please provide a valid email ",
      });
    }
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "your password is to short please provide at least 6 charcter password ",
      });
    }
    const userexist = await User.findOne({ email });

    if (userexist) {
      return res.status(400).json({
        success: false,
        message: `user already exist please login `,
      });
    }

    let hashedpassword;
    try {
      hashedpassword = await bcrypt.hash(password, 10);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: `error occurred while hashing password and error is ${error}`,
      });
    }
    const user = await User.create({
      email,
      username,
      password: hashedpassword,
    });
    user.password = undefined;
    return res.status(200).json({
      success: true,
      message: "User Created Successfully",
      data: user,
    });
  } catch (error) {
    if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
      return res.status(400).json({
        success: false,
        message: `Email is already in use. Please use a different email.`,
      });
    } else if (
      error.code === 11000 &&
      error.keyPattern &&
      error.keyPattern.username
    ) {
      return res.status(400).json({
        success: false,
        message: `Username is already taken. Please choose another username.`,
      });
    } else {
      console.error("Unexpected error occurred:", error);
      return res.status(400).json({
        success: false,
        message: `Something went wrong while signing up.`,
      });
    }
  }
};

export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide both username or email and password",
      });
    }

    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User does not exist. Please check Username or Email",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password. Please try again.",
      });
    }

    const payload = {
      userid: user._id,
      email: user.email,
      username: user.username,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    user.token = token;
    user.password = undefined;

    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    // Set token in a cookie
    res.cookie("token", token, options);

    // Set the token in the "Authorization" header (optional)
    res.set("Authorization", `Bearer ${token}`);

    return res.status(200).json({
      success: true,
      token,
      user,
      message: "User logged in successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Something went wrong while logging in: ${error.message}`,
    });
  }
};
