import { Link, Stack } from 'expo-router'; // Imports for navigation and stack screen management
import { View } from 'react-native'; // View component for layout
import { Text } from '~/components/ui/text'; // Custom Text component

// NotFoundScreen component for handling 404 or non-existent routes
export default function NotFoundScreen() {
  return (
    <>
      {/* Stack screen header with a custom title */}
      <Stack.Screen options={{ title: 'Oops!' }} />
      
      <View>
        {/* Message indicating that the screen doesn't exist */}
        <Text>This screen doesn't exist.</Text>

        {/* Link to navigate back to the home screen */}
        <Link href='/'>
          <Text>Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}
