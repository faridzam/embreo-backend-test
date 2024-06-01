import { Company, VendorResponse } from "./company";
import { Event } from "./event";
import { Role } from "./role";
import { User } from "./user";

export interface ApiResponseBody {
  code?: number;
  status?: string;
  data?: any;
  message?: string;
}

export interface EventResponse extends Event {
  company: Company;
  vendors: VendorResponse[];
  dates: Date[];
}

export interface updateStatusEventResponse {
  name: string,
  status: string,
  remarks?: string,
  updated_at?: string
}

export interface LoginDataResponse {
  token: string,
  user: User,
  company: Company,
  role: Role,
}