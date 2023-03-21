// users.exercises.ts

import express from "express";

const userExercisesRouter = express.Router();

userExercisesRouter.post("/:_ID/exercises", (req, res) => {
  res.json({
    desc: req.body.description,
    duration: req.body.duration,
    date: req.body.date,
    _id: req.params._ID,
  });
});

export default userExercisesRouter;
