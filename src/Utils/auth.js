// ==========================================
// LOGOUT
// ==========================================

export const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
  localStorage.removeItem("role");

  sessionStorage.removeItem("authAlertShown");
};
