import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, ready } = useAuth();

  if (!ready) return <div style={{ padding: 20 }}>Chargement...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return children;
}
