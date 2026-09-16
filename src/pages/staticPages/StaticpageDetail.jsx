import React, { useEffect, useState } from "react";

import { FiArrowLeft, FiEdit2, FiFileText } from "react-icons/fi";

import { useNavigate, useParams } from "react-router-dom";

import Swal from "sweetalert2";

import { getStaticPageBySlug } from "../../Services/staticPageApi";

import "./StaticpageDetail.css";

const StaticPageDetail = () => {
  const navigate = useNavigate();

  const { slug } = useParams();

  // ==========================================
  // STATE
  // ==========================================

  const [page, setPage] = useState(null);

  const [loading, setLoading] = useState(true);

  // ==========================================
  // GET PAGE BY SLUG
  // ==========================================

  const loadPage = async () => {
    if (!slug) {
      await Swal.fire({
        icon: "error",
        title: "Invalid Page",
        text: "Page slug is missing.",
      });

      navigate("/dashboard/static-pages", {
        replace: true,
      });

      return;
    }

    try {
      setLoading(true);

      const response = await getStaticPageBySlug(slug);

      console.log("Static Page Detail Response:", response);

      if (!response?.success) {
        throw new Error(response?.message || "Unable to load static page.");
      }

      if (!response?.data) {
        throw new Error("Static page data was not found.");
      }

      setPage(response.data);
    } catch (error) {
      console.error("Static Page Detail Error:", error);

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
  }, [slug]);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="static-page-detail">
        <div className="static-page-detail-header">
          <button
            type="button"
            className="static-page-detail-back-btn"
            onClick={() => navigate("/dashboard/static-pages")}
          >
            <FiArrowLeft />
          </button>

          <div>
            <h1>Static Page</h1>

            <p>View page details and content.</p>
          </div>
        </div>

        <div className="static-page-detail-loading">
          <div className="spinner-border text-primary" role="status" />

          <h5>Loading page...</h5>

          <p>Please wait while we load the page content.</p>
        </div>
      </div>
    );
  }

  // ==========================================
  // PAGE NOT FOUND
  // ==========================================

  if (!page) {
    return null;
  }

  // ==========================================
  // PAGE ID
  // ==========================================

  const pageId = page?.pageId || page?._id || page?.id;

  // ==========================================
  // MAIN UI
  // ==========================================

  return (
    <div className="static-page-detail">
      {/* ======================================
          HEADER
      ======================================= */}

      <div className="static-page-detail-header">
        <button
          type="button"
          className="static-page-detail-back-btn"
          onClick={() => navigate("/dashboard/static-pages")}
        >
          <FiArrowLeft />
        </button>

        <div className="static-page-detail-heading">
          <div className="static-page-detail-icon">
            <FiFileText />
          </div>

          <div>
            <h1>{page?.title || "Untitled Page"}</h1>

            <p>View complete page content and information.</p>
          </div>
        </div>

        <button
          type="button"
          className="static-page-detail-edit-btn"
          onClick={() => navigate(`/dashboard/static-pages/edit/${pageId}`)}
        >
          <FiEdit2 />
          Edit Page
        </button>
      </div>

      {/* ======================================
          PAGE INFORMATION
      ======================================= */}

      <div className="static-page-detail-card">
        <div className="static-page-detail-meta">
          {/* TITLE */}

          <div className="static-page-detail-meta-item">
            <span>Page Title</span>

            <strong>{page?.title || "-"}</strong>
          </div>

          {/* SLUG */}

          <div className="static-page-detail-meta-item">
            <span>Slug</span>

            <code>/{page?.slug || "-"}</code>
          </div>

          {/* STATUS */}

          <div className="static-page-detail-meta-item">
            <span>Status</span>

            <span
              className={
                page?.isActive
                  ? "static-page-detail-status active"
                  : "static-page-detail-status inactive"
              }
            >
              <span className="static-page-detail-status-dot" />

              {page?.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>

        {/* ====================================
            CONTENT
        ===================================== */}

        <div className="static-page-detail-content-section">
          <div className="static-page-detail-content-heading">
            <h3>Page Content</h3>
          </div>

          <div
            className="static-page-detail-content"
            dangerouslySetInnerHTML={{
              __html: page?.content || "",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default StaticPageDetail;
