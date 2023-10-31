export type UserType = {
  _id: string;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type UserTypeWithMiddleware = UserType & {
  success: boolean;
  statusCode: number;
  message: string;
};

export interface UserSliceState {
  currentUser: UserType | null;
  loading: boolean;
  error: string | null;
}
