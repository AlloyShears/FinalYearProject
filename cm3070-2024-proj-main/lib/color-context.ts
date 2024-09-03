import { createContext } from "react";

interface Context {
  color: string | undefined;
  setColor: (color: string | undefined) => void;
}
export const ColorContext = createContext<Context>({
  color: undefined,
  setColor: (color: string | undefined) => {},
});
