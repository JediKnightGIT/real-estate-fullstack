export type UserType = {
  _id: string;
  username: string;
  email: string;
  avatar: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type ListingData = {
  _id?: string;
  name: string;
  description: string;
  address: string;
  regularPrice: number;
  discountPrice: number;
  bathrooms: number;
  bedrooms: number;
  furnished: boolean;
  parking: boolean;
  type: 'rent' | 'sale';
  offer: boolean;
  imageUrls: string[];
  userRef?: string;
};

export type UserTypeWithMiddleware = UserType & Middleware;
export type ListingDataWithMiddleware = ListingData & Middleware;

export type Middleware = {
  success: boolean;
  statusCode: number;
  message: string;
};

export interface UserSliceState {
  currentUser: UserType | null;
  loading: boolean;
  error: string | null;
}
