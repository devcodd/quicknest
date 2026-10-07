import api from "./axios";

export const getAllBookings = async ({ page = 1, limit = 20 } = {}) => {
  const response = await api.get("/admin/bookings", {
    params: {
      page,
      limit,
    },
  });

  return response.data;
};
