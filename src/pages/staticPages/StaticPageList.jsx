import React, { useEffect, useState } from "react";

import { FiEdit2, FiEye, FiFileText, FiPlus, FiTrash2 } from "react-icons/fi";

import { useNavigate } from "react-router-dom";

import Swal from "sweetalert2";

import { deleteStaticPage, getStaticPages } from "../../Services/staticPageApi";

import "./StaticPageList.css";

const StaticPageList = () => {
  const navigate = useNavigate();

  // ==========================================
  // STATE
  // ==========================================

  const [pages, setPages] = useState([]);

  const [loading, setLoading] = useState(true);

  const [deletingId, setDeletingId] = useState(null);

  // ==========================================
  // GET ALL STATIC PAGES
  // ==========================================

  const loadPages = async () => {
    try {
      setLoading(true);

      const response = await getStaticPages();

      console.log("Static Pages Response:", response);

      if (!response?.success) {
        throw new Error(response?.message || "Unable to load static pages.");
      }

      setPages(Array.isArray(response?.data) ? response.data : []);
    } catch (error) {
      console.error("Static Pages Load Error:", error);

      await Swal.fire({
        icon: "error",
        title: "Unable to Load Pages",
        text:
          error?.response?.data?.message ||
          error?.message ||
          "Something went wrong while loading static pages.",
      });
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    loadPages();
  }, []);

  // ==========================================
  // DELETE PAGE
  // ==========================================

  const handleDelete = async (page) => {
    const pageId = page?.pageId || page?._id || page?.id;

    if (!pageId) {
      await Swal.fire({
        icon: "error",
        title: "Invalid Page",
        text: "Page ID is missing.",
      });

      return;
    }

    const result = await Swal.fire({
      icon: "warning",
      title: "Delete Page?",
      text: `Are you sure you want to delete "${page?.title || "this page"}"?`,
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      confirmButtonColor: "#dc2626",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      setDeletingId(pageId);

      const response = await deleteStaticPage(pageId);

      console.log("Delete Static Page Response:", response);

      if (!response?.success) {
        throw new Error(response?.message || "Unable to delete page.");
      }

      // ----------------------------------------
      // REMOVE DELETED PAGE FROM UI
      // ----------------------------------------

      setPages((previousPages) =>
        previousPages.filter((item) => {
          const itemId = item?.pageId || item?._id || item?.id;

          return itemId !== pageId;
        }),
      );

      await Swal.fire({
        icon: "success",
        title: "Page Deleted",
        text: response?.message || "Static page deleted successfully.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Delete Static Page Error:", error);

      await Swal.fire({
        icon: "error",
        title: "Delete Failed",
        text:
          error?.response?.data?.message ||
          error?.message ||
          "Something went wrong while deleting the page.",
      });
    } finally {
      setDeletingId(null);
    }
  };

  // ==========================================
  // STATUS CLASS
  // ==========================================

  const getStatusClass = (isActive) => {
    return isActive
      ? "static-page-status active"
      : "static-page-status inactive";
  };

  // ==========================================
  // LOADING STATE
  // ==========================================

  if (loading) {
    return (
      <div className="static-page-list">
        <div className="static-page-list-header">
          <div>
            <h1>Static Pages</h1>

            <p>
              Manage Terms, Privacy Policy, Cookies and other platform pages.
            </p>
          </div>
        </div>

        <div className="static-page-loading">
          <div className="spinner-border text-primary" role="status" />

          <h5>Loading pages...</h5>

          <p>Please wait while we load the static pages.</p>
        </div>
      </div>
    );
  }

  // ==========================================
  // MAIN UI
  // ==========================================

  return (
    <div className="static-page-list">
      {/* ======================================
          PAGE HEADER
      ======================================= */}

      <div className="static-page-list-header">
        <div>
          <h1>Static Pages</h1>

          <p>Manage Terms, Privacy Policy, Cookies and other platform pages.</p>
        </div>

        {/* ADD PAGE */}

        <button
          type="button"
          className="static-page-add-btn"
          onClick={() => navigate("/dashboard/static-pages/add")}
        >
          <FiPlus />
          Add Page
        </button>
      </div>

      {/* ======================================
          CONTENT CARD
      ======================================= */}

      <div className="static-page-table-card">
        {/* CARD HEADER */}

        <div className="static-page-table-header">
          <div className="static-page-table-title">
            <div className="static-page-table-icon">
              <FiFileText />
            </div>

            <div>
              <h3>All Pages</h3>

              <p>
                {pages.length} {pages.length === 1 ? "page" : "pages"} available
              </p>
            </div>
          </div>
        </div>

        {/* ====================================
            EMPTY STATE
        ===================================== */}

        {pages.length === 0 ? (
          <div className="static-page-empty">
            <div className="static-page-empty-icon">
              <FiFileText />
            </div>

            <h4>No Static Pages</h4>

            <p>You haven't created any static pages yet.</p>

            <button
              type="button"
              className="static-page-empty-btn"
              onClick={() => navigate("/dashboard/static-pages/add")}
            >
              <FiPlus />
              Create Your First Page
            </button>
          </div>
        ) : (
          /* ==================================
             TABLE
          =================================== */

          <div className="static-page-table-wrapper">
            <table className="static-page-table">
              <thead>
                <tr>
                  <th>#</th>

                  <th>Page Title</th>

                  <th>Slug</th>

                  <th>Status</th>

                  <th className="static-page-actions-column">Actions</th>
                </tr>
              </thead>

              <tbody>
                {pages.map((page, index) => {
                  const pageId = page?.pageId || page?._id || page?.id;

                  return (
                    <tr key={pageId || `${page?.slug}-${index}`}>
                      {/* NUMBER */}

                      <td>
                        <span className="static-page-number">{index + 1}</span>
                      </td>

                      {/* TITLE */}

                      <td>
                        <div className="static-page-title-cell">
                          <div className="static-page-title-icon">
                            <FiFileText />
                          </div>

                          <div>
                            <strong>{page?.title || "Untitled Page"}</strong>
                          </div>
                        </div>
                      </td>

                      {/* SLUG */}

                      <td>
                        <span className="static-page-slug">
                          /{page?.slug || "-"}
                        </span>
                      </td>

                      {/* STATUS */}

                      <td>
                        <span className={getStatusClass(page?.isActive)}>
                          <span className="static-page-status-dot" />

                          {page?.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      {/* ACTIONS */}

                      <td>
                        <div className="static-page-actions">
                          {/* =================================
                                VIEW
                            ================================== */}

                          <button
                            type="button"
                            className="static-page-view-btn"
                            title="View Page"
                            onClick={() =>
                              navigate(
                                `/dashboard/static-pages/view/${page?.slug}`,
                              )
                            }
                          >
                            <FiEye />
                          </button>

                          {/* =================================
                                EDIT
                            ================================== */}

                          <button
                            type="button"
                            className="static-page-edit-btn"
                            title="Edit Page"
                            onClick={() =>
                              navigate(`/dashboard/static-pages/edit/${pageId}`)
                            }
                          >
                            <FiEdit2 />
                          </button>

                          {/* =================================
                                DELETE
                            ================================== */}

                          <button
                            type="button"
                            className="static-page-delete-btn"
                            title="Delete Page"
                            disabled={deletingId === pageId}
                            onClick={() => handleDelete(page)}
                          >
                            {deletingId === pageId ? (
                              <span
                                className="spinner-border spinner-border-sm"
                                role="status"
                              />
                            ) : (
                              <FiTrash2 />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaticPageList;
