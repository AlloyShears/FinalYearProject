import { router, Stack } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { Button as ButtonReact, View } from "react-native";
import MapView from "react-native-maps";
import { TodoList } from "~/components/TodoList";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Text } from "~/components/ui/text";
import { AuthContext } from "~/lib/auth-context";

export default function () {
  const { user } = useContext(AuthContext);
  const [tab, setTab] = useState("active");

  const [isLoadedPSI, setIsLoadedPSI] = useState(false);
  const [psi, setPSI] = useState(0);
  const [isLoadedUVI, setIsLoadedUVI] = useState(false);
  const [uvi, setUVI] = useState(0);
  
  function updatePSI() {
    fetch('https://api.data.gov.sg/v1/environment/psi')
      .then(response => response.json())
      .then(response => {
        setPSI(response.items[0]["readings"]["psi_twenty_four_hourly"]["central"])
      })
  }

  function updateUVI() {
    fetch('https://api.data.gov.sg/v1/environment/uv-index')
      .then(response => response.json())
      .then(response => {
        setUVI(response.items[0]["index"][0]["value"])
      })
  }

  useEffect(
    () => {
      if (!isLoadedPSI) {
        updatePSI();
        setIsLoadedPSI(true);
      }
    },
    [isLoadedPSI]
  )

  useEffect(
    () => {
      if (!isLoadedPSI) {
        updateUVI();
        setIsLoadedUVI(true);
      }
    },
    [isLoadedUVI]
  )
  
  return (
    <View>
      <MapView style={{ height: "25%", width: "100%" }}></MapView>
      <Card>
        <CardHeader>
            <CardTitle>It's a good day!</CardTitle>
            <CardDescription>PSI: {psi} - UV: {uvi}</CardDescription>
        </CardHeader>
        <CardContent>
            <Text>Here are your outdoor tasks!</Text>
        </CardContent>
      </Card>
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
    </View>
  );
}
