import { Company, VendorResponse } from "./company";
import { Event } from "./event";

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