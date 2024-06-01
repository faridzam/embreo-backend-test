import { AuthenticatedUser } from "./apiRequest";
import { Company } from "./company";

export interface Event {
  id: number;
  user_id: number;
  name: string;
  location: string;
  status: string;
  remarks?: string;
  created_at: string;
  updated_at?: string;
}

export interface CreateEventRequest {
  name: string;
  location: string;
  vendors: number[];
  dates: string[];
  auth: AuthenticatedUser
}

export interface EventResponse extends Event {
  company: Company;
  vendors: Company[];
  dates: Date[];
}

export interface EventVendor {
  id: number,
  event_id: number,
  user_id: number
}