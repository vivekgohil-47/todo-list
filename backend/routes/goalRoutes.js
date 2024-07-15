import express from "express";
const router = express.Router();
import { auth } from "../middleware/auth.js";

import {
  addSubject,
  addTopic,
  deleteItem,
  editTopic,
  getCount,
  getGoals,
  newGoal,
  updateStatus,
} from "../controllers/goalController.js";

router.post("/newgoal", auth, newGoal);
router.put(
  "/update-status/:goalId/:type/:subjectIndex/:topicIndex",
  auth,
  updateStatus
);
router.put("/update-title/:goalId/:subjectIndex/:topicIndex", auth, editTopic);
router.get("/getgoals", auth, getGoals);
router.get("/:goalId/addsubject", auth, addSubject);
router.get("/:goalId/:subjectId/addtopic", auth, addTopic);
router.post("/delete/:type/:goalId", auth, deleteItem);
router.get("/getcount/:subjectId", auth, getCount);

export default router;
