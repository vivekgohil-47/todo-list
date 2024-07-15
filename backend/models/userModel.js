import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  todos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Todo",
    },
  ],
  goals: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Goal",
    },
  ],
});
const User = mongoose.model("User", userSchema);
export default User;
