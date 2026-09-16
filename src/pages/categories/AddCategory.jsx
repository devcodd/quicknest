import React, { useState } from "react";
import { FiArrowLeft, FiUploadCloud, FiSave, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import { addCategory } from "../../Services/categoryApi";

import "./AddCategory.css";

const AddCategory = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    categoryName: "",
    slug: "",
    image: null,
    isActive: true,
    description: "",
  });

  const [imagePreview, setImagePreview] = useState("");

  const [errors, setErrors] = useState({});

  const [loading, setLoading] = useState(false);

  // ==========================================
  // INPUT
  // ==========================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };

  // ==========================================
  // CATEGORY NAME -> SLUG
  // ==========================================

  const handleCategoryNameChange = (event) => {
    const value = event.target.value;

    const generatedSlug = value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    setFormData((previous) => ({
      ...previous,
      categoryName: value,
      slug: generatedSlug,
    }));

    setErrors((previous) => ({
      ...previous,
      categoryName: "",
      slug: "",
    }));
  };

  // ==========================================
  // IMAGE
  // ==========================================

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setFormData((previous) => ({
      ...previous,
      image: file,
    }));

    setImagePreview(URL.createObjectURL(file));

    setErrors((previous) => ({
      ...previous,
      image: "",
    }));
  };

  // ==========================================
  // REMOVE IMAGE
  // ==========================================

  const handleRemoveImage = () => {
    setFormData((previous) => ({
      ...previous,
      image: null,
    }));

    setImagePreview("");
  };

  // ==========================================
  // VALIDATION
  // ==========================================

  const validateForm = () => {
    const newErrors = {};

    if (!formData.categoryName.trim()) {
      newErrors.categoryName = "Category name is required.";
    }

    if (!formData.slug.trim()) {
      newErrors.slug = "Slug is required.";
    }

    if (!formData.image) {
      newErrors.image = "Category image is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      // ========================================
      // CREATE FORMDATA
      // ========================================

      const payload = new FormData();

      payload.append("categoryName", formData.categoryName);

      payload.append("slug", formData.slug);

      payload.append("image", formData.image);

      payload.append("isActive", formData.isActive);

      payload.append("description", formData.description);

      // ========================================
      // DEBUG
      // ========================================

      console.log("Category FormData:");

      for (const [key, value] of payload.entries()) {
        console.log(key, value);
      }

      // ========================================
      // API CALL
      // ========================================

      const response = await addCategory(payload);

      console.log("Add Category API Response:", response);

      // ========================================
      // SUCCESS
      // ========================================

      if (response?.success) {
        alert(response.message || "Category created successfully!");

        navigate("/dashboard/categories");

        return;
      }

      // ========================================
      // API ERROR RESPONSE
      // ========================================

      alert(response?.message || "Failed to create category.");
    } catch (error) {
      console.error("Add Category API Error:", error);

      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong while creating the category.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-category-page container-fluid px-0">
      {/* ======================================
          HEADER
      ======================================= */}

      <div className="add-category-header">
        <button
          type="button"
          className="back-category-btn"
          onClick={() => navigate("/dashboard/categories")}
        >
          <FiArrowLeft />
        </button>

        <div>
          <h1>Add Category</h1>

          <p>Create a new service category.</p>
        </div>
      </div>

      {/* ======================================
          FORM
      ======================================= */}

      <form className="category-form-card" onSubmit={handleSubmit}>
        {/* ====================================
            CATEGORY INFORMATION
        ===================================== */}

        <div className="category-form-section">
          <h3>Category Information</h3>

          <p>Enter the basic details for the category.</p>
        </div>

        <div className="row g-4">
          {/* ==================================
              CATEGORY NAME
          =================================== */}

          <div className="col-md-6">
            <label className="category-form-label">
              Category Name
              <span>*</span>
            </label>

            <input
              type="text"
              name="categoryName"
              value={formData.categoryName}
              onChange={handleCategoryNameChange}
              className={`category-form-input ${
                errors.categoryName ? "error" : ""
              }`}
              placeholder="Enter category name"
              disabled={loading}
            />

            {errors.categoryName && (
              <small className="category-error">{errors.categoryName}</small>
            )}
          </div>

          {/* ==================================
              SLUG
          =================================== */}

          <div className="col-md-6">
            <label className="category-form-label">
              Slug
              <span>*</span>
            </label>

            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              className={`category-form-input ${errors.slug ? "error" : ""}`}
              placeholder="category-slug"
              disabled={loading}
            />

            {errors.slug && (
              <small className="category-error">{errors.slug}</small>
            )}
          </div>

          {/* ==================================
              DESCRIPTION
          =================================== */}

          <div className="col-12">
            <label className="category-form-label">Description</label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="category-form-textarea"
              rows="5"
              placeholder="Enter category description..."
              disabled={loading}
            />
          </div>

          {/* ==================================
              IMAGE
          =================================== */}

          <div className="col-md-7">
            <label className="category-form-label">
              Category Image
              <span>*</span>
            </label>

            {!imagePreview ? (
              <label className="category-upload-box">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={loading}
                />

                <FiUploadCloud />

                <strong>Click to upload image</strong>

                <span>PNG, JPG or WEBP</span>
              </label>
            ) : (
              <div className="category-image-preview">
                <img src={imagePreview} alt="Category preview" />

                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="remove-category-image"
                  disabled={loading}
                >
                  <FiX />
                </button>
              </div>
            )}

            {errors.image && (
              <small className="category-error">{errors.image}</small>
            )}
          </div>

          {/* ==================================
              STATUS
          =================================== */}

          <div className="col-md-5">
            <label className="category-form-label">Status</label>

            <div className="category-active-box">
              <div>
                <strong>Category Status</strong>

                <span>
                  {formData.isActive
                    ? "Category is active"
                    : "Category is inactive"}
                </span>
              </div>

              <label className="category-status-switch">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(event) =>
                    setFormData((previous) => ({
                      ...previous,
                      isActive: event.target.checked,
                    }))
                  }
                  disabled={loading}
                />

                <span className="category-status-slider" />
              </label>
            </div>
          </div>
        </div>

        {/* ====================================
            ACTIONS
        ===================================== */}

        <div className="category-form-actions">
          <button
            type="button"
            className="category-cancel-btn"
            onClick={() => navigate("/dashboard/categories")}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="category-save-btn"
            disabled={loading}
          >
            <FiSave />

            <span>{loading ? "Saving..." : "Save Category"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCategory;
