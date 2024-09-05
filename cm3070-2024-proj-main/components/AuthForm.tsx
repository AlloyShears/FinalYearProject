import { router } from "expo-router"; // Router for navigation
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  User,
} from "firebase/auth"; // Firebase authentication methods
import { Controller, SubmitHandler, useForm } from "react-hook-form"; // React Hook Form for form handling
import { View } from "react-native"; // View component for layout
import { Button } from "~/components/ui/button"; // Custom Button component
import { Text } from "~/components/ui/text"; // Custom Text component
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "~/components/ui/card"; // Card UI components
import { Input } from "~/components/ui/input"; // Custom Input component
import { Label } from "~/components/ui/label"; // Custom Label component
import { auth } from "~/firebase-config"; // Firebase configuration
import { Separator } from "./ui/separator"; // Separator component

// Props define the type of form (sign-in or sign-up) and a completion callback
interface Props {
  type: "sign-in" | "sign-up";
  onComplete: (user: User) => void;
}

// Inputs for the form (email and password)
interface Inputs {
  email: string;
  password: string;
}

// AuthForm component handles both sign-in and sign-up functionality
export function AuthForm(props: Props) {
  const {
    control,
    setError,
    formState: { errors },
    handleSubmit,
  } = useForm<Inputs>();

  // Function to handle form submission and authenticate user
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    // Use Firebase sign-in or sign-up based on form type
    (props.type == "sign-in"
      ? signInWithEmailAndPassword(auth, data.email, data.password)
      : createUserWithEmailAndPassword(auth, data.email, data.password)
    )
      .then((result) => {
        props.onComplete(result.user); // Call onComplete with the user on success
      })
      .catch((error) => {
        // Set error message in case of authentication failure
        setError("root", {
          type: error.code,
          message: error.message,
        });
      });
  };

  return (
    <Card>
      <CardHeader>
        {/* Display form title based on sign-in or sign-up */}
        <CardTitle>{props.type == "sign-in" ? "Login" : "Register"}</CardTitle>
        <CardDescription>
          {props.type == "sign-in" ? "Welcome back!" : "Hey, welcome!"}
        </CardDescription>
      </CardHeader>

      <CardContent className="gap-4 native:gap-2">
        {/* Email input field */}
        <View className="gap-1">
          <Controller
            name="email"
            control={control}
            rules={{ required: true }}
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

        {/* Password input field */}
        <View className="gap-1">
          <Controller
            name="password"
            control={control}
            rules={{ required: true }}
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
        {/* Display error message if there is one */}
        <View className="grid w-full">
          {errors.root?.message && <Text>{errors.root.message}</Text>}
        </View>

        {/* Submit button */}
        <View className="w-full">
          <Button className="grid w-full" onPress={handleSubmit(onSubmit)}>
            <Text>{props.type == "sign-in" ? "Login" : "Register"}</Text>
          </Button>
        </View>
      </CardFooter>
    </Card>
  );
}
