import { Navigate } from "react-router-dom";
import { getSessionToken } from "./utils";

export default function ProtectedUserRoute({ children }: any) {
  const token = getSessionToken();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
