import { router, Stack } from "expo-router"; // Import router and Stack for navigation
import { useContext, useState } from "react"; // Import hooks for state management and context access
import { Button as ButtonReact, View } from "react-native"; // Import Button and View from React Native
import { TodoList } from "~/components/TodoList"; // Import custom TodoList component to display tasks
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs"; // Import tabs components for UI
import { Text } from "~/components/ui/text"; // Import Text component
import { AuthContext } from "~/lib/auth-context"; // Import AuthContext to access user authentication state

export default function () {
  const { user } = useContext(AuthContext); // Retrieve the current user from the authentication context
  const [tab, setTab] = useState("active"); // State to manage the currently selected tab (active/completed)

  return (
    <>
      {/* Define the Stack.Screen options */}
      <Stack.Screen
        options={{
          headerRight: () => (
            // Button in the header to navigate to the create todo screen
            <ButtonReact
              onPress={() => router.push("/todos/create")} // Navigate to the "create todo" screen on press
              title="Create"
            ></ButtonReact>
          ),
        }}
      />

      {/* Main content area */}
      <View>
        {/* Tabs for switching between active and completed tasks */}
        <Tabs
          value={tab} // Current tab state (active/completed)
          onValueChange={setTab} // Update tab state when user switches tabs
          className="w-full max-w-[400px] mx-auto flex-col gap-1.5"
        >
          <TabsList className="flex-row w-full">
            {/* Tab for active tasks */}
            <TabsTrigger value="active" className="flex-1">
              <Text>Active</Text>
            </TabsTrigger>

            {/* Tab for completed tasks */}
            <TabsTrigger value="completed" className="flex-1">
              <Text>Completed</Text>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Display the TodoList component filtered by the selected tab and the current user's ID */}
        <TodoList author={user?.uid} status={tab}></TodoList>
      </View>
    </>
  );
}
