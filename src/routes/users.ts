// users.ts

import express from "express";
import userExercisesRouter from "./users.exercises";
import userLogsRouter from "./users.logs";

const router = express.Router();

router.use(userExercisesRouter);
router.use(userLogsRouter);

router.get("/", (_req, res) => {
  res.send("List of users\n");
});

router.post("/", (req, res) => {
  res.json({ user: req.body.username });
});

export default router;
