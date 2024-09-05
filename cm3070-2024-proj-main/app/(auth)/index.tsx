import * as React from "react";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useState } from "react";
import { AuthForm } from "~/components/AuthForm";
import { router, Stack } from "expo-router";

export default function () {
  const [tab, setTab] = useState("sign-in");
  const onComplete = () => {
    router.push("/(app)");
  };

  return (
    <>
      <View className="flex-1 justify-center p-6">
        <Text className="text-6xl font-bold pb-4">Todo!</Text>
        <Tabs
          value={tab}
          onValueChange={setTab}
          className="w-full max-w-[400px] mx-auto flex-col gap-1.5"
        >
          <TabsList className="flex-row w-full">
            <TabsTrigger value="sign-in" className="flex-1">
              <Text>Login</Text>
            </TabsTrigger>
            <TabsTrigger value="sign-up" className="flex-1">
              <Text>Register</Text>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="sign-in">
            <AuthForm type="sign-in" onComplete={onComplete} />
          </TabsContent>
          <TabsContent value="sign-up">
            <AuthForm type="sign-up" onComplete={onComplete} />
          </TabsContent>
        </Tabs>
      </View>
    </>
  );
}
