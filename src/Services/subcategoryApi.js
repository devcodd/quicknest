import api from "./axios";

// ==========================================
// GET SUBCATEGORIES BY CATEGORY
// ==========================================

export const getSubCategories = async (categoryId) => {
  const response = await api.get(`/subcategory/get-subcategory/${categoryId}`);

  return response.data;
};

// ==========================================
// ADD SUBCATEGORY
// ==========================================

export const addSubCategory = async (data) => {
  const response = await api.post("/subcategory/add-subcategory", data);

  return response.data;
};

// ==========================================
// UPDATE SUBCATEGORY
// ==========================================

export const updateSubCategory = async (subCategoryId, data) => {
  const response = await api.put(
    `/subcategory/update-subcategory/${subCategoryId}`,
    data,
  );

  return response.data;
};

// ==========================================
// DELETE SUBCATEGORY
// ==========================================

export const deleteSubCategory = async (subCategoryId) => {
  const response = await api.delete(
    `/subcategory/delete-subcategory/${subCategoryId}`,
  );

  return response.data;
};

export const changeSubCategoryStatus = async (subCategoryId, isActive) => {
  const response = await api.patch(
    `/subcategory/change-status/${subCategoryId}`,
    {
      isActive,
    },
  );

  return response.data;
};