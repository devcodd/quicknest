import React, { useState } from "react";
import { FiArrowLeft, FiUploadCloud, FiSave, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import { addBanner } from "../../Services/bannerApi";

import "./AddBanner.css";

const AddBanner = () => {
  const navigate = useNavigate();

  // ==========================================
  // FORM STATE
  // ==========================================

  const [formData, setFormData] = useState({
    title: "",
    image: null,
    isActive: true,
  });

  const [imagePreview, setImagePreview] = useState("");

  const [errors, setErrors] = useState({});

  const [loading, setLoading] = useState(false);

  // ==========================================
  // TITLE
  // ==========================================

  const handleTitleChange = (event) => {
    const { value } = event.target;

    setFormData((previous) => ({
      ...previous,
      title: value,
    }));

    setErrors((previous) => ({
      ...previous,
      title: "",
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

    if (!formData.title.trim()) {
      newErrors.title = "Banner title is required.";
    }

    if (!formData.image) {
      newErrors.image = "Banner image is required.";
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
      // FORMDATA
      // ========================================

      const payload = new FormData();

      payload.append("title", formData.title.trim());

      payload.append("image", formData.image);

      payload.append("isActive", formData.isActive);

      // ========================================
      // DEBUG
      // ========================================

      console.log("Banner FormData:");

      for (const [key, value] of payload.entries()) {
        console.log(key, value);
      }

      // ========================================
      // API
      // ========================================

      const response = await addBanner(payload);

      console.log("Add Banner API Response:", response);

      // ========================================
      // SUCCESS
      // ========================================

      if (response?.success) {
        alert(response.message || "Banner created successfully!");

        navigate("/dashboard/banners");

        return;
      }

      // ========================================
      // API ERROR
      // ========================================

      alert(response?.message || "Failed to create banner.");
    } catch (error) {
      console.error("Add Banner API Error:", error);

      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong while creating the banner.",
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="add-banner-page container-fluid px-0">
      {/* ======================================
          HEADER
      ======================================= */}

      <div className="add-banner-header">
        <button
          type="button"
          className="back-banner-btn"
          onClick={() => navigate("/dashboard/banners")}
        >
          <FiArrowLeft />
        </button>

        <div>
          <h1>Add Banner</h1>

          <p>Create a new website banner.</p>
        </div>
      </div>

      {/* ======================================
          FORM
      ======================================= */}

      <form className="banner-form-card" onSubmit={handleSubmit}>
        {/* ====================================
            INFORMATION
        ===================================== */}

        <div className="banner-form-section">
          <h3>Banner Information</h3>

          <p>Add the title, image and status for your banner.</p>
        </div>

        <div className="row g-4">
          {/* ==================================
              TITLE
          =================================== */}

          <div className="col-12">
            <label className="banner-form-label">
              Banner Title
              <span>*</span>
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleTitleChange}
              className={`banner-form-input ${errors.title ? "error" : ""}`}
              placeholder="Enter banner title"
              disabled={loading}
            />

            {errors.title && (
              <small className="banner-error">{errors.title}</small>
            )}
          </div>

          {/* ==================================
              IMAGE
          =================================== */}

          <div className="col-12">
            <label className="banner-form-label">
              Banner Image
              <span>*</span>
            </label>

            {!imagePreview ? (
              <label className="banner-upload-box">
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleImageChange}
                  disabled={loading}
                />

                <FiUploadCloud />

                <strong>Click to upload banner</strong>

                <span>PNG, JPG or WEBP</span>
              </label>
            ) : (
              <div className="banner-image-preview">
                <img src={imagePreview} alt="Banner preview" />

                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="remove-banner-image"
                  disabled={loading}
                >
                  <FiX />
                </button>
              </div>
            )}

            {errors.image && (
              <small className="banner-error">{errors.image}</small>
            )}
          </div>

          {/* ==================================
              STATUS
          =================================== */}

          <div className="col-12">
            <label className="banner-form-label">Status</label>

            <div className="banner-active-box">
              <div>
                <strong>Banner Status</strong>

                <span>
                  {formData.isActive
                    ? "Banner is active"
                    : "Banner is inactive"}
                </span>
              </div>

              <label className="banner-status-switch">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={handleStatusChange}
                  disabled={loading}
                />

                <span className="banner-status-slider" />
              </label>
            </div>
          </div>
        </div>

        {/* ====================================
            ACTIONS
        ===================================== */}

        <div className="banner-form-actions">
          <button
            type="button"
            className="banner-cancel-btn"
            onClick={() => navigate("/dashboard/banners")}
            disabled={loading}
          >
            Cancel
          </button>

          <button type="submit" className="banner-save-btn" disabled={loading}>
            <FiSave />

            <span>{loading ? "Saving..." : "Save Banner"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBanner;
