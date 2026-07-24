import { supabase } from "@/lib/supabase";
import {
  GoogleSignin,
  isSuccessResponse,
} from "@react-native-google-signin/google-signin";
import type { Session, User } from "@supabase/supabase-js";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { createContext, useEffect, useState } from "react";
import type { AppMetadata } from "@/utils/types";

type UserContextType = {
  user: User | null;
  isEmailVerified: boolean;
  isAdmin: boolean;
  canChangePassword: boolean;
  pendingEmail: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  refreshUser: () => Promise<boolean>;
  resetPassword: (email: string) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  isAuthChecked: boolean;
  loading?: boolean;
};

export const UserContext = createContext<UserContextType>({
  user: null,
  isEmailVerified: false,
  isAdmin: false,
  canChangePassword: false,
  pendingEmail: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  loginWithGoogle: async () => {},
  loginWithFacebook: async () => {},
  sendVerificationEmail: async () => {},
  refreshUser: async () => false,
  resetPassword: async () => {},
  changePassword: async () => {},
  isAuthChecked: false,
});

// Web client ID — Supabase verifies the Google ID token against this one,
// even though sign-in happens natively on Android. No iosClientId: this
// app is Android-only for now.
GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  offlineAccess: false,
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  // Set right after signUp() when the project requires email confirmation
  // (no session comes back yet) — lets the verify-email screen show/resend
  // to the right address before any user/session exists.
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);

  const user = session?.user ?? null;
  const isEmailVerified = !!user?.email_confirmed_at;
  // Exactly one shop-owner account; everyone else is a customer.
  const isAdmin = (user?.app_metadata as AppMetadata | undefined)?.role === "admin";
  // Google/Facebook accounts never set a Supabase password — only "email"
  // (email/password signup) accounts have one to change.
  const canChangePassword =
    (user?.app_metadata as AppMetadata | undefined)?.provider === "email";

  // 🔑 Email login
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        if (error.message.toLowerCase().includes("email not confirmed")) {
          setPendingEmail(email);
        }
        throw error;
      }
      setPendingEmail(null);
    } finally {
      setLoading(false);
    }
  };

  // 🧾 Register
  const register = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      // A session only comes back immediately if this Supabase project has
      // email confirmation disabled. Otherwise the account exists but
      // sign-in is blocked until the confirmation link is clicked.
      if (!data.session) {
        setPendingEmail(email);
      }
    } finally {
      setLoading(false);
    }
  };

  // 🚪 Logout
  const logout = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      setPendingEmail(null);
    } finally {
      setLoading(false);
    }
  };

  const sendVerificationEmail = async () => {
    const email = user?.email ?? pendingEmail;
    if (!email) return;
    const { error } = await supabase.auth.resend({ type: "signup", email });
    if (error) throw error;
  };

  // Supabase has no Firebase-style reload()+emailVerified recheck —
  // confirmation happens by clicking the emailed link. This just re-checks
  // whether a session has appeared since the screen was shown.
  const refreshUser = async (): Promise<boolean> => {
    const { data } = await supabase.auth.getSession();
    setSession(data.session);
    return !!data.session;
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: Linking.createURL("reset-password"),
    });
    if (error) throw error;
  };

  // Re-authenticates with the current password before applying the new one.
  // signInWithPassword re-fires onAuthStateChange, but since it's the same
  // user it just swaps in an equivalent session — no logout, no redirect.
  const changePassword = async (currentPassword: string, newPassword: string) => {
    if (!user?.email) throw new Error("No active session.");
    setLoading(true);
    try {
      const { error: reauthError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });
      if (reauthError) throw new Error("Current password is incorrect.");

      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (updateError) throw updateError;
    } finally {
      setLoading(false);
    }
  };

  // 🔍 Observe Supabase auth state
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setIsAuthChecked(true);
    });
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
        setIsAuthChecked(true);
      },
    );
    return () => listener.subscription.unsubscribe();
  }, []);

  // 🔐 Google Login
  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const response = await GoogleSignin.signIn();
      if (isSuccessResponse(response) && response.data.idToken) {
        const { error } = await supabase.auth.signInWithIdToken({
          provider: "google",
          token: response.data.idToken,
        });
        if (error) throw error;
      }
    } finally {
      setLoading(false);
    }
  };

  // 📘 Facebook Login — classic native login only returns an opaque OAuth
  // access token, not the OIDC ID token Supabase's signInWithIdToken
  // requires, so this goes through Supabase's browser-redirect OAuth flow
  // instead (the officially supported path for Facebook on native/Expo),
  // using the app's existing "aysippopstore" deep link scheme to return here.
  const loginWithFacebook = async () => {
    setLoading(true);
    try {
      const redirectTo = Linking.createURL("auth-callback");
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "facebook",
        options: { redirectTo, skipBrowserRedirect: true },
      });
      if (error) throw error;
      if (!data?.url) return;

      const result = await WebBrowser.openAuthSessionAsync(
        data.url,
        redirectTo,
      );
      // "cancel"/"dismiss" with no url means the browser closed before handing
      // the redirect back to the app — some browsers (e.g. Brave) don't
      // reliably hand off custom URL-scheme redirects, which looks like this.
      if (result.type !== "success" || !result.url) {
        if (result.type === "cancel") return;
        throw new Error(
          "Facebook sign-in didn't complete — the browser closed before returning to the app. If this keeps happening, try a different browser (e.g. Chrome).",
        );
      }

      // Supabase returns tokens in the URL hash fragment, not query params —
      // swap it for "?" so expo-linking's query parser picks them up.
      const { queryParams } = Linking.parse(result.url.replace("#", "?"));
      if (queryParams?.error) {
        throw new Error(String(queryParams.error_description ?? queryParams.error));
      }

      const accessToken = queryParams?.access_token as string | undefined;
      const refreshToken = queryParams?.refresh_token as string | undefined;
      if (accessToken && refreshToken) {
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        if (sessionError) throw sessionError;
      } else {
        throw new Error("Facebook sign-in didn't return valid tokens. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isEmailVerified,
        isAdmin,
        canChangePassword,
        pendingEmail,
        login,
        register,
        logout,
        loginWithGoogle,
        loginWithFacebook,
        sendVerificationEmail,
        refreshUser,
        resetPassword,
        changePassword,
        isAuthChecked,
        loading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
