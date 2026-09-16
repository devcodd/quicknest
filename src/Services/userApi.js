import api from "./axios";

// ==========================================
// GET ALL USERS
// ==========================================

export const getAllUsers = async () => {
  const response = await api.get("/auth/customer/users");

  return response.data;
};
