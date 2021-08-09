import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  type: { type: String, required: true },
  status: { type: Boolean, default: false },
});

export interface User extends mongoose.Document {
  id: string;
  userId: string;
  password: string;
  type: string;
  status: boolean;
}
