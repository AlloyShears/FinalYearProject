// Import necessary modules for routing, Firestore queries, React hooks, and UI components
import { router } from "expo-router"; // Expo router for navigation
import {
  query,
  collection,
  where,
  onSnapshot,
  Timestamp,
  orderBy,
} from "firebase/firestore"; // Firestore methods for querying data
import React, { useState, useEffect } from "react"; // React hooks for state management and lifecycle methods
import { Pressable, ScrollView, View } from "react-native"; // React Native components for layout and interactions
import { db } from "~/firebase-config"; // Firebase configuration
import { TodoListItem } from "./TodoListItem"; // TodoListItem component for displaying each todo
import { Todo } from "./Todo"; // Todo type definition
import { SafeAreaView } from "react-native-safe-area-context"; // SafeAreaView for iOS safe area handling
import { DropdownMenu, DropdownMenuItem } from "./ui/dropdown-menu"; // Dropdown menu UI component
import { Select, SelectContent, SelectItem } from "./ui/select"; // Select input component
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible"; // Collapsible component for collapsible sections
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"; // Radio group for selection inputs
import { Label } from "./ui/label"; // Label component
import { Text } from "./ui/text"; // Text component for rendering text

// Define the props for the TodoList component, which includes author and status
type Props = {
  author: string | undefined;
  status: string;
};

// RadioGroupItemWithLabel renders a radio button with a label and provides a press handler
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

// TodoList component to display a list of todo items based on author and status
export function TodoList(props: Props) {
  const [sort, setSort] = useState<string>("Ascending"); // State to track the sort order (ascending/descending)
  const [todos, setTodos] = useState<Todo[]>([]); // State to store the list of todos

  // useEffect hook to run the Firestore query when component mounts or dependencies change
  useEffect(() => {
    const q = query(
      collection(db, "todos"), // Collection reference
      where("author", "==", props.author), // Filter by author
      where("status", "==", props.status), // Filter by status
      orderBy("deadline", sort == "Ascending" ? "asc" : "desc") // Sort by deadline
    );

    // Listen to real-time updates from Firestore and update todos state
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

    // Cleanup function to unsubscribe from Firestore when the component unmounts
    return () => {
      unsubscribe();
    };
  }, [props.status, sort]); // Dependencies: run effect when status or sort changes

  return (
    <View className="p-4 gap-4" style={{ minHeight: "100%" }}>
      {/* Collapsible section for filtering options */}
      <Collapsible>
        <CollapsibleTrigger>
          <Text>Filters</Text> {/* Trigger to show filters */}
        </CollapsibleTrigger>
        <CollapsibleContent>
          {/* Radio group for selecting sort order */}
          <RadioGroup value={sort} onValueChange={setSort} className="gap-3">
            <RadioGroupItemWithLabel
              value="Ascending"
              onLabelPress={() => {}} // Press handler for ascending option
            />
            <RadioGroupItemWithLabel
              value="Descending"
              onLabelPress={() => {}} // Press handler for descending option
            />
          </RadioGroup>
        </CollapsibleContent>
      </Collapsible>

      {/* Scrollable list of todos */}
      <ScrollView>
        {todos.map((t) => {
          return (
            // Each todo item is pressable and navigates to its detail page
            <Pressable key={t.id} onPress={() => router.push(`/todos/${t.id}`)}>
              <TodoListItem todo={t} /> {/* Display each todo item */}
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
