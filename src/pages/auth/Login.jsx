import React, { useState } from "react";
import { FiEye, FiEyeOff, FiLock, FiMail, FiArrowRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import api from "../../Services/axios";

import "./Login.css";

const Login = () => {
  const navigate = useNavigate();

  // ==========================================
  // FORM STATE
  // ==========================================

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  // ==========================================
  // INPUT CHANGE
  // ==========================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    // Clear field error while typing
    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };

  // ==========================================
  // VALIDATION
  // ==========================================

  const validateForm = () => {
    const newErrors = {};

    const email = formData.email.trim();
    const password = formData.password;

    if (!email) {
      newErrors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!password) {
      newErrors.password = "Password is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // ==========================================
  // LOGIN
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loading) {
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const payload = {
        email: formData.email.trim(),
        password: formData.password,
      };

      const response = await api.post("/auth/login", payload);

      console.log("Login Response:", response.data);

      // ========================================
      // SUCCESS
      // ========================================

      if (response.data?.success && response.data?.token) {
        const { token, user } = response.data;

        // Store authentication data
        localStorage.setItem("accessToken", token);

        if (user) {
          localStorage.setItem("user", JSON.stringify(user));
        }

        // Store role separately
        if (user?.role) {
          localStorage.setItem("role", user.role);
        }

        await Swal.fire({
          icon: "success",
          title: "Welcome Back!",
          text: "Login successful.",
          timer: 1200,
          showConfirmButton: false,
        });

        navigate("/dashboard", {
          replace: true,
        });

        return;
      }

      // ========================================
      // UNSUCCESSFUL RESPONSE
      // ========================================

      await Swal.fire({
        icon: "error",
        title: "Login Failed",
        text:
          response.data?.message ||
          "Unable to login. Please check your credentials.",
      });
    } catch (error) {
      console.error("Login Error:", error);

      // ========================================
      // API ERROR
      // ========================================

      const status = error?.response?.status;

      const serverMessage = error?.response?.data?.message;

      // ----------------------------------------
      // 401
      // ----------------------------------------

      if (status === 401) {
        await Swal.fire({
          icon: "error",
          title: "Invalid Credentials",
          text:
            serverMessage || "The email or password you entered is incorrect.",
        });

        return;
      }

      // ----------------------------------------
      // 403
      // ----------------------------------------

      if (status === 403) {
        await Swal.fire({
          icon: "error",
          title: "Access Denied",
          text:
            serverMessage ||
            "You don't have permission to access the admin panel.",
        });

        return;
      }

      // ----------------------------------------
      // 404
      // ----------------------------------------

      if (status === 404) {
        await Swal.fire({
          icon: "error",
          title: "Login Service Unavailable",
          text: serverMessage || "The login service could not be found.",
        });

        return;
      }

      // ----------------------------------------
      // 429
      // ----------------------------------------

      if (status === 429) {
        await Swal.fire({
          icon: "warning",
          title: "Too Many Attempts",
          text:
            serverMessage || "Too many login attempts. Please try again later.",
        });

        return;
      }

      // ----------------------------------------
      // 5xx
      // ----------------------------------------

      if (status >= 500) {
        await Swal.fire({
          icon: "error",
          title: "Server Error",
          text:
            serverMessage ||
            "Something went wrong on the server. Please try again later.",
        });

        return;
      }

      // ----------------------------------------
      // NETWORK ERROR
      // ----------------------------------------

      if (!error?.response) {
        await Swal.fire({
          icon: "error",
          title: "Connection Error",
          text: "Unable to connect to the server. Please check your internet connection and try again.",
        });

        return;
      }

      // ----------------------------------------
      // UNKNOWN ERROR
      // ----------------------------------------

      await Swal.fire({
        icon: "error",
        title: "Login Failed",
        text:
          serverMessage ||
          error?.message ||
          "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="quicknest-login-page">
      {/* ======================================
          LEFT BRAND PANEL
      ======================================= */}

      <div className="quicknest-login-brand-panel">
        <div className="quicknest-brand-content">
          <div className="quicknest-login-logo">QN</div>

          <h1>QuickNest</h1>

          <p className="quicknest-brand-tagline">
            Manage your service platform
            <br />
            from one powerful dashboard.
          </p>

          <div className="quicknest-brand-decoration">
            <div className="quicknest-decoration-circle circle-one" />

            <div className="quicknest-decoration-circle circle-two" />

            <div className="quicknest-decoration-circle circle-three" />

            <div className="quicknest-service-card card-one">
              <span>AC Repair</span>
              <strong>24</strong>
            </div>

            <div className="quicknest-service-card card-two">
              <span>Services</span>
              <strong>128</strong>
            </div>

            <div className="quicknest-service-card card-three">
              <span>Customers</span>
              <strong>1.2K</strong>
            </div>
          </div>

          <div className="quicknest-brand-footer">
            <span>© {new Date().getFullYear()} QuickNest</span>

            <span>Admin Portal</span>
          </div>
        </div>
      </div>

      {/* ======================================
          RIGHT LOGIN PANEL
      ======================================= */}

      <div className="quicknest-login-form-panel">
        <div className="quicknest-login-form-wrapper">
          {/* Mobile Logo */}

          <div className="quicknest-mobile-logo">
            <div className="quicknest-mobile-logo-box">QN</div>

            <span>QuickNest</span>
          </div>

          {/* Heading */}

          <div className="quicknest-login-heading">
            <span className="quicknest-login-welcome">Welcome back</span>

            <h2>Sign in to your account</h2>

            <p>Enter your credentials to access the admin dashboard.</p>
          </div>

          {/* ==================================
              FORM
          =================================== */}

          <form
            className="quicknest-login-form"
            onSubmit={handleSubmit}
            noValidate
          >
            {/* Email */}

            <div className="quicknest-login-field">
              <label htmlFor="email">Email Address</label>

              <div
                className={`quicknest-input-wrapper ${
                  errors.email ? "has-error" : ""
                }`}
              >
                <FiMail />

                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  autoComplete="email"
                  disabled={loading}
                />
              </div>

              {errors.email && (
                <span className="quicknest-field-error">{errors.email}</span>
              )}
            </div>

            {/* Password */}

            <div className="quicknest-login-field">
              <div className="quicknest-password-label">
                <label htmlFor="password">Password</label>
              </div>

              <div
                className={`quicknest-input-wrapper ${
                  errors.password ? "has-error" : ""
                }`}
              >
                <FiLock />

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  disabled={loading}
                />

                <button
                  type="button"
                  className="quicknest-password-toggle"
                  onClick={() => setShowPassword((previous) => !previous)}
                  disabled={loading}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>

              {errors.password && (
                <span className="quicknest-field-error">{errors.password}</span>
              )}
            </div>

            {/* Remember / Forgot */}

            <div className="quicknest-login-options">
              <label className="quicknest-remember">
                <input type="checkbox" disabled={loading} />

                <span>Remember me</span>
              </label>
            </div>

            {/* Submit */}

            <button
              type="submit"
              className="quicknest-login-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="quicknest-login-spinner" />

                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>

                  <FiArrowRight />
                </>
              )}
            </button>
          </form>

          <div className="quicknest-login-bottom">
            Secure admin access for QuickNest
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
