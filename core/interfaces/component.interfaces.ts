/* eslint-disable no-unused-vars */
// eslint was throwing error for void functions with typed parameters for some reason
import { User } from "next-auth";
import { IMatches, IUserMatch, IMatch } from "./db.interfaces";

export interface IButtonFilter {
  matchDate: string;
  type: "day" | "night";
  userMatches: IMatches<IUserMatch>;
  matches: IMatches<IMatch>;
  handleClick: (type: string, date: string) => void;
  handleRemoveSign: (id?: string) => void;
  user: User;
}
