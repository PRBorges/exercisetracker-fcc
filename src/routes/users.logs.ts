// users.logs.ts

import express from "express";
import mongoose, { PipelineStage } from "mongoose";
import { query, validationResult } from "express-validator";
import MUser from "../models/user";
import adjustDate from "../adjustDate";

type DateBound =
  | { $gte: [string, Date] }
  | { $lte: [string, Date] }
  | { $and: DateBound[] };

const userLogsRouter = express.Router();

// Gets exercise log for  a user
userLogsRouter.get(
  "/:_ID/logs",
  [
    query("from")
      .optional({ checkFalsy: true })
      .isISO8601({ strict: true })
      .toDate(),
    query("to")
      .optional({ checkFalsy: true })
      .isISO8601({ strict: true })
      .toDate(),
    query("limit").optional({ checkFalsy: true }).isInt({ gt: 0 }).toInt(),
  ],
  async (req, res) => {
    // Validation of query parameters
    let userID;
    try {
      userID = new mongoose.Types.ObjectId(req.params._ID);
    } catch (err) {
      res.status(400).json({ error: "Invalid user ID" });
      console.log("Invalid user ID in log request: ", err);
      return;
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      console.log("Bad log request: ", errors.array());
      return;
    }
    const { from, to, limit } = req.query;

    // Build the query
    const pipeline: PipelineStage[] = [{ $match: { _id: userID } }];

    if (from || to) {
      const dateBounds = bounds(from, to);
      pipeline.push({
        $project: {
          log: {
            $filter: {
              input: "$log",
              as: "exercise",
              cond: dateBounds,
            },
          },
        },
      });
    }

    if (limit) {
      pipeline.push({
        $project: { log: { $slice: ["$log", limit] } },
      });
    }

    // Execute the query
    try {
      const docs = await MUser.aggregate(pipeline).exec();

      if (docs.length == 0) {
        res.status(400).json({ error: "User not found" });
        console.log(`User with _ID ${userID} was not found in log request`);
        return;
      }

      const user = docs[0];
      // Change date format in log
      user.log = user.log.map((exercise) => {
        exercise.date = exercise.date.toDateString();
        return exercise;
      });

      res.status(200).json({ ...user, count: user.log.length });
    } catch (_err) {}
  }
);

function bounds(fromDate: Date | null, toDate: Date | null): DateBound {
  const fromBound: DateBound | null = fromDate
    ? { $gte: ["$$exercise.date", adjustDate(fromDate)] }
    : null;
  const toBound: DateBound | null = toDate
    ? { $lte: ["$$exercise.date", adjustDate(toDate)] }
    : null;
  if (fromBound && toBound) {
    return { $and: [fromBound, toBound] };
  } else if (fromBound) {
    return fromBound;
  } else {
    return toBound as DateBound;
  }
}

export default userLogsRouter;
