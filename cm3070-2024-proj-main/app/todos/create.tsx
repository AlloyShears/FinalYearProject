import { router, Stack } from "expo-router"; // Import router and Stack from Expo for navigation
import { Button as ButtonReact, View } from "react-native"; // Import Button and View from React Native
import { TodoForm } from "~/components/TodoForm"; // Import custom TodoForm component

// Default component rendering the screen
export default function () {
  return (
    <>
      {/* Define the Stack.Screen options */}
      <Stack.Screen
        options={{
          headerRight: () => (
            // Button in the header to navigate back
            <ButtonReact
              onPress={() => router.back()} // Navigate back on press
              title="Back"
            ></ButtonReact>
          ),
        }}
      />

      {/* Main content area with padding and gap */}
      <View className="p-4 gap-2">
        {/* TodoForm component to create a new todo */}
        <TodoForm
          type="create" // Form type is "create" for new todo
          existing={undefined} // No existing todo, since this is a new form
          onSubmit={() => {
            router.back(); // Navigate back after form submission
          }}
        />
      </View>
    </>
  );
}
