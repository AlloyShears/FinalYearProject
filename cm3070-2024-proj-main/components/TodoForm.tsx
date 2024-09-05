import { addDoc, collection, doc, setDoc } from "firebase/firestore"; // Firebase methods for creating or updating documents
import { Controller, SubmitHandler, useForm } from "react-hook-form"; // React Hook Form for form handling
import { ScrollView, View } from "react-native"; // UI components from React Native
import { Todo } from "./Todo"; // Todo type definition
import { Input } from "./ui/input"; // Custom Input component
import { Label } from "./ui/label"; // Custom Label component
import { Text } from "./ui/text"; // Custom Text component
import DateTimePicker from "@react-native-community/datetimepicker"; // Date and time picker
import { Button } from "./ui/button"; // Custom Button component
import { db } from "~/firebase-config"; // Firebase configuration
import { useContext } from "react"; // React hook for context management
import { AuthContext } from "~/lib/auth-context"; // AuthContext for accessing user authentication
import { TodoFormEditor } from "./TodoFormEditor"; // Custom rich text editor
import { Switch } from "./ui/switch"; // Custom switch component for boolean values

// Props type for determining form mode (create/edit) and handling submission
type Props = {
  type: "edit" | "create";
  existing: Todo | undefined;
  onSubmit: () => void;
};

// Input type for form fields
interface Inputs {
  title: string;
  content: string;
  is_outdoor: boolean;
  deadline: Date;
}

// TodoForm component handles creating or editing a Todo
export function TodoForm(props: Props) {
  const {
    control, // Manages form control
    formState: { errors },
    handleSubmit, // Handles form submission
  } = useForm<Inputs>();

  const { user } = useContext(AuthContext); // Access authenticated user

  // Handles form submission, differentiating between create and edit modes
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    if (props.type == "create") {
      return addDoc(collection(db, "todos"), {
        ...data,
        author: user?.uid,
        status: "active",
      }).then(() => props.onSubmit());
    } else {
      return setDoc(doc(db, "todos", props.existing?.id ?? ""), {
        ...data,
        author: user?.uid,
        status: "active",
      }).then(() => props.onSubmit());
    }
  };

  return (
    <>
      <ScrollView>
        <View className="gap-4">
          {/* Title input field */}
          <View>
            <Controller
              name="title"
              control={control}
              rules={{ required: true }}
              defaultValue={props.existing?.title}
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <Label nativeID="title">Title</Label>
                  <Input onBlur={onBlur} onChangeText={onChange} value={value} />
                </>
              )}
            />
          </View>

          {/* Content rich text editor */}
          <View>
            <Controller
              name="content"
              control={control}
              rules={{ required: true }}
              defaultValue={props.existing?.content}
              render={({ field: { onChange, value } }) => (
                <>
                  <Label nativeID="content">Content</Label>
                  <TodoFormEditor onChange={onChange} value={value} />
                </>
              )}
            />
          </View>

          {/* Outdoor activity switch */}
          <View>
            <Controller
              name="is_outdoor"
              control={control}
              defaultValue={props.existing?.is_outdoor ?? false}
              render={({ field: { onChange, value } }) => (
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Label nativeID="is_outdoor">Outdoor Activity</Label>
                  <Switch checked={value} onCheckedChange={onChange} />
                </View>
              )}
            />
          </View>

          {/* Deadline date picker */}
          <View>
            <Controller
              name="deadline"
              control={control}
              rules={{ required: true }}
              defaultValue={props.existing?.deadline?.toDate() ?? new Date()}
              render={({ field: { onChange, value } }) => (
                <>
                  <Label nativeID="deadline">Deadline</Label>
                  <DateTimePicker
                    mode="datetime"
                    onChange={(e, d) => onChange(d)}
                    value={value}
                  />
                </>
              )}
            />
          </View>

          {/* Submit button */}
          <View className="w-full">
            <Button className="grid w-full" onPress={handleSubmit(onSubmit)}>
              <Text>{props.type === "create" ? "Create" : "Edit"}</Text>
            </Button>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
