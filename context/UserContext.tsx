import { auth } from "@/lib/firebase";
import * as Google from "expo-auth-session/providers/google";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";
import { createContext, useEffect, useState } from "react";

type UserContextType = {
  user: any;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  isAuthChecked: boolean;
  loading?: boolean;
};

export const UserContext = createContext<UserContextType>({
  user: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  loginWithGoogle: async () => {},
  isAuthChecked: false,
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🔑 Email login
  const login = async (email: string, password: string) => {
    setLoading(true);
    await signInWithEmailAndPassword(auth, email, password);
    setLoading(false);
  };

  // 🧾 Register
  const register = async (email: string, password: string) => {
    setLoading(true);
    await createUserWithEmailAndPassword(auth, email, password);
    setLoading(false);
  };

  // 🚪 Logout
  const logout = async () => {
    setLoading(true);
    await signOut(auth);
    setLoading(false);
  };

  // 🔍 Observe Firebase auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsAuthChecked(true);
    });
    return unsubscribe;
  }, []);

  // 🔐 Google Login
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    // iosClientId: "YOUR_IOS_CLIENT_ID.apps.googleusercontent.com",
    redirectUri: 'https://auth.expo.io/@rheddi02/aysippop-store'
  });
  console.log("🚀 ~ UserProvider ~ response:", response)

  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      if (authentication?.idToken) {
        const credential = GoogleAuthProvider.credential(authentication.idToken);
        signInWithCredential(auth, credential);
      }
    }
  }, [response]);

  const loginWithGoogle = async () => {
    await promptAsync();
  };

  return (
    <UserContext.Provider
      value={{ user, login, register, logout, loginWithGoogle, isAuthChecked, loading }}
    >
      {children}
    </UserContext.Provider>
  );
};
