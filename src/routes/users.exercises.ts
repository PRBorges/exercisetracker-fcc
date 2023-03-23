// users.exercises.ts

import express from "express";
import MUser from "../models/user";

const userExercisesRouter = express.Router();

// Add exercise to user's log
userExercisesRouter.post("/:_ID/exercises", async (req, res) => {
  const duration = Number(req.body.duration);

  if (!Number.isInteger(duration) || duration <= 1) {
    res.status(400).send("Error: invalid duration");
    console.log("Bad request: Got invalid duration for exercise");
    return;
  }

  const dateComponents = req.body.date ? validDateOrNull(req.body.date) : null;
  if (req.body.date && !dateComponents) {
    res.status(400).send("Error: invalid date");
    console.log("Bad request: Got invalid date for exercise");
    return;
  }

  const date = dateComponents
    ? new Date(dateComponents[0], dateComponents[1] - 1, dateComponents[2])
    : new Date();

  try {
    const user = await MUser.findByIdAndUpdate(req.params._ID, {
      $push: {
        log: {
          description: req.body.description,
          duration,
          date,
        },
      },
    });

    if (!user) {
      res.status(400).send("Error: user not found");
      console.log("Bad request: _id does not exist to add exercise");
      return;
    }

    res.status(201).json({
      username: user.username,
      _id: user._id,
      description: req.body.description,
      duration,
      date: date.toDateString(),
    });
  } catch (err) {
    res.status(500).send("Database error");
    console.log("Database error: ", err);
  }
});

// Do some checks on the given string date
// Returns [year, month, day] if checks are ok, null otherwise
// Does not check valid days according to the month nor leap years
// Accepts all (non-negative) years
function validDateOrNull(dateStr: string): [number, number, number] | null {
  const c = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (!c) {
    return null;
  }

  const [_date, year, month, day] = c.map(Number);
  return month > 0 && month < 13 && day > 0 && day < 32
    ? [year, month, day]
    : null;
}

export default userExercisesRouter;
