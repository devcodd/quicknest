import React, { useEffect, useState } from "react";
import { FiArrowLeft, FiSave, FiChevronDown } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import { getCategories } from "../../Services/categoryApi";
import { addSubCategory } from "../../Services/subcategoryApi";

import "./AddSubcategory.css";

const AddSubcategory = () => {
  const navigate = useNavigate();

  // ==========================================
  // STATES
  // ==========================================

  const [categories, setCategories] = useState([]);

  const [loadingCategories, setLoadingCategories] = useState(true);

  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    categoryId: "",
    subCategoryName: "",
    slug: "",
    isActive: true,
  });

  const [errors, setErrors] = useState({});

  // ==========================================
  // GET CATEGORIES
  // ==========================================

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);

      const response = await getCategories();

      console.log("Categories Response:", response);

      if (response?.success) {
        setCategories(response.data || []);
      } else {
        setCategories([]);

        await Swal.fire({
          icon: "error",
          title: "Failed to Load Categories",
          text: response?.message || "Unable to load categories.",
        });
      }
    } catch (error) {
      console.error("Get Categories Error:", error);

      setCategories([]);

      await Swal.fire({
        icon: "error",
        title: "Something Went Wrong",
        text:
          error?.response?.data?.message ||
          error?.message ||
          "Unable to load categories.",
      });
    } finally {
      setLoadingCategories(false);
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    fetchCategories();
  }, []);

  // ==========================================
  // CATEGORY CHANGE
  // ==========================================

  const handleCategoryChange = (event) => {
    const { value } = event.target;

    setFormData((previous) => ({
      ...previous,
      categoryId: value,
    }));

    setErrors((previous) => ({
      ...previous,
      categoryId: "",
    }));
  };

  // ==========================================
  // SUBCATEGORY NAME
  // ==========================================

  const handleSubCategoryNameChange = (event) => {
    const value = event.target.value;

    const generatedSlug = value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    setFormData((previous) => ({
      ...previous,
      subCategoryName: value,
      slug: generatedSlug,
    }));

    setErrors((previous) => ({
      ...previous,
      subCategoryName: "",
    }));
  };

  // ==========================================
  // SLUG
  // ==========================================

  const handleSlugChange = (event) => {
    const value = event.target.value
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    setFormData((previous) => ({
      ...previous,
      slug: value,
    }));

    setErrors((previous) => ({
      ...previous,
      slug: "",
    }));
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

    if (!formData.categoryId) {
      newErrors.categoryId = "Please select a category.";
    }

    if (!formData.subCategoryName.trim()) {
      newErrors.subCategoryName = "Subcategory name is required.";
    }

    if (!formData.slug.trim()) {
      newErrors.slug = "Slug is required.";
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

    // ========================================
    // CONFIRM
    // ========================================

    const confirmation = await Swal.fire({
      icon: "question",

      title: "Create Subcategory?",

      text: `Are you sure you want to create "${formData.subCategoryName}"?`,

      showCancelButton: true,

      confirmButtonText: "Yes, Create",

      cancelButtonText: "Cancel",

      reverseButtons: true,
    });

    if (!confirmation.isConfirmed) {
      return;
    }

    try {
      setSaving(true);

      // ========================================
      // PAYLOAD
      // ========================================

      const payload = {
        categoryId: Number(formData.categoryId),

        subCategoryName: formData.subCategoryName.trim(),

        slug: formData.slug.trim(),

        isActive: formData.isActive,
      };

      console.log("Add Subcategory Payload:", payload);

      // ========================================
      // API
      // ========================================

      const response = await addSubCategory(payload);

      console.log("Add Subcategory Response:", response);

      // ========================================
      // SUCCESS
      // ========================================

      if (response?.success) {
        await Swal.fire({
          icon: "success",

          title: "Subcategory Created!",

          text: response.message || "Subcategory created successfully.",

          timer: 1500,

          showConfirmButton: false,
        });

        navigate("/dashboard/subcategories");

        return;
      }

      // ========================================
      // API ERROR
      // ========================================

      await Swal.fire({
        icon: "error",

        title: "Creation Failed",

        text: response?.message || "Unable to create subcategory.",
      });
    } catch (error) {
      console.error("Add Subcategory Error:", error);

      await Swal.fire({
        icon: "error",

        title: "Something Went Wrong",

        text:
          error?.response?.data?.message ||
          error?.message ||
          "Unable to create subcategory.",
      });
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="add-subcategory-page container-fluid px-0">
      {/* ======================================
          HEADER
      ======================================= */}

      <div className="add-subcategory-header">
        <button
          type="button"
          className="back-subcategory-btn"
          onClick={() => navigate("/dashboard/subcategories")}
          disabled={saving}
        >
          <FiArrowLeft />
        </button>

        <div>
          <h1>Add Subcategory</h1>

          <p>Create a new service subcategory.</p>
        </div>
      </div>

      {/* ======================================
          FORM
      ======================================= */}

      <form className="subcategory-form-card" onSubmit={handleSubmit}>
        {/* ====================================
            INFORMATION
        ===================================== */}

        <div className="subcategory-form-section">
          <h3>Subcategory Information</h3>

          <p>Enter the basic details for the subcategory.</p>
        </div>

        <div className="row g-4">
          {/* ==================================
              CATEGORY
          =================================== */}

          <div className="col-md-6">
            <label className="subcategory-form-label">
              Category
              <span>*</span>
            </label>

            <div className="subcategory-form-select-wrapper">
              <select
                value={formData.categoryId}
                onChange={handleCategoryChange}
                disabled={loadingCategories || saving}
                className={errors.categoryId ? "error" : ""}
              >
                <option value="">
                  {loadingCategories
                    ? "Loading categories..."
                    : "Select Category"}
                </option>

                {categories.map((category) => (
                  <option key={category.categoryId} value={category.categoryId}>
                    {category.categoryName}
                  </option>
                ))}
              </select>

              <FiChevronDown />
            </div>

            {errors.categoryId && (
              <small className="subcategory-error">{errors.categoryId}</small>
            )}
          </div>

          {/* ==================================
              SUBCATEGORY NAME
          =================================== */}

          <div className="col-md-6">
            <label className="subcategory-form-label">
              Subcategory Name
              <span>*</span>
            </label>

            <input
              type="text"
              value={formData.subCategoryName}
              onChange={handleSubCategoryNameChange}
              className={`subcategory-form-input ${
                errors.subCategoryName ? "error" : ""
              }`}
              placeholder="Enter subcategory name"
              disabled={saving}
            />

            {errors.subCategoryName && (
              <small className="subcategory-error">
                {errors.subCategoryName}
              </small>
            )}
          </div>

          {/* ==================================
              SLUG
          =================================== */}

          <div className="col-md-6">
            <label className="subcategory-form-label">
              Slug
              <span>*</span>
            </label>

            <input
              type="text"
              value={formData.slug}
              onChange={handleSlugChange}
              className={`subcategory-form-input ${errors.slug ? "error" : ""}`}
              placeholder="subcategory-slug"
              disabled={saving}
            />

            {errors.slug && (
              <small className="subcategory-error">{errors.slug}</small>
            )}
          </div>

          {/* ==================================
              STATUS
          =================================== */}

          <div className="col-md-6">
            <label className="subcategory-form-label">Status</label>

            <div className="subcategory-active-box">
              <div>
                <strong>Subcategory Status</strong>

                <span>
                  {formData.isActive
                    ? "Subcategory is active"
                    : "Subcategory is inactive"}
                </span>
              </div>

              <label className="subcategory-status-switch">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={handleStatusChange}
                  disabled={saving}
                />

                <span className="subcategory-status-slider" />
              </label>
            </div>
          </div>
        </div>

        {/* ====================================
            ACTIONS
        ===================================== */}

        <div className="subcategory-form-actions">
          <button
            type="button"
            className="subcategory-cancel-btn"
            onClick={() => navigate("/dashboard/subcategories")}
            disabled={saving}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="subcategory-save-btn"
            disabled={saving || loadingCategories}
          >
            <FiSave />

            <span>{saving ? "Creating..." : "Save Subcategory"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddSubcategory;
