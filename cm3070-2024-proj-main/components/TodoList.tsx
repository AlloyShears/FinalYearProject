import { router } from "expo-router";
import {
  query,
  collection,
  where,
  onSnapshot,
  Timestamp,
  orderBy,
} from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { db } from "~/firebase-config";
import { TodoListItem } from "./TodoListItem";
import { Todo } from "./Todo";
import { SafeAreaView } from "react-native-safe-area-context";
import { DropdownMenu, DropdownMenuItem } from "./ui/dropdown-menu";
import { Select, SelectContent, SelectItem } from "./ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Text } from "./ui/text";

type Props = {
  author: string | undefined;
  status: string;
};

function RadioGroupItemWithLabel({
  value,
  onLabelPress,
}: {
  value: string;
  onLabelPress: () => void;
}) {
  return (
    <View className={"flex-row gap-2 items-center"}>
      <RadioGroupItem aria-labelledby={`label-for-${value}`} value={value} />
      <Label nativeID={`label-for-${value}`} onPress={onLabelPress}>
        {value}
      </Label>
    </View>
  );
}

export function TodoList(props: Props) {
  const [sort, setSort] = useState<string>("Ascending");
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, "todos"),
      where("author", "==", props.author),
      where("status", "==", props.status),
      orderBy("deadline", sort == "Ascending" ? "asc" : "desc")
    );
    const unsubscribe = onSnapshot(q, (s) => {
      return setTodos(
        s.docs.map(
          (d) =>
            ({
              id: d.id,
              ...d.data(),
            } as Todo)
        )
      );
    });

    return () => {
      unsubscribe();
    };
  }, [props.status, sort]);

  return (
    <View className="p-4 gap-4" style={{ minHeight: "100%" }}>
      <Collapsible>
        <CollapsibleTrigger>
          <Text>Filters</Text>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <RadioGroup value={sort} onValueChange={setSort} className="gap-3">
            <RadioGroupItemWithLabel
              value="Ascending"
              onLabelPress={() => {}}
            />
            <RadioGroupItemWithLabel
              value="Descending"
              onLabelPress={() => {}}
            />
          </RadioGroup>
        </CollapsibleContent>
      </Collapsible>

      <ScrollView>
        {todos.map((t) => {
          return (
            <Pressable key={t.id} onPress={() => router.push(`/todos/${t.id}`)}>
              <TodoListItem todo={t} />
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
