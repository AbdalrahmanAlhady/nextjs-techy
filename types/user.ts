export interface IUser {
  id: string;
  email: string;
  password: string;
  name: string | null;
  role: 'ADMIN' | 'VENDOR' | 'BUYER';
  vendorStatus: 'NONE' | 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: Date;
  updatedAt: Date;
}
