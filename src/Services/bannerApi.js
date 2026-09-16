import api from "./axios";

// ==========================================
// GET ALL BANNERS
// ==========================================

export const getBanners = async () => {
  const response = await api.get("/banner/all-banners");

  return response.data;
};

export const addBanner = async (data) => {
  const response = await api.post("/banner/add-banner", data);

  return response.data;
};