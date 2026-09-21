import api from "./axios";

// ============================================
// GET ALL PROVIDERS
// ============================================

export const getAllProviders = async () => {
  const response = await api.get("/admin/providers");
  return response.data;
};

// ============================================
// GET PROVIDER DETAILS
// ============================================

export const getProviderById = async (providerId) => {
  const response = await api.get(`/admin/providers/${providerId}`);
  return response.data;
};

// ============================================
// UPDATE PROVIDER STATUS
// ============================================

export const updateProviderStatus = async (
  providerId,
  status,
  rejectionReason = "",
) => {
  const payload = {
    status,
  };

  if (status === "rejected") {
    payload.rejectionReason = rejectionReason;
  }

  const response = await api.patch(
    `/admin/providers/${providerId}/status`,
    payload,
  );

  return response.data;
};
