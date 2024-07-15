import { Todo, Task } from "../models/todoModel.js";
import User from "../models/userModel.js";

export const newTodo = async (req, res) => {
  try {
    const userId = req.user.userid;

    // Check if the user exists
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Create a new todo
    const todo = await Todo.create({
      title: "title",
      tasks: [],
    });

    // Associate the new todo with the user
    const updateUser = await User.findOneAndUpdate(
      { _id: userId }, // Assuming profileid is the ID of the profile document you want to update
      { $push: { todos: todo } }, // Corrected $push syntax
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Todo created successfully and associated with the user.",
      todo,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Something went wrong while creating todo and associating with user, and the error is ${error}`,
    });
  }
};

export const deleteTodo = async (req, res) => {
  const { todoId } = req.params;
  try {
    await Todo.findByIdAndDelete(todoId);
    return res.status(200).json({
      success: true,
      message: "todo is deleted success fully ",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `something went wrong while deleting todo and error is ${error}`,
    });
  }
};

export const editTodo = async (req, res) => {
  const id = req.params.todoid;
  try {
    const { title } = req.body;
    const todo = await Todo.findById(id);
    if (todo) {
      const newTodo = {};
      if (title) {
        newTodo.title = title;
      }

      const updatedTodo = await Todo.findByIdAndUpdate(id, newTodo, {
        new: true,
      });
      return res.status(200).json({
        success: true,
        message: "Todo updated successfully",
        todo: updatedTodo,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Todo not found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Something went wrong while editing todo, and the error is ${error}`,
    });
  }
};

export const getTodos = async (req, res) => {
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
        path: "todos",
        model: "Todo",
        populate: {
          path: "tasks",
          model: "Task",
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
      message: "All todos fetched successfully.",
      todos: user.todos,
      tasks: user.todos.tasks,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Something went wrong while getting todos: ${error}`,
    });
  }
};

export const editTask = async (req, res) => {
  const { todoId, taskId } = req.params; // Extract todoId and taskId from the request parameters
  const { content, done } = req.body; // Extract updated content and done status from the request body

  // if (!content) {
  //   deleteTask(taskId);
  // }
  try {
    const todo = await Todo.findById(todoId);

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    const task = todo.tasks.id(taskId);

    if (!task) {
      return res
        .status(404)
        .json({ message: "Task not found in the specified todo" });
    }

    task.content = content !== undefined ? content : task.content; // Update content if provided
    task.done = done !== undefined ? done : task.done; // Update done status if provided

    await todo.save(); // Save the changes

    res
      .status(200)
      .json({ message: "Task updated successfully", updatedTask: task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const newTask = async (req, res) => {
  try {
    const { todoid } = req.params;
    if (!todoid) {
      return res.status(400).json({
        success: false,
        message: "Todoid not found",
      });
    } else {
      const task = await Task.create({
        content: "",
        done: false,
      });
      await Todo.findByIdAndUpdate(
        { _id: todoid },
        { $push: { tasks: task } },
        { new: true }
      );
      return res.status(200).json({
        success: true,
        message: "task created successfully ",
        task,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `somethin went wrong while adding task and error is ${error}`,
    });
  }
};

export const deleteTask = async (req, res) => {
  const { todoid, taskId } = req.params;

  try {
    // Find the todo by ID
    const todo = await Todo.findById(todoid);

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    // Find the task inside the todo
    await Task.findByIdAndDelete(taskId);

    await Todo.findByIdAndUpdate(
      { _id: todoid },
      { $pull: { tasks: { _id: taskId } } },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Task is deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Something went wrong while deleting task and error is ${error}`,
    });
  }
};
