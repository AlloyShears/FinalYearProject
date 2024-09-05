// Import necessary libraries and components
import { Timestamp } from "firebase/firestore"; // Firebase Timestamp for handling date and time
import moment from "moment"; // Moment.js for date manipulation and formatting
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card"; // UI components for displaying a card layout
import { Text } from "~/components/ui/text"; // Text component for rendering text
import { Todo } from "./Todo"; // Importing the Todo type
import { RichEditor } from "react-native-pell-rich-editor"; // Rich text editor for displaying HTML content
import { ScrollView, View } from "react-native"; // React Native components for layout and scrolling

// Define the type for the component's props, which includes a single todo item
type Props = {
  todo: Todo;
};

// Define the functional component TodoListItem, which accepts props of type Props
export function TodoListItem(props: Props) {
  // Get the current date and time
  const today = moment();
  // Calculate the difference between the deadline and the current date
  const difference = moment(props.todo.deadline.toDate()).diff(today);
  // Convert the difference into a human-readable duration
  const duration = moment.duration(difference);

  return (
    <>
      {/* Card component to encapsulate the Todo item */}
      <Card className="w-full">
        {/* CardHeader to display the title and status */}
        <CardHeader>
          {/* Title of the todo */}
          <CardTitle>{props.todo.title}</CardTitle>
          {/* Description with a shortened todo ID and status */}
          <CardDescription>
            #{props.todo.id.substring(props.todo.id.length - 6)} -{" "}
            {props.todo.status}
          </CardDescription>
        </CardHeader>

        {/* CardContent to display the rich text content of the todo */}
        <CardContent>
          <RichEditor
            initialHeight={200}
            initialContentHTML={props.todo.content} // Display the todo content as HTML
            disabled={true} // Disable editing since it's just for viewing
          />
        </CardContent>

        {/* CardFooter to display the deadline or completion status */}
        <CardFooter>
          <CardDescription>
            {/* Check if the todo is completed or still pending */}
            {props.todo.status == "completed" ? (
              // If completed, show the completion date
              <Text>
                Completed on {props.todo.deadline.toDate().toString()}
              </Text>
            ) : (
              // If not completed, show how much time is left until the deadline
              <Text>Deadline {duration.humanize(true)}</Text>
            )}
          </CardDescription>

          {/* Check if the todo is an outdoor activity */}
          {props.todo.is_outdoor ? (
            <CardDescription>
              <Text> - Outdoor Activity!</Text> {/* Display outdoor activity note */}
            </CardDescription>
          ) : (
            <></> // No additional description if it's not an outdoor activity
          )}
        </CardFooter>
      </Card>
    </>
  );
}
