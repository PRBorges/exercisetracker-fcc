// users.logs.ts

import express from "express";

const userLogsRouter = express.Router();

userLogsRouter.get("/:_ID/logs", (req, res) => {
  res.json({
    i_d: req.params._ID,
    from: req.query.from || "undefined",
    to: req.query.to || "undefined",
    limit: req.query.limit || "undefined",
  });
  console.log("Got query: ", req.query.from, req.query.to, req.query.limit);
});

export default userLogsRouter;
