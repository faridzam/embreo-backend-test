
export interface Event {
  id: number;
  user_id: number;
  name: string;
  location: string;
  created_at: string;
}

export interface EventVendor {
  id: number,
  event_id: number,
  user_id: number
}