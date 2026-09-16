import api from "./axios";

// ==========================================
// GET ALL CATEGORIES
// ==========================================

export const getCategories = async () => {
  const response = await api.get("/category/all-categories");

  return response.data;
};

// ==========================================
// ADD CATEGORY
// ==========================================

export const addCategory = async (data) => {
  const response = await api.post("/category/add-category", data);

  return response.data;
};
export const updateCategory = async (categoryId, data) => {
  const response = await api.put(
    `/category/update-category/${categoryId}`,
    data,
  );

  return response.data;
};
//  Delete Category

export const deleteCategory = async (categoryId) => {
  const response = await api.delete(`/category/delete-category/${categoryId}`);

  return response.data;
};

// ==========================================
// UPDATE CATEGORY STATUS
// ==========================================

export const updateCategoryStatus = async (categoryId, isActive) => {
  try {
    const response = await api.patch(
      `/category/update-category-status/${categoryId}`,
      {
        isActive: isActive,
      },
    );

    return response.data;
  } catch (error) {
    console.error("Update Category Status API Error:", error);

    throw error;
  }
};