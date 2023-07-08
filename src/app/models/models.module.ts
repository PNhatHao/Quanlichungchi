export interface SideNavItem {
  title: string;
  link: string;
  permission: UserType[];
}

export enum UserType {
  ADMIN,
  USER,
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  password: string;
  blocked: boolean;
  active: boolean;
  createdOn: string;
  userType: UserType;
  rank: number; // rank
}

export interface Diploma {
  id: number;
  title: string;//
  category: string;//
  subCategory: string;//         muc
  point: number;//
  available: boolean;//
  count?: number;                              //
  position: string;//                 vi tri cong viec
}

export interface CategoryDiplomas {
  category: string; //
  subCategory: string;//            LOAI
  diplomas: Diploma[]; //
}

export interface Order {
  id: number;
  userid: number;
  name: string;
  diplomaid: number;//
  booktitle: string;
  orderedon: string;                              //
  finished: boolean;
}

export interface Category {
  name: string;
  children?: Category[];
}
