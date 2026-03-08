import { useUser } from "@/hooks/useUser";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import ThemedLoader from "./ThemedLoader";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthChecked } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user && isAuthChecked) {
      router.push("/login");
    }
  }, [user, isAuthChecked, router]);

  if (!user || !isAuthChecked) {
    return <ThemedLoader />
  }
  return children;
};

export default ProtectedRoute;