// users.ts

import express from "express";
import userExercisesRouter from "./users.exercises";
import userLogsRouter from "./users.logs";

const router = express.Router();

// >Handle sub-endpoints
router.use(userExercisesRouter);
router.use(userLogsRouter);

// User creation
router.post("/", (req, res) => {
  res.json({ user: req.body.username });
});

router.get("/", (_req, res) => {
  res.send("List of users\n");
});

export default router;
