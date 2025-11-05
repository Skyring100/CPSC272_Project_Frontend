//A data type to interface with polls
export interface PollWithOptions {
    poll_id?: number;
    question?: string;
    uuid?: string;

    option_id?: number;
    content?: string;
}