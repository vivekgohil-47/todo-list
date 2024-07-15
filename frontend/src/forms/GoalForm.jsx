import axios from "axios";
import React, { useRef, useState, useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { goalsState } from "../atoms/todoAtom";
import "../components/CompStyles.css";

const GoalForm = ({ setShowForm }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const setGoals = useSetRecoilState(goalsState);
  const formRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (formRef.current && !formRef.current.contains(event.target)) {
        setShowForm(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setShowForm]);

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post(
        `http://localhost:5555/goal/newgoal`,
        { title, description, dueDate },
        { withCredentials: true }
      )
      .then((res) => {
        setGoals((prevGoals) => [...prevGoals, res.data.goal]);
      });

    setTitle("");
    setDescription("");
    setDueDate("");
  };

  return (
    <div className="overlay">
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="max-w-md mx-auto mt-8 p-4 bg-gray-100 rounded-lg shadow-md"
      >
        <div className="mb-4">
          <label className="block mb-2" htmlFor="title">
            Title:
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2" htmlFor="description">
            Description:
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block mb-2" htmlFor="dueDate">
            Due Date:
          </label>
          <input
            id="dueDate"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default GoalForm;
