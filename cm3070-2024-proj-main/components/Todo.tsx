import { Timestamp } from "firebase/firestore"; // Firebase Timestamp for handling date and time fields

// Interface defining the structure of a Todo object
export interface Todo {
  id: string; // Unique identifier for the todo
  title: string; // Title of the todo
  content: string; // Content or description of the todo
  author: string; // User ID of the todo's author
  status: "active" | "completed"; // Status of the todo (either active or completed)
  is_outdoor: boolean; // Indicates if the todo is an outdoor activity
  deadline: Timestamp; // Deadline for the todo, stored as a Firebase Timestamp
  completed: Timestamp | undefined; // Timestamp for when the todo was completed (if applicable)
}
