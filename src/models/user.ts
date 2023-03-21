// models/user.ts

import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  username: string;
}

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true },
});

const MUser = model<IUser>("User", UserSchema);

export default MUser;
