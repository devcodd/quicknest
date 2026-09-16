import api from "./axios";

// ==========================================
// GET COMMISSION & TAX SETTINGS
// ==========================================

export const getCommissionTax = async () => {
  const response = await api.get("/platform-settings/get-commission-tax");

  return response.data;
};

// ==========================================
// UPDATE COMMISSION & TAX SETTINGS
// ==========================================

export const updateCommissionTax = async (data) => {
  const response = await api.put("/platform-settings/commission-tax", data);

  return response.data;
};
