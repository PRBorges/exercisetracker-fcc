// users.exercises.ts

import express from "express";
import mongoose from "mongoose";
import { body, validationResult } from "express-validator";
import MUser from "../models/user";
import adjustDate from "../adjustDate";

const userExercisesRouter = express.Router();

// Add exercise to user's log
userExercisesRouter.post(
  "/:_ID/exercises",
  [
    body("description").isString(),
    body("duration").isInt({ gt: 0 }).toInt(),
    body("date")
      .optional({ checkFalsy: true })
      .isISO8601({ strict: true })
      .toDate(),
  ],
  async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params._ID)) {
      res.status(400).json({ error: "Invalid _ID" });
      console.log("Bad request: invalid _ID for exercise");
      return;
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      console.log("Bad exercise request: ", errors.array());
      return;
    }

    try {
      const { description, duration } = req.body;
      const date = req.body.date ? adjustDate(req.body.date) : new Date();
      const user = await MUser.findByIdAndUpdate(req.params._ID, {
        $push: {
          log: {
            description,
            duration,
            date,
          },
        },
      });

      if (!user) {
        res.status(400).json({ error: "User not found" });
        console.log(
          "Bad request: _id does not exist to add exercise: ",
          req.body._ID
        );
        return;
      }

      res.status(201).json({
        username: user.username,
        _id: user._id,
        description,
        duration,
        date: date.toDateString(),
      });
    } catch (err) {
      res.status(500).json({ error: "Database error" });
      console.log("Database error: ", err);
    }
  }
);

export default userExercisesRouter;
