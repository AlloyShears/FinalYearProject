import { router, Stack, useLocalSearchParams } from "expo-router";
import { doc, collection, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Button as ButtonReact, View } from "react-native";
import { Todo } from "~/components/Todo";
import { TodoForm } from "~/components/TodoForm";
import { db } from "~/firebase-config";

export default function () {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [isLoading, setLoading] = useState(true);
  const [todo, setTodo] = useState<Todo>();

  useEffect(() => {
    const d = doc(collection(db, "todos"), id);

    const unsubscribe = onSnapshot(d, (s) => {
      setTodo({
        id: s.id,
        ...s.data(),
      } as Todo);
      return setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  if (isLoading) return <></>;

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <ButtonReact
              onPress={() => router.back()}
              title="Back"
            ></ButtonReact>
          ),
        }}
      />
      <View className="p-4 gap-2">
        <TodoForm
          type="edit"
          existing={todo}
          onSubmit={() => {
            router.back();
          }}
        />
      </View>
    </>
  );
}
