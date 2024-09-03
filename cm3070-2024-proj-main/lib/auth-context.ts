import { User } from "firebase/auth";
import { createContext } from "react";

interface Context {
  user: User | undefined;
}

export const AuthContext = createContext<Context>({
  user: undefined,
});
