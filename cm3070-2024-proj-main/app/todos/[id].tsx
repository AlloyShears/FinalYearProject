import { router, Stack, useLocalSearchParams } from "expo-router";
import {
  doc,
  collection,
  onSnapshot,
  Timestamp,
  setDoc,
  updateDoc,
  deleteDoc,
  FieldValue,
  increment,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import { Button as ButtonReact, View } from "react-native";
import { auth, db } from "~/firebase-config";
import { Text } from "~/components/ui/text";
import {
  Card,
  CardHeader,
  CardDescription,
  CardContent,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { TodoListItem } from "~/components/TodoListItem";
import { Todo } from "~/components/Todo";
import { useAuth } from "~/lib/useAuth";

export default function () {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [todo, setTodo] = useState<Todo>();
  const { user } = useAuth();

  useEffect(() => {
    const d = doc(collection(db, "todos"), id);

    const unsubscribe = onSnapshot(d, (s) => {
      return setTodo({
        id: s.id,
        ...s.data(),
      } as Todo);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <>
      <Stack.Screen
        options={{
          title: `${todo?.title}`,
          headerRight: () => (
            <ButtonReact
              onPress={() => router.back()}
              title="Back"
            ></ButtonReact>
          ),
        }}
      />
      <View className="p-4 gap-2">
        {todo && <TodoListItem todo={todo} />}

        <Card>
          <CardHeader>
            <CardDescription>Actions</CardDescription>
          </CardHeader>
          <CardContent className="gap-2">
            {todo?.status == "active" && (
              <Button
                className="w-full"
                onPress={() => {
                  router.push(`todos/${todo?.id}/edit`);
                }}
              >
                <Text>Edit</Text>
              </Button>
            )}
            <Button
              className="w-full"
              onPress={() => {
                const d = doc(collection(db, "todos"), id);
                deleteDoc(d);
                router.back();
              }}
            >
              <Text>Delete</Text>
            </Button>

            {todo?.status == "active" && (
              <Button
                className="w-full"
                onPress={() => {
                  const d = doc(collection(db, "todos"), id);
                  updateDoc(d, {
                    status: "completed",
                  });

                  setDoc(
                    doc(collection(db, "users"), user?.uid),
                    {
                      exp: increment(50),
                    },
                    {
                      merge: true,
                    }
                  );
                  router.back();
                }}
              >
                <Text>Mark as Completed</Text>
              </Button>
            )}
          </CardContent>
        </Card>
      </View>
    </>
  );
}
