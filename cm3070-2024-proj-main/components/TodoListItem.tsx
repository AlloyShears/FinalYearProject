import { Timestamp } from "firebase/firestore";
import moment from "moment";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Text } from "~/components/ui/text";
import { Todo } from "./Todo";
import { RichEditor } from "react-native-pell-rich-editor";
import { ScrollView, View } from "react-native";

type Props = {
  todo: Todo;
};

export function TodoListItem(props: Props) {
  const today = moment();
  const difference = moment(props.todo.deadline.toDate()).diff(today);
  const duration = moment.duration(difference);

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{props.todo.title}</CardTitle>
          <CardDescription>
            #{props.todo.id.substring(props.todo.id.length - 6)} -{" "}
            {props.todo.status}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RichEditor
            initialHeight={200}
            initialContentHTML={props.todo.content}
            disabled={true}
          />
        </CardContent>
        <CardFooter>
          <CardDescription>
            {props.todo.status == "completed" ? (
              <Text>
                Completed on {props.todo.deadline.toDate().toString()}
              </Text>
            ) : (
              <Text>Deadline {duration.humanize(true)}</Text>
            )}
          </CardDescription>
          {props.todo.is_outdoor ? (
            <CardDescription>
              <Text> - Outdoor Activity!</Text>
            </CardDescription>
          ) : (
            <></>
          )}
        </CardFooter>
      </Card>
    </>
  );
}
