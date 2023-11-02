import mongoose, { Document, Model } from 'mongoose';

export interface IUser {
  _id?: string;
  _doc?: any;
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
    avatar: {
      type: String,
      default: 'https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/default-avatar.png'
    }
  },
  { timestamps: true },
);

const User: IUserModel = mongoose.model<IUser, IUserModel>('User', userSchema);

export default User;
