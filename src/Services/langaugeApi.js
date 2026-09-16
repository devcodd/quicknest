import api from "./axios";

// ==========================================
// GET ALL LANGUAGES
// ==========================================

export const getLanguages = async () => {
  const response = await api.get("/language/get-languages");

  return response.data;
};

// ==========================================
// ADD LANGUAGE
// ==========================================

export const addLanguage = async (data) => {
  const response = await api.post("/language/add-language", data);

  return response.data;
};
//  Update Language

export const updateLanguage = async (languageId, data) => {
  const response = await api.put(
    `/language/update-language/${languageId}`,
    data,
  );

  return response.data;
};

export const deleteLanguage = async (languageId) => {
  const response = await api.delete(`/language/delete-language/${languageId}`);

  return response.data;
};


export const changeLanguageStatus = async (
  languageId,
  isActive
) => {
  const response = await api.patch(
    `/language/change-status/${languageId}`,
    {
      isActive,
    }
  );

  return response.data;
};