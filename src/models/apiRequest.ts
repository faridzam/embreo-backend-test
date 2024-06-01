import { Account } from "./account";
import { Company } from "./company";
import { Role } from "./role";
import { User } from "./user";

export interface AuthenticatedUser {
  account: Account,
  user: User,
  company: Company,
  role: Role,
}

export interface updateStatusEventRequest {
  event_id: number,
  remarks?: string,
  auth: AuthenticatedUser
}

export interface CreateEventRequest {
  name: string;
  location: string;
  vendors: number[];
  dates: string[];
  auth: AuthenticatedUser
}