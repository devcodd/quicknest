import React, { useEffect, useMemo, useState } from "react";
import {
  FiSearch,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiChevronsLeft,
  FiChevronsRight,
  FiGlobe,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import {
  getLanguages,
  deleteLanguage,
  changeLanguageStatus,
} from "../../Services/langaugeApi";

import "./LanguageList.css";

const LanguageList = () => {
  const navigate = useNavigate();

  // ==========================================
  // STATES
  // ==========================================

  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [selectedLanguages, setSelectedLanguages] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Stores language IDs whose status API is currently processing
  const [updatingStatusIds, setUpdatingStatusIds] = useState([]);

  // ==========================================
  // GET LANGUAGES
  // ==========================================

  const fetchLanguages = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getLanguages();

      if (response?.success) {
        const sortedLanguages = [...(response.data || [])].sort(
          (a, b) => a.languageId - b.languageId,
        );

        setLanguages(sortedLanguages);
      } else {
        setLanguages([]);
        setError(response?.message || "Failed to fetch languages.");
      }
    } catch (error) {
      console.error("Language API Error:", error);

      setLanguages([]);

      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to load languages.",
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // INITIAL API CALL
  // ==========================================

  useEffect(() => {
    fetchLanguages();
  }, []);

  // ==========================================
  // FILTER LANGUAGES
  // ==========================================

  const filteredLanguages = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return languages.filter((language) => {
      const languageName = language.languageName?.toLowerCase() || "";
      const code = language.code?.toLowerCase() || "";

      const matchesSearch =
        !search || languageName.includes(search) || code.includes(search);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && language.isActive) ||
        (statusFilter === "inactive" && !language.isActive);

      return matchesSearch && matchesStatus;
    });
  }, [languages, searchTerm, statusFilter]);

  // ==========================================
  // PAGINATION
  // ==========================================

  const totalPages = Math.max(
    1,
    Math.ceil(filteredLanguages.length / rowsPerPage),
  );

  const startIndex = (currentPage - 1) * rowsPerPage;

  const currentLanguages = filteredLanguages.slice(
    startIndex,
    startIndex + rowsPerPage,
  );

  // Keep current page valid when filtering/deleting
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // ==========================================
  // SELECT ALL
  // ==========================================

  const isAllSelected =
    currentLanguages.length > 0 &&
    currentLanguages.every((language) =>
      selectedLanguages.includes(language.languageId),
    );

  const handleSelectAll = (event) => {
    const currentIds = currentLanguages.map((language) => language.languageId);

    if (event.target.checked) {
      setSelectedLanguages((previous) => [
        ...new Set([...previous, ...currentIds]),
      ]);
    } else {
      setSelectedLanguages((previous) =>
        previous.filter((id) => !currentIds.includes(id)),
      );
    }
  };

  // ==========================================
  // INDIVIDUAL SELECT
  // ==========================================

  const handleSelectLanguage = (languageId) => {
    setSelectedLanguages((previous) =>
      previous.includes(languageId)
        ? previous.filter((id) => id !== languageId)
        : [...previous, languageId],
    );
  };

  // ==========================================
  // SEARCH
  // ==========================================

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
    setSelectedLanguages([]);
  };

  // ==========================================
  // STATUS FILTER
  // ==========================================

  const handleStatusFilter = (event) => {
    setStatusFilter(event.target.value);
    setCurrentPage(1);
    setSelectedLanguages([]);
  };

  // ==========================================
  // STATUS TOGGLE
  // ==========================================

  const handleStatusToggle = async (language) => {
    const languageId = language.languageId;

    // Prevent multiple API calls for the same language
    if (updatingStatusIds.includes(languageId)) {
      return;
    }

    const newStatus = !language.isActive;

    setUpdatingStatusIds((previous) => [...previous, languageId]);

    try {
      const response = await changeLanguageStatus(languageId, newStatus);

      if (response?.success) {
        // Update UI only after API succeeds
        setLanguages((previous) =>
          previous.map((item) =>
            item.languageId === languageId
              ? {
                  ...item,
                  isActive: newStatus,
                }
              : item,
          ),
        );

        await Swal.fire({
          icon: "success",
          title: "Status Updated",
          text: `Language ${
            newStatus ? "activated" : "deactivated"
          } successfully.`,
          timer: 1200,
          showConfirmButton: false,
        });
      } else {
        await Swal.fire({
          icon: "error",
          title: "Update Failed",
          text: response?.message || "Unable to update language status.",
        });
      }
    } catch (error) {
      console.error("Change Language Status Error:", error);

      await Swal.fire({
        icon: "error",
        title: "Update Failed",
        text:
          error?.response?.data?.message ||
          error?.message ||
          "Something went wrong while updating the language status.",
      });
    } finally {
      setUpdatingStatusIds((previous) =>
        previous.filter((id) => id !== languageId),
      );
    }
  };

  // ==========================================
  // CLEAR FILTERS
  // ==========================================

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setCurrentPage(1);
    setSelectedLanguages([]);
  };

  // ==========================================
  // EDIT
  // ==========================================

  const handleEdit = (language) => {
    navigate(`/dashboard/language/edit/${language.languageId}`);
  };

  // ==========================================
  // DELETE LANGUAGE
  // ==========================================

  const handleDelete = async (language) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Delete Language?",
      text: `Are you sure you want to delete "${language.languageName}"?`,
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
      const response = await deleteLanguage(language.languageId);

      if (response?.success) {
        // Remove deleted language immediately
        setLanguages((previous) =>
          previous.filter((item) => item.languageId !== language.languageId),
        );

        // Remove from selected list
        setSelectedLanguages((previous) =>
          previous.filter((id) => id !== language.languageId),
        );

        await Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: response.message || "Language deleted successfully.",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        await Swal.fire({
          icon: "error",
          title: "Delete Failed",
          text: response?.message || "Unable to delete language.",
        });
      }
    } catch (error) {
      console.error("Delete Language Error:", error);

      await Swal.fire({
        icon: "error",
        title: "Something Went Wrong",
        text:
          error?.response?.data?.message ||
          error?.message ||
          "Unable to delete language.",
      });
    }
  };

  // ==========================================
  // PAGINATION CONTROLS
  // ==========================================

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) {
      return;
    }

    setCurrentPage(page);
    setSelectedLanguages([]);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(Number(event.target.value));
    setCurrentPage(1);
    setSelectedLanguages([]);
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="language-list-page container-fluid px-0">
      {/* ======================================
          HEADER
      ======================================= */}

      <div className="language-list-header">
        <div>
          <h1>Languages</h1>
          <p>Manage the languages available in the application.</p>
        </div>

        <button
          type="button"
          className="add-language-btn"
          onClick={() => navigate("/dashboard/language/add")}
        >
          <FiPlus />
          <span>Add Language</span>
        </button>
      </div>

      {/* ======================================
          FILTERS
      ======================================= */}

      <div className="language-filter-row">
        {/* Search */}

        <div className="language-search">
          <FiSearch />

          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search language or code..."
          />
        </div>

        {/* Status */}

        <div className="language-filter-group">
          <label>Status</label>

          <div className="language-select-wrapper">
            <select value={statusFilter} onChange={handleStatusFilter}>
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <FiChevronDown />
          </div>
        </div>

        {/* Clear */}

        <button
          type="button"
          className="clear-language-filter"
          onClick={handleClearFilters}
        >
          Clear All
        </button>
      </div>

      {/* ======================================
          TABLE
      ======================================= */}

      <div className="language-table-wrapper">
        <div className="table-responsive">
          <table className="table language-table mb-0">
            <thead>
              <tr>
                <th className="language-checkbox-column">
                  <input
                    type="checkbox"
                    className="language-checkbox"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                  />
                </th>

                <th>ID</th>
                <th>Language</th>
                <th>Code</th>
                <th>Status</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {/* LOADING */}

              {loading ? (
                <tr>
                  <td colSpan="6">
                    <div className="languages-empty-state">
                      <div className="spinner-border text-primary"></div>

                      <h5 className="mt-3">Loading languages...</h5>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                /* ERROR */

                <tr>
                  <td colSpan="6">
                    <div className="languages-empty-state">
                      <div className="languages-empty-icon">
                        <FiGlobe />
                      </div>

                      <h5>Failed to load languages</h5>

                      <p>{error}</p>

                      <button
                        type="button"
                        className="btn btn-primary mt-2"
                        onClick={fetchLanguages}
                      >
                        Retry
                      </button>
                    </div>
                  </td>
                </tr>
              ) : currentLanguages.length > 0 ? (
                /* DATA */

                currentLanguages.map((language) => {
                  const isUpdating = updatingStatusIds.includes(
                    language.languageId,
                  );

                  return (
                    <tr key={language.languageId}>
                      {/* Checkbox */}

                      <td>
                        <input
                          type="checkbox"
                          className="language-checkbox"
                          checked={selectedLanguages.includes(
                            language.languageId,
                          )}
                          onChange={() =>
                            handleSelectLanguage(language.languageId)
                          }
                        />
                      </td>

                      {/* ID */}

                      <td>
                        <span className="language-id">
                          #{language.languageId}
                        </span>
                      </td>

                      {/* Language */}

                      <td>
                        <div className="language-profile">
                          <div className="language-icon">
                            <FiGlobe />
                          </div>

                          <div className="language-profile-info">
                            <span className="language-name">
                              {language.languageName}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Code */}

                      <td>
                        <span className="language-code">{language.code}</span>
                      </td>

                      {/* Status */}

                      <td>
                        <div className="language-status-wrapper">
                          <label
                            className={`language-status-switch ${
                              isUpdating ? "updating" : ""
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={language.isActive}
                              disabled={isUpdating}
                              onChange={() => handleStatusToggle(language)}
                            />

                            <span className="language-status-slider" />
                          </label>

                          <span
                            className={
                              language.isActive
                                ? "language-status-text active"
                                : "language-status-text inactive"
                            }
                          >
                            {isUpdating
                              ? "Updating..."
                              : language.isActive
                                ? "Active"
                                : "Inactive"}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}

                      <td>
                        <div className="language-actions">
                          <button
                            type="button"
                            className="language-action-btn edit"
                            title="Edit"
                            onClick={() => handleEdit(language)}
                          >
                            <FiEdit2 />
                          </button>

                          <button
                            type="button"
                            className="language-action-btn delete"
                            title="Delete"
                            onClick={() => handleDelete(language)}
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                /* EMPTY */

                <tr>
                  <td colSpan="6">
                    <div className="languages-empty-state">
                      <div className="languages-empty-icon">
                        <FiGlobe />
                      </div>

                      <h5>No languages found</h5>

                      <p>Try adjusting your search or filters.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ======================================
          PAGINATION
      ======================================= */}

      {!loading && !error && filteredLanguages.length > 0 && (
        <div className="language-pagination-wrapper">
          <div className="language-rows-per-page">
            <span>Rows per page:</span>

            <select
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
              className="language-rows-select"
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>

          <div className="language-pagination">
            <span className="language-page-info">
              Page {currentPage} of {totalPages}
            </span>

            <button
              type="button"
              className="language-pagination-btn"
              disabled={currentPage === 1}
              onClick={() => goToPage(1)}
            >
              <FiChevronsLeft />
            </button>

            <button
              type="button"
              className="language-pagination-btn"
              disabled={currentPage === 1}
              onClick={() => goToPage(currentPage - 1)}
            >
              <FiChevronLeft />
            </button>

            <button type="button" className="language-pagination-btn active">
              {currentPage}
            </button>

            <button
              type="button"
              className="language-pagination-btn"
              disabled={currentPage === totalPages}
              onClick={() => goToPage(currentPage + 1)}
            >
              <FiChevronRight />
            </button>

            <button
              type="button"
              className="language-pagination-btn"
              disabled={currentPage === totalPages}
              onClick={() => goToPage(totalPages)}
            >
              <FiChevronsRight />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageList;
