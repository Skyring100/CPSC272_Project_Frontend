//A data type to interface with polls
export interface Poll {
  poll_id?: number;
  question?: string;
  options?: string[];
  uuid?: string;
}