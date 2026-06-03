import { useContext } from "react";
import { AuthContext } from "./auth.store";


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth должен использоваться строго внутри AuthProvider");
  }
  return context;
};
