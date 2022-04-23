import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  locked: { type: Boolean, required: true },
  access_token: { type: String },
  attempts: { type: Number, required: true },
});

export interface User extends mongoose.Document {
  username: string;
  password: string;
  locked: boolean;
  access_token: string;
  attempts: number;
}
