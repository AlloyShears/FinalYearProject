import { Slot, Stack } from "expo-router";
import { useAuth } from "~/lib/useAuth";
import { Text } from "~/components/ui/text";
import { AuthContext } from "~/lib/auth-context";

export default function () {
  const { isLoading, user } = useAuth();

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  return (
    <>
      <AuthContext.Provider value={{ user }}>
        <Slot />
      </AuthContext.Provider>
    </>
  );
}
