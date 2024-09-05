import { collection, doc, onSnapshot } from "firebase/firestore"; // Import Firestore functions for real-time data
import { useContext, useEffect, useState } from "react"; // React hooks for state, effects, and context
import { ScrollView, TouchableOpacity, View } from "react-native"; // Import components from React Native
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"; // Custom avatar components
import { Button } from "~/components/ui/button"; // Custom button component
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"; // Custom card components
import { Progress } from "~/components/ui/progress"; // Custom progress bar component
import { Text } from "~/components/ui/text"; // Custom text component
import { auth, db, storage } from "~/firebase-config"; // Firebase configuration
import { ColorContext } from "~/lib/color-context"; // Color context for theme management
import { useAuth } from "~/lib/useAuth"; // Custom hook for authentication
import { useColorScheme } from "~/lib/useColorScheme"; // Custom hook for color scheme management
import * as ImagePicker from "expo-image-picker"; // Import ImagePicker for selecting images
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Firebase storage functions for file uploads
import { v4 as uuidv4 } from "uuid"; // UUID generator
import { updateProfile } from "firebase/auth"; // Firebase function for updating user profile

interface CustomColor {
  label: string;
  color: string;
}

export default function () {
  // Theme options for the app
  const themes: ("light" | "dark" | "system")[] = ["light", "dark"];
  
  // Color options for customizing the app theme
  const colors: CustomColor[] = [
    { label: "red", color: "hsl(0, 100%, 50%)" },
    { label: "blue", color: "hsl(204, 100%, 50%)" },
    { label: "green", color: "hsl(111, 100%, 32%)" },
    { label: "orange", color: "hsl(45, 100%, 41%)" },
  ];

  const { setColorScheme } = useColorScheme(); // Function to set the color scheme
  const { setColor } = useContext(ColorContext); // Function to set the custom color
  const { user } = useAuth(); // Retrieve the current authenticated user

  const [exp, setExp] = useState(0); // State to store user's experience points (EXP)
  const [imageUrl, setImageURL] = useState<string | undefined>(); // State to store the user's profile image URL

  // Function to handle the snapshot of the user's data from Firestore
  function onUserSnapshot(snapshot: any) {
    setExp(snapshot.data().exp ?? 0); // Update EXP state with the value from Firestore
  }

  // Function to handle image upload for updating the profile picture
  const onUploadImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.2,
    });

    if (result?.assets == null || user == null) return; // If no image is selected or user is null, return

    const source = { uri: result.assets[0].uri }; // Get the URI of the selected image
    const response = await fetch(source.uri); // Fetch the image file from the URI
    const blob = await response.blob(); // Convert the image to a blob
    const filename = uuidv4(); // Generate a unique filename using UUID
    const storageRef = ref(storage, filename); // Create a reference to Firebase Storage
    await uploadBytes(storageRef, blob); // Upload the blob to Firebase Storage
    const url = await getDownloadURL(storageRef); // Get the download URL of the uploaded image

    // Update the user's profile with the new photo URL
    await updateProfile(user, {
      photoURL: url,
    });
    setImageURL(url); // Update the state with the new image URL
  };

  // Fetch the user's Firestore data and subscribe to changes
  useEffect(() => {
    if (user == null) return;
    const subscriber = onSnapshot(doc(collection(db, "users"), user?.uid), onUserSnapshot); // Subscribe to user data
    return subscriber; // Unsubscribe when the component unmounts
  }, [user]);

  return (
    <ScrollView className="flex-1 p-6 gap-2">
      {/* Card for displaying user profile information */}
      <Card>
        <CardHeader>
          {/* Allow the user to upload a new profile picture */}
          <TouchableOpacity onPress={onUploadImage}>
            <View style={{ flexDirection: "row", alignItems: "center" }} className="gap-2">
              <Avatar alt="Avatar">
                <AvatarImage source={{ uri: imageUrl ?? user?.photoURL ?? undefined }} />
                <AvatarFallback>
                  <Text>AV</Text>
                </AvatarFallback>
              </Avatar>
              <CardTitle>{user?.displayName ?? user?.email}</CardTitle> {/* Display user's name or email */}
            </View>
          </TouchableOpacity>
        </CardHeader>
        <CardContent>
          {/* Display user level and experience progress */}
          <Text>Lv. {Math.trunc(exp / 100) + 1} - EXP {exp % 100}/100</Text>
          <Progress value={(exp % 100) / 100} className="web:w-[60%]" /> {/* Progress bar */}
        </CardContent>
      </Card>

      {/* Card for theme selection */}
      <Card>
        <CardHeader>
          <CardDescription>Theme</CardDescription>
        </CardHeader>
        <CardContent>
          <View className="w-full gap-2">
            {themes.map((t) => (
              <Button key={t} onPress={() => setColorScheme(t)}>
                <Text>{t.charAt(0).toUpperCase() + t.slice(1)}</Text>
              </Button>
            ))}
          </View>
        </CardContent>
      </Card>

      {/* Card for color selection */}
      <Card>
        <CardHeader>
          <CardDescription>Colors</CardDescription>
        </CardHeader>
        <CardContent>
          <View className="w-full gap-2">
            {colors.map((t) => (
              <Button key={t.color} style={{ backgroundColor: t.color }} onPress={() => setColor(t.color)}>
                <Text>{t.label.charAt(0).toUpperCase() + t.label.slice(1)}</Text>
              </Button>
            ))}
            <Button onPress={() => setColor(undefined)}>
              <Text>Reset</Text>
            </Button>
          </View>
        </CardContent>
      </Card>

      {/* Card for settings (logout functionality) */}
      <Card>
        <CardHeader>
          <CardDescription>Settings</CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full" onPress={() => auth.signOut()}> {/* Logout button */}
            <Text>Logout</Text>
          </Button>
        </CardContent>
      </Card>
    </ScrollView>
  );
}
