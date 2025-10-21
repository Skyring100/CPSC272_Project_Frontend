//A data type to interface with polls
export interface Poll {
  question?: string;
  options?: string[];
  poll_id?: number;
  uuid?: string;
}