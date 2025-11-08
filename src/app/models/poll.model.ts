//A data type to interface with polls
import { Option } from "./option.model";
export interface Poll {
  poll_id?: number;
  question?: string;
  options?: Option[];
  uuid?: number;
  is_visible?: boolean;
  open_date?: string;
  close_date?: string | null;
  user_vote?: number | null;
}