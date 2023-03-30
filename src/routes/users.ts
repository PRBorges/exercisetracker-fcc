// users.ts

import express from "express";
import userExercisesRouter from "./users.exercises";
import userLogsRouter from "./users.logs";
import MUser from "../models/user";

const router = express.Router();

// >Handle sub-endpoints
router.use(userExercisesRouter);
router.use(userLogsRouter);

// User creation
// The project description does not say anything about case sensitivity,
// valid usernames, nor what to do if the user already exists
// User names are made case insensitive and accepts more than one word
// No format checks are made
// Already created user names are accepted
router.post("/", async (req, res) => {
  const username = req.body.username.toLowerCase();

  try {
    // User already exists
    const existingUser = await MUser.findOne({ username }, "_id");
    if (existingUser) {
      res.status(200).json({
        username,
        _id: existingUser._id,
      });
      return;
    }

    // New user
    const newUser = new MUser({ username, log: [] });
    await newUser.save();
    res.status(201).json({ username, _id: newUser._id });
    console.log("Created new user: ", username);
  } catch (err) {
    res.status(500).json({ error: "Database error" });
    console.log("Database error: ", err);
  }
});

// Get list of users
router.get("/", async (_req, res) => {
  try {
    res.json(await MUser.find({}, "username _id"));
  } catch (err) {
    res.status(500).json({ error: "Database error" });
    console.log("Database error: ", err);
  }
});

export default router;
