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