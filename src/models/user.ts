// models/user.ts

import { Schema, model, Document } from "mongoose";

export interface IExercise {
  description: string;
  duration: number;
  date: Date;
}

export interface IUser extends Document {
  username: string;
  log: [IExercise];
}

const ExerciseSchema = new Schema<IExercise>({
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  date: { type: Date, required: true },
});

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  log: { type: [ExerciseSchema] },
});

const MUser = model<IUser>("User", UserSchema);

export default MUser;
