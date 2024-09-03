import { collection, doc, onSnapshot } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";
import { Text } from "~/components/ui/text";
import { auth, db, storage } from "~/firebase-config";
import { ColorContext } from "~/lib/color-context";
import { useAuth } from "~/lib/useAuth";
import { useColorScheme } from "~/lib/useColorScheme";
import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { updateProfile } from "firebase/auth";

interface CustomColor {
  label: string;
  color: string;
}

export default function () {
  const themes: ("light" | "dark" | "system")[] = ["light", "dark"];
  const colors: CustomColor[] = [
    {
      label: "red",
      color: "hsl(0, 100%, 50%)",
    },
    {
      label: "blue",
      color: "hsl(204, 100%, 50%)",
    },
    {
      label: "green",
      color: "hsl(111, 100%, 32%)",
    },
    {
      label: "orange",
      color: "hsl(45, 100%, 41%)",
    },
  ];
  const { setColorScheme } = useColorScheme();
  const { setColor } = useContext(ColorContext);
  const { user } = useAuth();
  const [exp, setExp] = useState(0);
  const [imageUrl, setImageURL] = useState<string | undefined>();

  function onUserSnapshot(snapshot: any) {
    setExp(snapshot.data().exp ?? 0);
  }

  const onUploadImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.2,
    });

    if (result?.assets == null) return;
    if (user == null) return;

    const source = { uri: result.assets[0].uri };
    const response = await fetch(source.uri);
    const blob = await response.blob();
    const filename = uuidv4();
    const storageRef = ref(storage, filename);
    const storageRes = await uploadBytes(storageRef, blob);
    const url = await getDownloadURL(storageRef);

    await updateProfile(user, {
      photoURL: url,
    });
    setImageURL(url);
  };

  useEffect(() => {
    if (user == null) return;
    const subscriber = onSnapshot(
      doc(collection(db, "users"), user?.uid),
      onUserSnapshot
    );
    return subscriber;
  }, [user]);

  return (
    <ScrollView className="flex-1 p-6 gap-2">
      <Card>
        <CardHeader>
          <TouchableOpacity onPress={onUploadImage}>
            <View
              style={{ flexDirection: "row", alignItems: "center" }}
              className="gap-2"
            >
              <Avatar alt="Avatar">
                <AvatarImage
                  source={{ uri: imageUrl ?? user?.photoURL ?? undefined }}
                />
                <AvatarFallback>
                  <Text>AV</Text>
                </AvatarFallback>
              </Avatar>
              <CardTitle>{user?.displayName ?? user?.email}</CardTitle>
            </View>
          </TouchableOpacity>
        </CardHeader>
        <CardContent>
          <Text>
            Lv. {Math.trunc(exp / 100) + 1} - EXP {exp % 100}/100
          </Text>
          <Progress value={(exp % 100) / 100} className="web:w-[60%]" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription>Theme</CardDescription>
        </CardHeader>
        <CardContent>
          <View className="w-full gap-2">
            {themes.map((t) => (
              <Button
                key={t}
                onPress={() => {
                  setColorScheme(t);
                }}
              >
                <Text>{t.charAt(0).toUpperCase() + t.slice(1)}</Text>
              </Button>
            ))}
          </View>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription>Colors</CardDescription>
        </CardHeader>
        <CardContent>
          <View className="w-full gap-2">
            {colors.map((t) => (
              <Button
                key={t.color}
                style={{ backgroundColor: t.color }}
                onPress={() => {
                  setColor(t.color);
                }}
              >
                <Text>
                  {t.label.charAt(0).toUpperCase() + t.label.slice(1)}
                </Text>
              </Button>
            ))}
            <Button
              onPress={() => {
                setColor(undefined);
              }}
            >
              <Text>Reset</Text>
            </Button>
          </View>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardDescription>Settings</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            className="w-full"
            onPress={() => {
              auth.signOut();
            }}
          >
            <Text>Logout</Text>
          </Button>
        </CardContent>
      </Card>
    </ScrollView>
  );
}
