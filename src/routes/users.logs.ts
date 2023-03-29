// users.logs.ts

import express from "express";
import mongoose, { PipelineStage } from "mongoose";
import MUser from "../models/user";

type DateBound =
  | { $gte: [string, Date] }
  | { $lte: [string, Date] }
  | { $and: DateBound[] };

// interface IResultExercise extends Omit<IExercise, "date"> {
//   date: string;
// }

const userLogsRouter = express.Router();

userLogsRouter.get("/:_ID/logs", async (req, res) => {
  // Validation of query parameters
  let userID, fromDate, toDate, limit;
  try {
    userID = new mongoose.Types.ObjectId(req.params._ID);
    fromDate = validDateOrNull(req.query.from);
    toDate = validDateOrNull(req.query.to);
    limit = validLimitOrNull(req.query.limit);
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({ error: err.message });
      console.log("Invalid query parameter: ", err.message);
    } else {
      console.error(err);
    }
    return;
  }

  // Build the query
  const pipeline: PipelineStage[] = [{ $match: { _id: userID } }];

  if (fromDate || toDate) {
    const dateBounds = bounds(fromDate, toDate);
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
    user.log = user.log.map((exercise: any) => {
      exercise.date = exercise.date.toDateString();
      return exercise;
    });

    res.status(200).json({ ...user, count: user.log.length });
  } catch (_err) {}
});

function validDateOrNull(date: any): Date | null {
  if (date === undefined || date === "") {
    return null;
  }
  if (typeof date !== "string") {
    throw new Error("Invalid date");
  }
  const result = new Date(date);
  if (isNaN(result.getTime())) {
    throw new Error("Invalid date");
  }
  return result;
}

function bounds(fromDate: Date | null, toDate: Date | null): DateBound {
  const fromBound: DateBound | null = fromDate
    ? { $gte: ["$$exercise.date", fromDate] }
    : null;
  const toBound: DateBound | null = toDate
    ? { $lte: ["$$exercise.date", toDate] }
    : null;
  if (fromBound && toBound) {
    return { $and: [fromBound, toBound] };
  } else if (fromBound) {
    return fromBound;
  } else {
    return toBound as DateBound;
  }
}

function validLimitOrNull(arg: any): number | null {
  if (arg === undefined || arg === "") {
    return null;
  }
  const limit = Number(arg);
  if (isNaN(limit) || !Number.isInteger(limit)) {
    throw new Error("Invalid limit");
  }
  return limit;
}

export default userLogsRouter;
