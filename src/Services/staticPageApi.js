import api from "./axios";

// ==========================================
// GET ALL STATIC PAGES
// ==========================================

export const getStaticPages = async () => {
  const response = await api.get("/static-page/get-all");

  return response.data;
};

// ==========================================
// GET STATIC PAGE BY SLUG
// ==========================================

export const getStaticPageBySlug = async (slug) => {
  const response = await api.get(`/static-page/get/${slug}`);

  return response.data;
};

// ==========================================
// GET STATIC PAGE BY ID
// ==========================================

export const getStaticPageById = async (pageId) => {
  const response = await api.get(`/static-page/get-by-id/${pageId}`);

  return response.data;
};

// ==========================================
// ADD STATIC PAGE
// ==========================================

export const addStaticPage = async (pageData) => {
  const response = await api.post("/static-page/add", pageData);

  return response.data;
};

// ==========================================
// UPDATE STATIC PAGE
// ==========================================

export const updateStaticPage = async (pageId, pageData) => {
  const response = await api.put(`/static-page/update/${pageId}`, pageData);

  return response.data;
};

// ==========================================
// DELETE STATIC PAGE
// ==========================================

export const deleteStaticPage = async (pageId) => {
  const response = await api.delete(`/static-page/delete/${pageId}`);

  return response.data;
};


