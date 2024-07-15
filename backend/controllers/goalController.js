import { Goal, Subject, Topic } from "../models/goalModel.js";
import User from "../models/userModel.js";

export const newGoal = async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;

    if (!(title && description && dueDate)) {
      return res.status(404).json({
        success: false,
        message: "Provide all the required fields",
      });
    }
    const userId = req.user.userid;

    // Check if the user exists
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const goal = await Goal.create({
      title,
      description,
      dueDate,
    });

    const updateUser = await User.findOneAndUpdate(
      { _id: userId }, // Assuming profileid is the ID of the profile document you want to update
      { $push: { goals: goal } }, // Corrected $push syntax
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "The goal is set",
      goal,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `something went wrong while creating goal and error is ${error}`,
    });
  }
};

export const deleteItem = async (req, res) => {
  const { type, goalId } = req.params;
  const { subjectId, topicId } = req.body;

  try {
    if (!(type && goalId)) {
      return res.status(404).json({
        success: false,
        message: "Provide all the required fields",
      });
    }
    switch (type) {
      case "goal": {
        try {
          await Goal.findByIdAndDelete(goalId);
          return res.status(200).json({
            success: true,
            message: "goal deleted success fully ",
          });
        } catch (error) {
          return res.status(500).json({
            success: false,
            message: `something went wrong while deleting goal and error is ${error}`,
          });
        }
      }
      case "subject": {
        try {
          await Subject.findByIdAndDelete(subjectId);
          await Goal.findByIdAndUpdate(
            { _id: goalId },
            { $pull: { subjects: { _id: subjectId } } },
            { new: true }
          );
          return res.status(200).json({
            success: true,
            message: "subject deleted success fully ",
          });
        } catch (error) {
          return res.status(500).json({
            success: false,
            message: `something went wrong while deleting subject and error is ${error}`,
          });
        }
      }
      case "topic": {
        try {
          await Topic.findByIdAndDelete(topicId);
          await Goal.findOneAndUpdate(
            { _id: goalId, "subjects._id": subjectId },
            { $pull: { "subjects.$.topics": { _id: topicId } } },
            { new: true }
          );
          return res.status(200).json({
            success: true,
            message: "topic deleted success fully ",
          });
        } catch (error) {
          return res.status(500).json({
            success: false,
            message: `something went wrong while deleting topic and error is ${error}`,
          });
        }
      }
    }
  } catch (error) {}
};

export const getGoals = async (req, res) => {
  try {
    const userId = req.user.userid;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is missing in the request.",
      });
    }

    const user = await User.findById(userId)
      .populate({
        path: "goals",
        model: "Goal",
        populate: {
          path: "subjects",
          model: "Subject",
          populate: {
            path: "topics",
            model: "Topic",
          },
        },
      })
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }
    return res.status(200).json({
      success: true,
      message: "All goals fetched successfully.",
      goals: user.goals,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Something went wrong while getting goals: ${error}`,
    });
  }
};

export const addTopic = async (req, res) => {
  const { goalId, subjectId } = req.params;

  if (!subjectId && !goalId) {
    return res.status(400).json({
      success: false,
      message: "subject not found",
    });
  } else {
    const topic = await Topic.create({
      title: "Set title",
      status: "Pending",
    });

    await Goal.findOneAndUpdate(
      { _id: goalId, "subjects._id": subjectId },
      { $push: { "subjects.$.topics": topic } },
      { new: true }
    );

    await Subject.findOneAndUpdate(
      { _id: subjectId },
      { $push: { topics: topic } },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "topic created successfully ",
      topic,
    });
  }
};

export const addSubject = async (req, res) => {
  const { goalId } = req.params;

  if (!goalId) {
    return res.status(400).json({
      success: false,
      message: "goal not found",
    });
  } else {
    const subject = await Subject.create({
      title: "Set title",
      status: "Pending",
      topics: [],
    });
    await Goal.findByIdAndUpdate(
      { _id: goalId },
      { $push: { subjects: subject } },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "subject created successfully ",
      subject,
    });
  }
};

export const updateStatus = async (req, res) => {
  const { goalId, type, subjectIndex, topicIndex } = req.params;
  const newStatus = req.body.newStatus;

  try {
    const goal = await Goal.findById(goalId);

    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    // Update status based on type
    if (type === "subject") {
      // Update status in goal
      goal.subjects[subjectIndex].status = newStatus;

      // Update status in individual subject
      const subjectId = goal.subjects[subjectIndex]._id;
      const subject = await Subject.findById(subjectId);
      if (!subject) {
        return res.status(404).json({ message: "Subject not found" });
      }
      subject.status = newStatus;
      await subject.save();
    } else if (type === "topic") {
      // Update status in goal
      goal.subjects[subjectIndex].topics[topicIndex].status = newStatus;

      // Update status in individual topic
      const topicId = goal.subjects[subjectIndex].topics[topicIndex]._id;
      const topic = await Topic.findById(topicId);
      if (!topic) {
        return res.status(404).json({ message: "Topic not found" });
      }
      topic.status = newStatus;
      await topic.save();
    } else {
      return res.status(400).json({ message: "Invalid type" });
    }

    // Save the updated goal
    await goal.save();

    return res.json({ message: "Status updated successfully", goal });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const editTopic = async (req, res) => {
  const { goalId, subjectIndex, topicIndex } = req.params;
  const newValue = req.body.newValue;
  try {
    const goal = await Goal.findById(goalId);

    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    goal.subjects[subjectIndex].topics[topicIndex].title = newValue;

    await goal.save();

    return res.json({ message: "title updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getCount = async (req, res) => {
  const { subjectId } = req.params;

  try {
    const subject = await Subject.findById(subjectId);

    if (!subject) {
      return res.status(404).json({ error: "Subject not found" });
    }

    const doneTopicsCount = subject.topics.reduce((count, topic) => {
      if (topic.status === "Done") {
        return count + 1;
      }
      return count;
    }, 0);

    console.log(doneTopicsCount);
    res.status(200).json({ count: doneTopicsCount });
  } catch (error) {
    console.error(
      'Error counting topics with status "Done" for the subject:',
      error
    );
    res.status(500).json({ error: "Internal Server Error" });
  }
};
