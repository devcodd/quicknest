import React, { useState } from "react";
import { FiArrowLeft, FiSave, FiGlobe } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import { addLanguage } from "../../Services/langaugeApi";

import "./AddLanguage.css";

const AddLanguage = () => {
  const navigate = useNavigate();

  // ==========================================
  // FORM STATE
  // ==========================================

  const [formData, setFormData] = useState({
    languageName: "",
    code: "",
    isActive: true,
  });

  const [errors, setErrors] = useState({});

  const [saving, setSaving] = useState(false);

  // ==========================================
  // INPUT CHANGE
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
  // CODE CHANGE
  // ==========================================

  const handleCodeChange = (event) => {
    const value = event.target.value
      .toLowerCase()
      .replace(/[^a-z]/g, "")
      .slice(0, 5);

    setFormData((previous) => ({
      ...previous,
      code: value,
    }));

    setErrors((previous) => ({
      ...previous,
      code: "",
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

    if (!formData.languageName.trim()) {
      newErrors.languageName = "Language name is required.";
    }

    if (!formData.code.trim()) {
      newErrors.code = "Language code is required.";
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
      title: "Add Language?",
      text: `Are you sure you want to add "${formData.languageName}"?`,
      showCancelButton: true,
      confirmButtonText: "Yes, Add",
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
        languageName: formData.languageName.trim(),
        code: formData.code.trim(),
        isActive: formData.isActive,
      };

      console.log("Add Language Payload:", payload);

      // ========================================
      // API
      // ========================================

      const response = await addLanguage(payload);

      console.log("Add Language API Response:", response);

      // ========================================
      // SUCCESS
      // ========================================

      if (response?.success) {
        await Swal.fire({
          icon: "success",
          title: "Language Added!",
          text: response.message || "Language has been added successfully.",
          timer: 1500,
          showConfirmButton: false,
        });

        navigate("/dashboard/language");

        return;
      }

      // ========================================
      // API ERROR
      // ========================================

      await Swal.fire({
        icon: "error",
        title: "Failed to Add Language",
        text: response?.message || "Unable to add language.",
      });
    } catch (error) {
      console.error("Add Language Error:", error);

      await Swal.fire({
        icon: "error",
        title: "Something went wrong",
        text:
          error?.response?.data?.message ||
          error?.message ||
          "Unable to add language.",
      });
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="add-language-page container-fluid px-0">
      {/* ======================================
          HEADER
      ======================================= */}

      <div className="add-language-header">
        <button
          type="button"
          className="back-language-btn"
          onClick={() => navigate("/dashboard/language")}
          disabled={saving}
        >
          <FiArrowLeft />
        </button>

        <div>
          <h1>Add Language</h1>

          <p>Add a new language to the application.</p>
        </div>
      </div>

      {/* ======================================
          FORM
      ======================================= */}

      <form className="language-form-card" onSubmit={handleSubmit}>
        {/* ====================================
            LANGUAGE INFORMATION
        ===================================== */}

        <div className="language-form-section">
          <h3>Language Information</h3>

          <p>Enter the basic details for the new language.</p>
        </div>

        <div className="row g-4">
          {/* ==================================
              LANGUAGE NAME
          =================================== */}

          <div className="col-md-6">
            <label className="language-form-label">
              Language Name
              <span>*</span>
            </label>

            <input
              type="text"
              name="languageName"
              value={formData.languageName}
              onChange={handleChange}
              className={`language-form-input ${
                errors.languageName ? "error" : ""
              }`}
              placeholder="Enter language name"
              disabled={saving}
            />

            {errors.languageName && (
              <small className="language-error">{errors.languageName}</small>
            )}
          </div>

          {/* ==================================
              LANGUAGE CODE
          =================================== */}

          <div className="col-md-6">
            <label className="language-form-label">
              Language Code
              <span>*</span>
            </label>

            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleCodeChange}
              className={`language-form-input ${errors.code ? "error" : ""}`}
              placeholder="e.g. hi, en, fr"
              disabled={saving}
            />

            <small className="language-input-hint">
              Use a short language code such as
              <strong> hi </strong> for Hindi.
            </small>

            {errors.code && (
              <small className="language-error">{errors.code}</small>
            )}
          </div>

          {/* ==================================
              LANGUAGE PREVIEW
          =================================== */}

          <div className="col-12">
            <div className="language-preview-box">
              <div className="language-preview-icon">
                <FiGlobe />
              </div>

              <div className="language-preview-content">
                <span>Language Preview</span>

                <strong>{formData.languageName || "Language Name"}</strong>

                <small>
                  {formData.code ? `Code: ${formData.code}` : "Code: --"}
                </small>
              </div>
            </div>
          </div>

          {/* ==================================
              STATUS
          =================================== */}

          <div className="col-12">
            <label className="language-form-label">Status</label>

            <div className="language-active-box">
              <div>
                <strong>Language Status</strong>

                <span>
                  {formData.isActive
                    ? "Language is active"
                    : "Language is inactive"}
                </span>
              </div>

              <label className="language-status-switch">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={handleStatusChange}
                  disabled={saving}
                />

                <span className="language-status-slider" />
              </label>
            </div>
          </div>
        </div>

        {/* ====================================
            ACTIONS
        ===================================== */}

        <div className="language-form-actions">
          <button
            type="button"
            className="language-cancel-btn"
            onClick={() => navigate("/dashboard/language")}
            disabled={saving}
          >
            Cancel
          </button>

          <button type="submit" className="language-save-btn" disabled={saving}>
            <FiSave />

            <span>{saving ? "Saving..." : "Save Language"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddLanguage;
