import { router, Stack } from "expo-router"; // Import router and Stack for navigation
import { useContext, useEffect, useState } from "react"; // Import hooks for state and lifecycle management
import { Button as ButtonReact, View } from "react-native"; // Import Button and View from React Native
import MapView from "react-native-maps"; // Import MapView for displaying a map
import { TodoList } from "~/components/TodoList"; // Import custom TodoList component
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"; // Import card components
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs"; // Import tabs components for UI
import { Text } from "~/components/ui/text"; // Import Text component
import { AuthContext } from "~/lib/auth-context"; // Import AuthContext to access user authentication state

export default function () {
  const { user } = useContext(AuthContext); // Retrieve the current user from the authentication context
  const [tab, setTab] = useState("active"); // State to manage the current tab (active/completed)

  // State to manage the loading and values of PSI and UVI
  const [isLoadedPSI, setIsLoadedPSI] = useState(false);
  const [psi, setPSI] = useState(0);
  const [isLoadedUVI, setIsLoadedUVI] = useState(false);
  const [uvi, setUVI] = useState(0);

  // Fetch and update PSI (Pollutant Standards Index)
  function updatePSI() {
    fetch('https://api.data.gov.sg/v1/environment/psi')
      .then(response => response.json())
      .then(response => {
        setPSI(response.items[0]["readings"]["psi_twenty_four_hourly"]["central"]); // Update PSI value
      });
  }

  // Fetch and update UVI (Ultraviolet Index)
  function updateUVI() {
    fetch('https://api.data.gov.sg/v1/environment/uv-index')
      .then(response => response.json())
      .then(response => {
        setUVI(response.items[0]["index"][0]["value"]); // Update UVI value
      });
  }

  // Fetch PSI only once when the component is first loaded
  useEffect(() => {
    if (!isLoadedPSI) {
      updatePSI();
      setIsLoadedPSI(true); // Ensure PSI is only loaded once
    }
  }, [isLoadedPSI]);

  // Fetch UVI only once when the component is first loaded
  useEffect(() => {
    if (!isLoadedUVI) {
      updateUVI();
      setIsLoadedUVI(true); // Ensure UVI is only loaded once
    }
  }, [isLoadedUVI]);

  return (
    <View>
      {/* Display a map covering 25% of the screen height */}
      <MapView style={{ height: "25%", width: "100%" }}></MapView>
      
      {/* Card displaying PSI and UVI information */}
      <Card>
        <CardHeader>
          <CardTitle>It's a good day!</CardTitle>
          <CardDescription>PSI: {psi} - UV: {uvi}</CardDescription> {/* Show PSI and UVI values */}
        </CardHeader>
        <CardContent>
          <Text>Here are your outdoor tasks!</Text>
        </CardContent>
      </Card>

      {/* Tab system for switching between active and completed tasks */}
      <View>
        <Tabs
          value={tab} // Current tab state
          onValueChange={setTab} // Change tab on click
          className="w-full max-w-[400px] mx-auto flex-col gap-1.5"
        >
          <TabsList className="flex-row w-full">
            <TabsTrigger value="active" className="flex-1">
              <Text>Active</Text> {/* Tab for active tasks */}
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex-1">
              <Text>Completed</Text> {/* Tab for completed tasks */}
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Display list of tasks based on selected tab (active or completed) */}
        <TodoList author={user?.uid} status={tab} /> {/* Show tasks filtered by user and status */}
      </View>
    </View>
  );
}
