import React, { useState } from "react";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import RichTextEditor from "../../common/RichTextEditor";

import { addStaticPage } from "../../Services/staticPageApi";

import "./AddStaticPage.css";

const AddStaticPage = () => {
  const navigate = useNavigate();

  // ==========================================
  // STATE
  // ==========================================

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const [content, setContent] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [saving, setSaving] = useState(false);

  // ==========================================
  // AUTO GENERATE SLUG
  // ==========================================

  const generateSlug = (value) => {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const handleTitleChange = (event) => {
    const value = event.target.value;

    setTitle(value);

    // Automatically generate slug
    // until user manually edits the slug.
    if (!isSlugManuallyEdited) {
      setSlug(generateSlug(value));
    }
  };

  // ==========================================
  // SAVE PAGE
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    // ----------------------------------------
    // VALIDATION
    // ----------------------------------------

    if (!title.trim()) {
      await Swal.fire({
        icon: "warning",
        title: "Title Required",
        text: "Please enter the page title.",
      });

      return;
    }

    if (!slug.trim()) {
      await Swal.fire({
        icon: "warning",
        title: "Slug Required",
        text: "Please enter the page slug.",
      });

      return;
    }

    // ----------------------------------------
    // CONTENT VALIDATION
    // ----------------------------------------

    // TinyMCE returns HTML.
    // Remove HTML tags to check whether
    // the editor actually contains text.
    const plainText = content.replace(/<(.|\n)*?>/g, "").trim();

    if (!plainText) {
      await Swal.fire({
        icon: "warning",
        title: "Content Required",
        text: "Please add content to the page.",
      });

      return;
    }

    // ----------------------------------------
    // API
    // ----------------------------------------

    try {
      setSaving(true);

      const payload = {
        title: title.trim(),
        slug: slug.trim(),
        content,
        isActive,
      };

      console.log("Add Static Page Payload:", payload);

      const response = await addStaticPage(payload);

      console.log("Add Static Page Response:", response);

      if (!response?.success) {
        throw new Error(response?.message || "Unable to create static page.");
      }

      // --------------------------------------
      // SUCCESS
      // --------------------------------------

      await Swal.fire({
        icon: "success",
        title: "Page Created",
        text: response?.message || "Static page created successfully.",
        timer: 1600,
        showConfirmButton: false,
      });

      navigate("/dashboard/static-pages");
    } catch (error) {
      console.error("Add Static Page Error:", error);

      await Swal.fire({
        icon: "error",
        title: "Creation Failed",
        text:
          error?.response?.data?.message ||
          error?.message ||
          "Something went wrong while creating the page.",
      });
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="add-static-page">
      {/* ======================================
          PAGE HEADER
      ======================================= */}

      <div className="add-static-page-header">
        <button
          type="button"
          className="add-static-page-back-btn"
          onClick={() => navigate("/dashboard/static-pages")}
        >
          <FiArrowLeft />
        </button>

        <div>
          <h1>Create Static Page</h1>

          <p>Create and manage content pages for the QuickNest platform.</p>
        </div>
      </div>

      {/* ======================================
          FORM CARD
      ======================================= */}

      <form className="add-static-page-card" onSubmit={handleSubmit}>
        {/* ====================================
            BASIC INFORMATION
        ===================================== */}

        <div className="add-static-page-section">
          <div className="add-static-page-section-heading">
            <h3>Page Information</h3>

            <p>Enter the basic information for your static page.</p>
          </div>

          <div className="add-static-page-grid">
            {/* Page Title */}

            <div className="add-static-page-field">
              <label htmlFor="pageTitle">
                Page Title
                <span>*</span>
              </label>

              <input
                id="pageTitle"
                type="text"
                value={title}
                onChange={handleTitleChange}
                placeholder="e.g. Terms & Conditions"
              />
            </div>

            {/* Slug */}

            <div className="add-static-page-field">
              <label htmlFor="pageSlug">
                Slug
                <span>*</span>
              </label>

              <input
                id="pageSlug"
                type="text"
                value={slug}
                onChange={(event) => {
                  setIsSlugManuallyEdited(true);
                  setSlug(generateSlug(event.target.value));
                }}
                placeholder="e.g. terms-and-conditions"
              />

              <small>URL-friendly identifier for this page.</small>
            </div>
          </div>
        </div>

        {/* ====================================
            CONTENT
        ===================================== */}

        <div className="add-static-page-section">
          <div className="add-static-page-section-heading">
            <h3>Page Content</h3>

            <p>Write and format the content of your page.</p>
          </div>

          <div className="add-static-page-editor">
            <label>
              Content
              <span>*</span>
            </label>

            {/* ==================================
                GLOBAL TINYMCE EDITOR
            =================================== */}

            <RichTextEditor
              value={content}
              onChange={setContent}
              placeholder="Write your page content here..."
            />
          </div>
        </div>

        {/* ====================================
            STATUS
        ===================================== */}

        <div className="add-static-page-section">
          <div className="add-static-page-status-row">
            <div>
              <h4>Page Status</h4>

              <p>Control whether this page is visible and active.</p>
            </div>

            <div className="add-static-page-status-control">
              <label className="add-static-page-switch">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(event) => setIsActive(event.target.checked)}
                />

                <span className="add-static-page-slider" />
              </label>

              <span
                className={
                  isActive
                    ? "add-static-page-status active"
                    : "add-static-page-status inactive"
                }
              >
                {isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        </div>

        {/* ====================================
            ACTIONS
        ===================================== */}

        <div className="add-static-page-actions">
          <button
            type="button"
            className="add-static-page-cancel-btn"
            onClick={() => navigate("/dashboard/static-pages")}
            disabled={saving}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="add-static-page-save-btn"
            disabled={saving}
          >
            {saving ? (
              <>
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                />
                Creating...
              </>
            ) : (
              <>
                <FiSave />
                Create Page
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddStaticPage;
