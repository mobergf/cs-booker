interface DBItem {
  collectionId: string;
  collectionName: string;
  created: string;
  id: string;
  updated: string;
  date: string;
}

export interface IUserMatch extends DBItem {
  comment: string;
  expand: { user: IUser };
  inhouse: boolean;
  match: string;
  user: string;
}

export interface IMatch extends DBItem {
  type: string;
}
export interface IUser extends DBItem {
  avatar: string;
  emailVisibility: boolean;
  name: string;
  username: string;
  verified: boolean;
}
export interface IMatches<T> {
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  items: T[];
}
