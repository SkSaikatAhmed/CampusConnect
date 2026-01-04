import { Navigate } from "react-router-dom";
import { isAdmin } from "../utils/auth";

function AdminRoute({ children }) {
  return isAdmin() ? children : <Navigate to="/" />;
}

export default AdminRoute;
