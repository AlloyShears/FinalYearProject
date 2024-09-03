import { router } from "expo-router";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  User,
} from "firebase/auth";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { View } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { auth } from "~/firebase-config";
import { Separator } from "./ui/separator";

interface Props {
  type: "sign-in" | "sign-up";
  onComplete: (user: User) => void;
}

interface Inputs {
  email: string;
  password: string;
}

export function AuthForm(props: Props) {
  const {
    control,
    setError,
    formState: { errors },
    handleSubmit,
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    (props.type == "sign-in"
      ? signInWithEmailAndPassword(auth, data.email, data.password)
      : createUserWithEmailAndPassword(auth, data.email, data.password)
    )
      .then((result) => {
        props.onComplete(result.user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        setError("root", {
          type: errorCode,
          message: errorMessage,
        });
      });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{props.type == "sign-in" ? "Login" : "Register"}</CardTitle>
        <CardDescription>
          {props.type == "sign-in" ? "Welcome back!" : "Hey, welcome!"}
        </CardDescription>
      </CardHeader>
      <CardContent className="gap-4 native:gap-2">
        <View className="gap-1">
          <Controller
            name="email"
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <Label nativeID="email">Email</Label>
                <Input
                  autoCapitalize="none"
                  autoComplete="email"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              </>
            )}
          />
        </View>
        <View className="gap-1">
          <Controller
            name="password"
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <Label nativeID="password">Password</Label>
                <Input
                  autoCapitalize="none"
                  autoComplete={
                    props.type == "sign-in"
                      ? "current-password"
                      : "new-password"
                  }
                  secureTextEntry
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              </>
            )}
          />
        </View>
      </CardContent>
      <CardFooter>
        <View className="w-full">
          <View className="grid w-full">
            {errors.root?.message && <Text>{errors.root.message}</Text>}
          </View>

          <Button className="grid w-full" onPress={handleSubmit(onSubmit)}>
            <Text>{props.type == "sign-in" ? "Login" : "Register"}</Text>
          </Button>
        </View>
      </CardFooter>
    </Card>
  );
}
