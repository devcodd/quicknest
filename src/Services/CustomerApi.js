import api from "./axios";

export const getAllCustomers = async ({
  search = "",
  page = 1,
  limit = 10,
} = {}) => {
  const response = await api.get("/auth/customer/get-all-customers", {
    params: {
      search,
      page,
      limit,
    },
  });

  return response.data;
};
