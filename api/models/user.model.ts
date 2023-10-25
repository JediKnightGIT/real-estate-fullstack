import mongoose, { Document, Model } from 'mongoose';

export interface IUser {
  username: string;
  email: string;
  password: string;
}

interface IUserModel extends Model<IUser & Document> {}

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const User: IUserModel = mongoose.model<IUser, IUserModel>('User', userSchema)

export default User