import { Navigate } from "react-router-dom";

export default function RequireAuth({ children }: any) {
  const token = localStorage.getItem("token");

  // ❌ нет токена → в auth
  if (!token) {
    return <Navigate to="/auth" replace />;
  }

  // ✅ есть токен → пускаем
  return children;
}