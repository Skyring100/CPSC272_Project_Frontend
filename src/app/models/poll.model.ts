import { Option } from "./option.model";

export interface Poll {
  poll_id: number;
  question?: string;
  options?: Option[];
  uuid?: number;
  username?: string;
  is_visible?: boolean;
  open_date?: string;
  user_vote?: number | null;
}