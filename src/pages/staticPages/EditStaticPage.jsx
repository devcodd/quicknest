import React, { useEffect, useState } from "react";

import { FiArrowLeft, FiSave } from "react-icons/fi";

import { useNavigate, useParams } from "react-router-dom";

import Swal from "sweetalert2";

import RichTextEditor from "../../common/RichTextEditor";

import {
  getStaticPageById,
  updateStaticPage,
} from "../../Services/staticPageApi";

import "./AddStaticPage.css";

const EditStaticPage = () => {
  const navigate = useNavigate();

  const { pageId } = useParams();

  // ==========================================
  // STATE
  // ==========================================

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ==========================================
  // GENERATE SLUG
  // ==========================================

  const generateSlug = (value) => {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  // ==========================================
  // TITLE CHANGE
  // ==========================================

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  // ==========================================
  // GET STATIC PAGE
  // ==========================================

  const loadPage = async () => {
    if (!pageId) {
      await Swal.fire({
        icon: "error",
        title: "Invalid Page",
        text: "Static page ID is missing.",
      });

      navigate("/dashboard/static-pages", {
        replace: true,
      });

      return;
    }

    try {
      setLoading(true);

      const response = await getStaticPageById(pageId);

      console.log("Static Page Details Response:", response);

      if (!response?.success) {
        throw new Error(response?.message || "Unable to load static page.");
      }

      const page = response?.data;

      if (!page) {
        throw new Error("Static page data was not found.");
      }

      // ======================================
      // SET FORM DATA
      // ======================================

      setTitle(page?.title || "");

      setSlug(page?.slug || "");

      setContent(page?.content || "");

      setIsActive(typeof page?.isActive === "boolean" ? page.isActive : true);
    } catch (error) {
      console.error("Get Static Page Error:", error);

      await Swal.fire({
        icon: "error",
        title: "Unable to Load Page",
        text:
          error?.response?.data?.message ||
          error?.message ||
          "Something went wrong while loading the page.",
      });

      navigate("/dashboard/static-pages", {
        replace: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    loadPage();
  }, [pageId]);

  // ==========================================
  // UPDATE PAGE
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
    // UPDATE
    // ----------------------------------------

    try {
      setSaving(true);

      const payload = {
        title: title.trim(),
        slug: slug.trim(),
        content,
        isActive,
      };

      console.log("Update Static Page Payload:", payload);

      const response = await updateStaticPage(pageId, payload);

      console.log("Update Static Page Response:", response);

      if (!response?.success) {
        throw new Error(response?.message || "Unable to update static page.");
      }

      // --------------------------------------
      // SUCCESS
      // --------------------------------------

      await Swal.fire({
        icon: "success",
        title: "Page Updated",
        text: response?.message || "Static page updated successfully.",
        timer: 1600,
        showConfirmButton: false,
      });

      navigate("/dashboard/static-pages");
    } catch (error) {
      console.error("Update Static Page Error:", error);

      await Swal.fire({
        icon: "error",
        title: "Update Failed",
        text:
          error?.response?.data?.message ||
          error?.message ||
          "Something went wrong while updating the page.",
      });
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // LOADING STATE
  // ==========================================

  if (loading) {
    return (
      <div className="add-static-page">
        <div className="add-static-page-header">
          <button
            type="button"
            className="add-static-page-back-btn"
            onClick={() => navigate("/dashboard/static-pages")}
          >
            <FiArrowLeft />
          </button>

          <div>
            <h1>Edit Static Page</h1>

            <p>Update the content and settings of this static page.</p>
          </div>
        </div>

        <div className="static-page-loading">
          <div className="spinner-border text-primary" role="status" />

          <h5>Loading page...</h5>

          <p>Please wait while we load the page details.</p>
        </div>
      </div>
    );
  }

  // ==========================================
  // MAIN UI
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
          <h1>Edit Static Page</h1>

          <p>Update the content and settings of this static page.</p>
        </div>
      </div>

      {/* ======================================
          FORM
      ======================================= */}

      <form className="add-static-page-card" onSubmit={handleSubmit}>
        {/* ====================================
            PAGE INFORMATION
        ===================================== */}

        <div className="add-static-page-section">
          <div className="add-static-page-section-heading">
            <h3>Page Information</h3>

            <p>Update the basic information for your static page.</p>
          </div>

          <div className="add-static-page-grid">
            {/* TITLE */}

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

            {/* SLUG */}

            <div className="add-static-page-field">
              <label htmlFor="pageSlug">
                Slug
                <span>*</span>
              </label>

              <input
                id="pageSlug"
                type="text"
                value={slug}
                onChange={(event) => setSlug(generateSlug(event.target.value))}
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

            <p>Update and format the content of your page.</p>
          </div>

          <div className="add-static-page-editor">
            <label>
              Content
              <span>*</span>
            </label>

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
                Updating...
              </>
            ) : (
              <>
                <FiSave />
                Update Page
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditStaticPage;
