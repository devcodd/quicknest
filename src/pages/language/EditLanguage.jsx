import React, { useEffect, useState } from "react";
import { FiArrowLeft, FiSave, FiGlobe } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

import { getLanguages, updateLanguage } from "../../Services/langaugeApi";

import "./EditLanguage.css";

const EditLanguage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // ==========================================
  // STATES
  // ==========================================

  const [formData, setFormData] = useState({
    languageName: "",
    code: "",
    isActive: true,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  // ==========================================
  // GET LANGUAGE
  // ==========================================

  const fetchLanguage = async () => {
    try {
      setLoading(true);

      const response = await getLanguages();

      console.log("Languages API Response:", response);

      if (!response?.success) {
        await Swal.fire({
          icon: "error",
          title: "Failed to Load Language",
          text: response?.message || "Unable to fetch language details.",
        });

        navigate("/dashboard/language");

        return;
      }

      const language = response.data?.find(
        (item) => String(item.languageId) === String(id),
      );

      if (!language) {
        await Swal.fire({
          icon: "warning",
          title: "Language Not Found",
          text: "The requested language could not be found.",
        });

        navigate("/dashboard/language");

        return;
      }

      setFormData({
        languageName: language.languageName || "",

        code: language.code || "",

        isActive: language.isActive ?? true,
      });
    } catch (error) {
      console.error("Get Language Error:", error);

      await Swal.fire({
        icon: "error",
        title: "Something Went Wrong",
        text:
          error?.response?.data?.message ||
          error?.message ||
          "Unable to load language.",
      });

      navigate("/dashboard/language");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    fetchLanguage();
  }, [id]);

  // ==========================================
  // LANGUAGE NAME
  // ==========================================

  const handleLanguageNameChange = (event) => {
    const { value } = event.target;

    setFormData((previous) => ({
      ...previous,
      languageName: value,
    }));

    setErrors((previous) => ({
      ...previous,
      languageName: "",
    }));
  };

  // ==========================================
  // CODE
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
    // CONFIRM UPDATE
    // ========================================

    const confirmation = await Swal.fire({
      icon: "question",
      title: "Update Language?",
      text: `Are you sure you want to update "${formData.languageName}"?`,
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
      // PAYLOAD
      // ========================================

      const payload = {
        languageName: formData.languageName.trim(),

        code: formData.code.trim(),

        isActive: formData.isActive,
      };

      console.log("Update Language Payload:", payload);

      // ========================================
      // UPDATE API
      // ========================================

      const response = await updateLanguage(id, payload);

      console.log("Update Language API Response:", response);

      // ========================================
      // SUCCESS
      // ========================================

      if (response?.success) {
        await Swal.fire({
          icon: "success",
          title: "Language Updated!",
          text: response.message || "Language has been updated successfully.",
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
        title: "Update Failed",
        text: response?.message || "Unable to update language.",
      });
    } catch (error) {
      console.error("Update Language Error:", error);

      await Swal.fire({
        icon: "error",
        title: "Something Went Wrong",
        text:
          error?.response?.data?.message ||
          error?.message ||
          "Unable to update language.",
      });
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="edit-language-loading">
        <div className="spinner-border text-primary"></div>

        <p>Loading language...</p>
      </div>
    );
  }

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="edit-language-page container-fluid px-0">
      {/* ======================================
          HEADER
      ======================================= */}

      <div className="edit-language-header">
        <button
          type="button"
          className="back-language-btn"
          onClick={() => navigate("/dashboard/language")}
          disabled={saving}
        >
          <FiArrowLeft />
        </button>

        <div>
          <h1>Edit Language</h1>

          <p>Update the language details.</p>
        </div>
      </div>

      {/* ======================================
          FORM
      ======================================= */}

      <form className="language-form-card" onSubmit={handleSubmit}>
        {/* ====================================
            INFORMATION
        ===================================== */}

        <div className="language-form-section">
          <h3>Language Information</h3>

          <p>Update the details for this language.</p>
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
              onChange={handleLanguageNameChange}
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
              CODE
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
              PREVIEW
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

            <span>{saving ? "Updating..." : "Update Language"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditLanguage;
