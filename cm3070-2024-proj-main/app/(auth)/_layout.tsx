import { Slot, Stack } from "expo-router";

export default function () {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Slot />
    </>
  );
}
