import { Navigate } from "react-router-dom";
import { isLoggedIn, isAdmin } from "../utils/auth";

export default function AdminRoute({ children }) {
  if (!isLoggedIn()) return <Navigate to="/login" />;
  return isAdmin() ? children : <Navigate to="/" />;
}
