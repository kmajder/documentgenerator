import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext.js";
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Ładowanie...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};
