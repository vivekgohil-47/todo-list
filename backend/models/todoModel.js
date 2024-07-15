import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  content: {
    type: String,
    default: "",
  },
  done: {
    type: Boolean,
    default: false,
  },
});

const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      default:"Title"
    },
    tasks: [taskSchema],
  },
  { timestamps: true }
);

const Todo = mongoose.model("Todo", todoSchema);
const Task = mongoose.model("Task", taskSchema);

export { Todo, Task };
