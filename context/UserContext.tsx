import { auth } from "@/lib/firebase";
import {
  GoogleSignin,
  isSuccessResponse,
} from "@react-native-google-signin/google-signin";
import {
  createUserWithEmailAndPassword,
  FacebookAuthProvider,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithCredential,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { AccessToken, LoginManager, Settings } from "react-native-fbsdk-next";

type UserContextType = {
  user: any;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  refreshUser: () => Promise<boolean>;
  resetPassword: (email: string) => Promise<void>;
  isAuthChecked: boolean;
  loading?: boolean;
};

export const UserContext = createContext<UserContextType>({
  user: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  loginWithGoogle: async () => {},
  loginWithFacebook: async () => {},
  sendVerificationEmail: async () => {},
  refreshUser: async () => false,
  resetPassword: async () => {},
  isAuthChecked: false,
});

// Web client ID — Firebase verifies the Google ID token against this one,
// even though sign-in happens natively on Android. No iosClientId: this
// app is Android-only for now.
GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  offlineAccess: false,
});

// Defensive: the config plugin sets the Facebook App ID natively via
// Info.plist / AndroidManifest, but initializing here too avoids
// "App ID not found" errors if that step is ever skipped.
if (process.env.EXPO_PUBLIC_FACEBOOK_APP_ID) {
  Settings.setAppID(process.env.EXPO_PUBLIC_FACEBOOK_APP_ID);
  Settings.initializeSDK();
}

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

  const sendVerificationEmail = async () => {
    if (!auth.currentUser) return;
    await sendEmailVerification(auth.currentUser);
  };

  const refreshUser = async (): Promise<boolean> => {
    if (!auth.currentUser) return false;
    await auth.currentUser.reload();
    const verified = auth.currentUser.emailVerified;
    if (verified) {
      setUser(auth.currentUser);
    }
    return verified;
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
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
  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const response = await GoogleSignin.signIn();
      if (isSuccessResponse(response) && response.data.idToken) {
        const credential = GoogleAuthProvider.credential(
          response.data.idToken,
        );
        await signInWithCredential(auth, credential);
      }
    } finally {
      setLoading(false);
    }
  };

  // 📘 Facebook Login
  const loginWithFacebook = async () => {
    setLoading(true);
    try {
      const result = await LoginManager.logInWithPermissions([
        "public_profile",
        "email",
      ]);
      if (result.isCancelled) return;

      const tokenData = await AccessToken.getCurrentAccessToken();
      if (!tokenData?.accessToken) {
        throw new Error("Facebook login failed: no access token returned.");
      }

      const credential = FacebookAuthProvider.credential(
        tokenData.accessToken,
      );
      await signInWithCredential(auth, credential);
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        loginWithGoogle,
        loginWithFacebook,
        sendVerificationEmail,
        refreshUser,
        resetPassword,
        isAuthChecked,
        loading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
