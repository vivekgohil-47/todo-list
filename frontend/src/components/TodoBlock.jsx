import { useState, useEffect, useRef } from "react";
import "./CompStyles.css";
import axios from "axios";
import deleteLogo from "../assets/delete.svg";

const TodoBlock = () => {
  const [todos, setTodos] = useState([]);
  const taskInputRefs = useRef([]);

  const handleInputChange = (todo_idx, index, updatedValue) => {
    const updatedTodos = [...todos];
    updatedTodos[todo_idx].tasks[index].content = updatedValue;
    setTodos(updatedTodos);
  };

  const handleTitleChange = (todo_idx, updatedValue) => {
    const updatedTodos = [...todos];
    updatedTodos[todo_idx].title = updatedValue;
    setTodos(updatedTodos);
  };

  const deleteTodo = (todoId) => {
    axios
      .post(
        `http://localhost:5555/user/deletetodo/${todoId}`,
        {},
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        console.log(res.data.message);
        setTodos((prevTodos) =>
          prevTodos.filter((todo) => todo._id !== todoId)
        );
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const addTodo = () => {
    axios
      .post(`http://localhost:5555/user/newtodo`, {}, { withCredentials: true })
      .then((res) => {
        console.log(res.data.message);
        setTodos((prevTodos) => [...prevTodos, res.data.todo]);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleCheckboxChange = (checked, todo_idx, index, todo_id, task_id) => {
    const updatedTodos = [...todos];
    updatedTodos[todo_idx].tasks[index].done = checked;
    setTodos(updatedTodos);
    axios
      .put(
        `http://localhost:5555/user/todos/${todo_id}/tasks/${task_id}`,
        { done: checked }, // Use 'checked' instead of 'isChecked'
        { withCredentials: true }
      )
      .then((res) => {
        console.log(res.data.message);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    axios
      .get("http://localhost:5555/user/gettodos", { withCredentials: true })
      .then((res) => {
        setTodos(res.data.todos);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleKeyDown = (event, todo_id, updatedValue) => {
    if (event.key === "Enter") {
      axios
        .put(
          `http://localhost:5555/user/edittodo/${todo_id}`,
          { title: updatedValue },
          { withCredentials: true }
        )
        .then((res) => {
          console.log(res.data.message);
          // addTask(todo_id);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };
  const handleKeyPress = (event, todo_id, task_id, updatedValue) => {
    if (event.key === "Enter") {
      axios
        .put(
          `http://localhost:5555/user/todos/${todo_id}/tasks/${task_id}`,
          { content: updatedValue },
          { withCredentials: true }
        )
        .then((res) => {
          console.log(res.data.message);
          // addTask(todo_id);
        })
        .catch((error) => {
          console.error(error);
        });
    } else if (event.key === "Backspace" && updatedValue === "") {
      axios
        .delete(
          `http://localhost:5555/user/todos/${todo_id}/deletetask/${task_id}`,
          { withCredentials: true }
        )
        .then((res) => {
          console.log(res.data.message);
          setTodos((prevTodos) => {
            const updatedTodos = [...prevTodos];
            const todoIndex = updatedTodos.findIndex(
              (todo) => todo._id === todo_id
            );
            // Remove the deleted task from the tasks array
            updatedTodos[todoIndex].tasks = updatedTodos[
              todoIndex
            ].tasks.filter((task) => task._id !== task_id);
            return updatedTodos;
          });
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const addTask = (todoId) => {
    if (todoId) {
      axios
        .post(
          `http://localhost:5555/user/todos/${todoId}/newtask`,
          {},
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          const newTask = res.data.task;
          const todoIndex = todos.findIndex((todo) => todo._id === todoId);
          if (todoIndex !== -1) {
            setTodos((prevTodos) => {
              const updatedTodos = [...prevTodos];
              updatedTodos[todoIndex].tasks.push(newTask);
              return updatedTodos;
            });
            // Focus on the input field of the newly added task
            const newTaskIndex = todos[todoIndex].tasks.length - 1; // Index of the newly added task
            const inputRef = taskInputRefs.current[todoIndex][newTaskIndex];
            if (inputRef) {
              inputRef.focus();
            }
          }
          console.log(res.data.message);
        })
        .catch((error) => console.error(error));
    }
  };

  return (
    <div className=" flex flex-col">
      <div>
        <button
          onClick={addTodo}
          className=" m-5 text-xl cursor-pointer bg-blue-500 py-2 px-3 rounded-2xl"
        >
          Add Todo +
        </button>
      </div>
      <div className="flex mt-10 flex-wrap">
        {todos.map((todo, todo_idx) => (
          <div
            key={todo._id}
            className="todo-card my-3 border rounded-2xl h-[400px] w-[300px] flex flex-col mx-5 bg-blue-100"
          >
            <div className="title border-b border-gray-600 bg-yellow-300 rounded-t-2xl flex px-5 justify-between">
              <input
                className="text-2xl my-1 bg-transparent outline-none w-[80%]"
                value={todo?.title}
                onChange={(e) => handleTitleChange(todo_idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, todo._id, todo.title)}
              />
              <div className=" flex flex-row-reverse">
                <h1
                  onClick={() => addTask(todo._id)}
                  className=" text-3xl cursor-pointer text-gray-500 hover:text-black"
                >
                  +
                </h1>
                <img
                  className=" mx-3 cursor-pointer"
                  src={deleteLogo}
                  alt="delete"
                  onClick={() => deleteTodo(todo._id)}
                />
              </div>
            </div>
            <div className="tasks flex flex-col p-5">
              {todo?.tasks.map((task, index) => (
                <div key={task?._id} className="flex items-start">
                  <input
                    type="checkbox"
                    id={`cb_${todo_idx}_${index}`}
                    className="cursor-pointer mt-2"
                    checked={task?.done}
                    onChange={(e) =>
                      handleCheckboxChange(
                        e.target.checked,
                        todo_idx,
                        index,
                        todo._id,
                        task._id
                      )
                    }
                  />
                  <label htmlFor={`cb_${todo_idx}_${index}`}></label>
                  <input
                    style={{ resize: "none" }}
                    ref={(el) => {
                      // Store ref for each input field
                      if (!taskInputRefs.current[todo_idx]) {
                        taskInputRefs.current[todo_idx] = [];
                      }
                      taskInputRefs.current[todo_idx][index] = el;
                    }}
                    className={`px-2 text-lg h-auto bg-transparent outline-none w-full ${
                      !task.done ? "" : " text-gray-400 line-through"
                    }`}
                    value={task.content}
                    onChange={(e) =>
                      handleInputChange(todo_idx, index, e.target.value)
                    }
                    onKeyDown={(e) =>
                      handleKeyPress(e, todo._id, task._id, task.content)
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default TodoBlock;
