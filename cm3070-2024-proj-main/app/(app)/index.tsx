import { router, Stack } from "expo-router";
import { useContext, useState } from "react";
import { Button as ButtonReact, View } from "react-native";
import { TodoList } from "~/components/TodoList";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Text } from "~/components/ui/text";
import { AuthContext } from "~/lib/auth-context";

export default function () {
  const { user } = useContext(AuthContext);
  const [tab, setTab] = useState("active");

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <ButtonReact
              onPress={() => router.push("/todos/create")}
              title="Create"
            ></ButtonReact>
          ),
        }}
      />
      <View>
        <Tabs
          value={tab}
          onValueChange={setTab}
          className="w-full max-w-[400px] mx-auto flex-col gap-1.5"
        >
          <TabsList className="flex-row w-full">
            <TabsTrigger value="active" className="flex-1">
              <Text>Active</Text>
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex-1">
              <Text>Completed</Text>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <TodoList author={user?.uid} status={tab}></TodoList>
      </View>
    </>
  );
}
