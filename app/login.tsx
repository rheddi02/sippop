import { LoginForm } from "@/components/LoginForm";
import PublicRoute from "@/components/PublicRoute";

export default function LoginScreen() {
  return (
    <PublicRoute>
      <LoginForm />
    </PublicRoute>
  );
}
