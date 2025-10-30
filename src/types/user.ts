export interface IUserDetailResponse {
  id: string;
  _id: string;
  email: string;
  isAdmin: boolean;
  transactionFee: number;
  revenue: number;
  totalTrashWeight: number;
  name: string;
}

export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}
