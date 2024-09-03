import { onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "~/firebase-config";

export function useAuth() {
  const [isLoading, setLoading] = useState(true);
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        setUser(user);
      } else {
        setUser(undefined);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { isLoading, user };
}
