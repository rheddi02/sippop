import { useUser } from "@/hooks/useUser";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import ThemedLoader from "./ThemedLoader";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthChecked } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthChecked) return;
    if (!user) {
      router.push("/login");
    } else if (!user.emailVerified) {
      router.push("/verify-email");
    }
  }, [user, isAuthChecked, router]);

  if (!isAuthChecked || !user || !user.emailVerified) {
    return <ThemedLoader />;
  }
  return children;
};

export default ProtectedRoute;