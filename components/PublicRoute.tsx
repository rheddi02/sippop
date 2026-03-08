import { useUser } from "@/hooks/useUser";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import ThemedLoader from "./ThemedLoader";

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthChecked } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user && isAuthChecked) {
      router.push("/");
    }
  }, [user, isAuthChecked, router]);

  if (!isAuthChecked) {
    return <ThemedLoader />
  }
  
  if (user) {
    return <ThemedLoader />
  }
  return children;
};

export default PublicRoute;