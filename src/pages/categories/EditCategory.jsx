import React, { useEffect, useState } from "react";
import { FiArrowLeft, FiUploadCloud, FiSave, FiX } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

import { getCategories, updateCategory } from "../../Services/categoryApi";

import "./EditCategory.css";

const EditCategory = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // ==========================================
  // STATES
  // ==========================================

  const [formData, setFormData] = useState({
    categoryName: "",
    slug: "",
    image: null,
    isActive: true,
    description: "",
  });

  const [currentImage, setCurrentImage] = useState("");

  const [imagePreview, setImagePreview] = useState("");

  const [errors, setErrors] = useState({});

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  // ==========================================
  // GET CATEGORY
  // ==========================================

  const fetchCategory = async () => {
    try {
      setLoading(true);

      const response = await getCategories();

      console.log("Categories API Response:", response);

      if (!response?.success) {
        await Swal.fire({
          icon: "error",
          title: "Failed to load category",
          text: response?.message || "Unable to fetch category details.",
        });

        navigate("/dashboard/categories");

        return;
      }

      const category = response.data?.find(
        (item) => String(item.categoryId) === String(id),
      );

      if (!category) {
        await Swal.fire({
          icon: "warning",
          title: "Category Not Found",
          text: "The requested category could not be found.",
        });

        navigate("/dashboard/categories");

        return;
      }

      // ========================================
      // SET FORM DATA
      // ========================================

      setFormData({
        categoryName: category.categoryName || "",

        slug: category.slug || "",

        image: null,

        isActive: category.isActive ?? true,

        description: category.description || "",
      });

      setCurrentImage(category.image || "");

      setImagePreview(category.image || "");
    } catch (error) {
      console.error("Get Category Error:", error);

      await Swal.fire({
        icon: "error",
        title: "Something went wrong",
        text:
          error?.response?.data?.message ||
          error?.message ||
          "Unable to load category.",
      });

      navigate("/dashboard/categories");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    fetchCategory();
  }, [id]);

  // ==========================================
  // CATEGORY NAME
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
  // NORMAL INPUT
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
  // REMOVE / RESET IMAGE
  // ==========================================

  const handleRemoveImage = () => {
    setFormData((previous) => ({
      ...previous,
      image: null,
    }));

    setImagePreview(currentImage);
  };

  // ==========================================
  // STATUS
  // ==========================================

  const handleStatusChange = (event) => {
    setFormData((previous) => ({
      ...previous,
      isActive: event.target.checked,
    }));
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

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // ==========================================
  // SUBMIT UPDATE
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    // ========================================
    // CONFIRM UPDATE
    // ========================================

    const confirmation = await Swal.fire({
      icon: "question",
      title: "Update Category?",
      text: `Are you sure you want to update "${formData.categoryName}"?`,
      showCancelButton: true,
      confirmButtonText: "Yes, Update",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (!confirmation.isConfirmed) {
      return;
    }

    try {
      setSaving(true);

      // ========================================
      // CREATE FORMDATA
      // ========================================

      const payload = new FormData();

      payload.append("categoryName", formData.categoryName.trim());

      payload.append("slug", formData.slug.trim());

      payload.append("isActive", formData.isActive);

      payload.append("description", formData.description);

      // Only send image if user selected
      // a new image.

      if (formData.image) {
        payload.append("image", formData.image);
      }

      // ========================================
      // DEBUG
      // ========================================

      console.log("Update Category FormData:");

      for (const [key, value] of payload.entries()) {
        console.log(key, value);
      }

      // ========================================
      // UPDATE API
      // ========================================

      const response = await updateCategory(id, payload);

      console.log("Update Category API Response:", response);

      // ========================================
      // SUCCESS
      // ========================================

      if (response?.success) {
        await Swal.fire({
          icon: "success",
          title: "Category Updated!",
          text: response.message || "Category has been updated successfully.",
          confirmButtonText: "OK",
        });

        navigate("/dashboard/categories");

        return;
      }

      // ========================================
      // API ERROR
      // ========================================

      await Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: response?.message || "Failed to update category.",
      });
    } catch (error) {
      console.error("Update Category Error:", error);

      await Swal.fire({
        icon: "error",
        title: "Something went wrong",
        text:
          error?.response?.data?.message ||
          error?.message ||
          "Unable to update category.",
      });
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // LOADING SCREEN
  // ==========================================

  if (loading) {
    return (
      <div className="edit-category-loading">
        <div className="spinner-border text-primary"></div>

        <p>Loading category...</p>
      </div>
    );
  }

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="edit-category-page container-fluid px-0">
      {/* ======================================
          HEADER
      ======================================= */}

      <div className="edit-category-header">
        <button
          type="button"
          className="back-category-btn"
          onClick={() => navigate("/dashboard/categories")}
        >
          <FiArrowLeft />
        </button>

        <div>
          <h1>Edit Category</h1>

          <p>Update the service category details.</p>
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

          <p>Update the details for this category.</p>
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
              disabled={saving}
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
              disabled={saving}
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
              disabled={saving}
            />
          </div>

          {/* ==================================
              IMAGE
          =================================== */}

          <div className="col-md-7">
            <label className="category-form-label">Category Image</label>

            {!imagePreview ? (
              <label className="category-upload-box">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={saving}
                />

                <FiUploadCloud />

                <strong>Click to upload image</strong>

                <span>PNG, JPG or WEBP</span>
              </label>
            ) : (
              <div className="category-image-preview">
                <img src={imagePreview} alt={formData.categoryName} />

                {formData.image && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="remove-category-image"
                    disabled={saving}
                  >
                    <FiX />
                  </button>
                )}
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
                  onChange={handleStatusChange}
                  disabled={saving}
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
            disabled={saving}
          >
            Cancel
          </button>

          <button type="submit" className="category-save-btn" disabled={saving}>
            <FiSave />

            <span>{saving ? "Updating..." : "Update Category"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCategory;
