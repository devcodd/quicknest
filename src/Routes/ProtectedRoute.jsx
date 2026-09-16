import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();

  const token = localStorage.getItem("accessToken");

  // ==========================================
  // NO AUTHENTICATION
  // ==========================================

  if (!token) {
    const alertShown = sessionStorage.getItem("authAlertShown");

    if (!alertShown) {
      sessionStorage.setItem("authAlertShown", "true");

      Swal.fire({
        icon: "warning",
        title: "Authentication Required",
        text: "Please login to access the admin panel.",
        confirmButtonText: "Go to Login",
      });
    }

    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  // ==========================================
  // AUTHENTICATED
  // ==========================================

  return children;
};

export default ProtectedRoute;
