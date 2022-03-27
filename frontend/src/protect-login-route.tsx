import { Navigate } from "react-router-dom";
import { getSessionToken } from "./utils";

export default function ProtectedLoginRoute({ children }: any) {
  const token = getSessionToken();

  if (token) {
    return <Navigate to="/area_empresa" replace />;
  }

  return children;
}
