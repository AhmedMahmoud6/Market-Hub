export interface UsersResponse {
  users: UserModel[];
  total: number;
  skip: number;
  limit: number;
}

export interface UserModel {
  id: number;
  firstName: string;
  lastName: string;
  maidenName?: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
  username: string;
  image: string;
  role?: UserRole;
  address?: UserAddress;
  company?: UserCompany;
}

export type UserRole = 'admin' | 'user';

export interface UserAddress {
  address: string;
  city: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

export interface UserCompany {
  name: string;
  title: string;
  department: string;
}