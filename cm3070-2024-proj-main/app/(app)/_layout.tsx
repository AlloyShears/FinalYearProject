import { Redirect, Stack, Tabs } from "expo-router";
import { MessageCircleMore } from "lucide-react-native";
import { Text } from "~/components/ui/text";
import { AuthContext } from "~/lib/auth-context";
import { ListTodo } from "~/lib/icons/ListTodo";
import { MoonStar } from "~/lib/icons/MoonStar";
import { User } from "~/lib/icons/User";
import { useAuth } from "~/lib/useAuth";

export default function () {
  const { isLoading, user } = useAuth();

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (!user) {
    // On web, static rendering will stop here as the user is not authenticated
    // in the headless Node process that the pages are rendered in.
    return <Redirect href="/(auth)" />;
  }

  return (
    <>
      <AuthContext.Provider value={{ user }}>
        <Stack.Screen options={{ headerShown: false }} />
        <Tabs>
          <Tabs.Screen
            name="index"
            options={{
              title: "Todo",
              tabBarIcon: ({ color }) => <ListTodo color={color} />,
            }}
          />
          <Tabs.Screen
            name="weather"
            options={{
              title: "Weather",
              tabBarIcon: ({ color }) => <MoonStar color={color} />,
            }}
          />
          <Tabs.Screen
            name="chat"
            options={{
              title: "Chat",
              tabBarIcon: ({ color }) => <MessageCircleMore color={color} />,
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              title: "Profile",
              tabBarIcon: ({ color }) => <User color={color} />,
            }}
          />
        </Tabs>
      </AuthContext.Provider>
    </>
  );
}
