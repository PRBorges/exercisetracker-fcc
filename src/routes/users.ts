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
router.post("/", async (req, res) => {
  const paaramUserName = req.body.username;
  const username = paaramUserName.toLowerCase();

  try {
    const existingUser = await MUser.findOne({ username });
    if (existingUser) {
      res.json({
        username: paaramUserName,
        _id: existingUser._id,
        justCreated: false,
      });
    } else {
      const newUser = new MUser({ username });
      await newUser.save();
      res.json({
        username,
        _id: newUser._id,
        justCreated: true,
      });
    }
  } catch (err) {
    res.status(500).send("Error connecting to the database");
    console.log("Error connecting to the database: ", err);
  }
});

router.get("/", (_req, res) => {
  res.send("List of users\n");
});

export default router;
