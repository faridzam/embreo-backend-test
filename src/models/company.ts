export interface Company {
  id: number;
  name: string;
}

export interface VendorResponse {
  name: string,
  status: string,
  remarks?: string,
  updated_at?: string
}