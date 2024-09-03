import { router, Stack } from "expo-router";
import { Button as ButtonReact, View } from "react-native";
import { TodoForm } from "~/components/TodoForm";

export default function () {
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
          type="create"
          existing={undefined}
          onSubmit={() => {
            router.back();
          }}
        />
      </View>
    </>
  );
}
