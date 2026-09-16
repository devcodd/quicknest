import api from "./axios";

// ==========================================
// GET ALL CURRENCIES
// ==========================================

export const getCurrencies = async () => {
  const response = await api.get("/currency/get-currencies");

  return response.data;
};

// ==========================================
// GET SELECTED CURRENCY
// ==========================================

export const getSelectedCurrency = async () => {
  const response = await api.get("/currency/get-selected-currency");

  return response.data;
};

// ==========================================
// SELECT / SAVE CURRENCY
// ==========================================

export const selectCurrency = async (code) => {
  const response = await api.post("/currency/select-currency", {
    code,
  });

  return response.data;
};
