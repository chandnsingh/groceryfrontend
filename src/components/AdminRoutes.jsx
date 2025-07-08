import { Navigate, Outlet } from "react-router-dom";

const AdminRoute = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  return user?.isAdmin ? <Outlet /> : <Navigate to="/" />;
};

export default AdminRoute;
