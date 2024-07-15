import mongoose from "mongoose";

const topicSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: true,
  },
  status: {
    type: String,
    enum: ["Done", "Review", "Pending"],
    default: "Pending",
  },
});

const subjectSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ["Done", "Review", "Pending"],
    default: "Pending",
  },
  topics: [topicSchema],
});

const goalSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
  },
  description: { type: String },
  subjects: [subjectSchema],
  dueDate: {
    type: Date,
    required: true,
  },
});

const Goal = mongoose.model("Goal", goalSchema);
const Subject = mongoose.model("Subject", subjectSchema);
const Topic = mongoose.model("Topic", topicSchema);

export { Goal, Subject, Topic };
