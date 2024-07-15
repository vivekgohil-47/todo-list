import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import userRoutes from "./routes/userRoutes.js";
import goalRoutes from "./routes/goalRoutes.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use("/user", userRoutes);
app.use("/goal", goalRoutes);

app.get("/", (req, res) => {
  res.send("Hello, World");
});

mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log("Database connected");
  app.listen(port, () => {
    console.log("Listning on port:", port);
  });
});
