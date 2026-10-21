"use client";

import { createContext } from "react";

import { auth } from "../firebase";
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  setPersistence,
  browserSessionPersistence
} from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

export const authContext = createContext({
  user: null,
  loading: true,
  googleLoginHandler: async () => {},
  logout: async () => {},
});

export default function AuthContextProvider({ children }) {
  const [user, loading] = useAuthState(auth);

  const googleProvider = new GoogleAuthProvider();

  const googleLoginHandler = async () => {
    try {
      await setPersistence(auth, browserSessionPersistence);
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    signOut(auth);
  };

  const values = {
    user,
    loading,
    googleLoginHandler,
    logout,
  };

  return <authContext.Provider value={values}>{children}</authContext.Provider>;
}
