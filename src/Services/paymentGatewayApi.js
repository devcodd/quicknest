import api from "./axios";

// ============================================
// STRIPE PAYMENT GATEWAY
// ============================================

// GET STRIPE CONFIGURATION
export const getStripeConfig = async () => {
  const response = await api.get("/admin/payment-gateway/stripe");
  return response.data;
};

// SAVE / CREATE STRIPE CONFIGURATION
export const saveStripeConfig = async (data) => {
  const response = await api.post("/admin/payment-gateway/stripe", data);

  return response.data;
};

// UPDATE STRIPE STATUS
export const updateStripeStatus = async (isActive) => {
  const response = await api.put("/admin/payment-gateway/stripe/status", {
    isActive,
  });

  return response.data;
};

// UPDATE STRIPE MODE
export const updateStripeMode = async (mode) => {
  const response = await api.put("/admin/payment-gateway/stripe/mode", {
    mode,
  });

  return response.data;
};
