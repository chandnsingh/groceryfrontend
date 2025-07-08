// src/components/GuestRoute.jsx
import { Navigate } from "react-router-dom";

const GuestRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user ? <Navigate to="/" replace /> : children;
};

export default GuestRoute;
