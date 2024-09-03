import { Timestamp } from "firebase/firestore";

export interface Todo {
  id: string;
  title: string;
  content: string;
  author: string;
  status: "active" | "completed";
  is_outdoor: boolean;
  deadline: Timestamp;
  completed: Timestamp | undefined;
}
