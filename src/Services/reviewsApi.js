import api from "./axios";

// ============================================
// GET ALL REVIEWS
// ============================================

export const getAllReviews = async ({ page = 1, limit = 10 } = {}) => {
  const response = await api.get("/admin/reviews", {
    params: {
      page,
      limit,
    },
  });

  return response.data;
};
