import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { ScrollView, View } from "react-native";
import { Todo } from "./Todo";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Text } from "./ui/text";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Button } from "./ui/button";
import { db } from "~/firebase-config";
import { useContext } from "react";
import { AuthContext } from "~/lib/auth-context";
import { TodoFormEditor } from "./TodoFormEditor";
import { Switch } from "./ui/switch";

type Props = {
  type: "edit" | "create";
  existing: Todo | undefined;
  onSubmit: () => void;
};

interface Inputs {
  title: string;
  content: string;
  is_outdoor: boolean;
  deadline: Date;
}

export function TodoForm(props: Props) {
  const {
    control,
    setError,
    formState: { errors },
    handleSubmit,
  } = useForm<Inputs>();
  const { user } = useContext(AuthContext);
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    if (props.type == "create")
      return addDoc(collection(db, "todos"), {
        ...data,
        author: user?.uid,
        status: "active",
      }).then(() => props.onSubmit());
    else
      return setDoc(doc(db, "todos", props.existing?.id ?? ""), {
        ...data,
        author: user?.uid,
        status: "active",
      }).then(() => props.onSubmit());
  };

  return (
    <>
      <ScrollView>
        <View className="gap-4">
          <View>
            <Controller
              name="title"
              control={control}
              rules={{
                required: true,
              }}
              defaultValue={props.existing?.title}
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <Label nativeID="title">Title</Label>
                  <Input
                    autoCapitalize="none"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                </>
              )}
            />
          </View>
          <View>
            <Controller
              name="content"
              control={control}
              rules={{
                required: true,
              }}
              defaultValue={props.existing?.content}
              render={({ field: { onChange, value } }) => (
                <>
                  <Label nativeID="content">Content</Label>
                  <TodoFormEditor onChange={onChange} value={value} />
                </>
              )}
            />
          </View>

          <View>
            <Controller
              name="is_outdoor"
              control={control}
              defaultValue={props.existing?.is_outdoor ?? false}
              render={({ field: { onChange, value } }) => (
                <View style={{ flexDirection: "row", justifyContent: 'space-between' }}>
                  <View>
                    <Label nativeID="is_outdoor">Outdoor Activity</Label>
                  </View>
                  <View>
                    <Switch
                      checked={value}
                      onCheckedChange={onChange}
                      nativeID="is_outdoor"
                    />
                  </View>
                </View>
              )}
            />
          </View>

          <View>
            <Controller
              name="deadline"
              control={control}
              rules={{
                required: true,
              }}
              defaultValue={props.existing?.deadline?.toDate() ?? new Date()}
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <Label nativeID="deadline">Deadline</Label>
                  <DateTimePicker
                    testID="deadline"
                    mode="datetime"
                    onChange={(e, d) => {
                      onChange(d);
                    }}
                    value={value}
                  />
                </>
              )}
            />
          </View>

          <View className="w-full">
            <Button className="grid w-full" onPress={handleSubmit(onSubmit)}>
              <Text>{props.type == "" ? "Edit" : "Create"}</Text>
            </Button>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
