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
  FiLayers,
} from "react-icons/fi";

import { useNavigate } from "react-router-dom";

import Swal from "sweetalert2";

import { getCategories } from "../../Services/categoryApi";

import {
  getSubCategories,
  deleteSubCategory,
  changeSubCategoryStatus,
} from "../../Services/subcategoryApi";

import "./SubcategoryList.css";

const SubcategoryList = () => {
  const navigate = useNavigate();

  // ==========================================
  // STATES
  // ==========================================

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  // All Category is selected by default
  const [selectedCategory, setSelectedCategory] = useState("all");

  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingSubCategories, setLoadingSubCategories] = useState(false);

  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [selectedSubCategories, setSelectedSubCategories] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // ==========================================
  // GET CATEGORIES
  // ==========================================

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      setError("");

      const response = await getCategories();

      console.log("Categories Response:", response);

      if (response?.success) {
        setCategories(response.data || []);

        // Keep "All Category" selected by default.
        // Do NOT automatically select the first category.
        setSelectedCategory("all");
      } else {
        setCategories([]);
        setError(response?.message || "Failed to load categories.");
      }
    } catch (error) {
      console.error("Get Categories Error:", error);

      setCategories([]);

      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to load categories.",
      );
    } finally {
      setLoadingCategories(false);
    }
  };

  // ==========================================
  // GET SUBCATEGORIES
  // ==========================================

  const fetchSubCategories = async (categoryId) => {
    try {
      setLoadingSubCategories(true);
      setError("");

      // ==========================================
      // ALL CATEGORIES
      // ==========================================

      if (categoryId === "all") {
        if (!categories.length) {
          setSubCategories([]);
          return;
        }

        const responses = await Promise.all(
          categories.map((category) => getSubCategories(category.categoryId)),
        );

        const allSubCategories = responses.flatMap((response) =>
          response?.success ? response.data || [] : [],
        );

        setSubCategories(allSubCategories);

        return;
      }

      // ==========================================
      // SINGLE CATEGORY
      // ==========================================

      const response = await getSubCategories(categoryId);

      if (response?.success) {
        setSubCategories(response.data || []);
      } else {
        setSubCategories([]);

        setError(response?.message || "Failed to load subcategories.");
      }
    } catch (error) {
      console.error("Get Subcategories Error:", error);

      setSubCategories([]);

      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to load subcategories.",
      );
    } finally {
      setLoadingSubCategories(false);
    }
  };

  // ==========================================
  // INITIAL CATEGORY LOAD
  // ==========================================

  useEffect(() => {
    fetchCategories();
  }, []);

  // ==========================================
  // LOAD SUBCATEGORIES
  // ==========================================

  useEffect(() => {
    if (!loadingCategories && selectedCategory) {
      fetchSubCategories(selectedCategory);
    }
  }, [selectedCategory, categories, loadingCategories]);

  // ==========================================
  // CATEGORY CHANGE
  // ==========================================

  const handleCategoryChange = (event) => {
    const categoryId = event.target.value;

    setSelectedCategory(categoryId);

    setCurrentPage(1);
    setSearchTerm("");
    setStatusFilter("all");
    setSelectedSubCategories([]);
  };

  // ==========================================
  // FILTER
  // ==========================================

  const filteredSubCategories = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return subCategories.filter((subCategory) => {
      const name = subCategory.subCategoryName?.toLowerCase() || "";

      const slug = subCategory.slug?.toLowerCase() || "";

      const matchesSearch =
        !search || name.includes(search) || slug.includes(search);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && subCategory.isActive) ||
        (statusFilter === "inactive" && !subCategory.isActive);

      return matchesSearch && matchesStatus;
    });
  }, [subCategories, searchTerm, statusFilter]);

  // ==========================================
  // PAGINATION
  // ==========================================

  const totalPages = Math.max(
    1,
    Math.ceil(filteredSubCategories.length / rowsPerPage),
  );

  const startIndex = (currentPage - 1) * rowsPerPage;

  const currentSubCategories = filteredSubCategories.slice(
    startIndex,
    startIndex + rowsPerPage,
  );

  // ==========================================
  // SELECT ALL
  // ==========================================

  const isAllSelected =
    currentSubCategories.length > 0 &&
    currentSubCategories.every((subCategory) =>
      selectedSubCategories.includes(subCategory.subCategoryId),
    );

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const currentIds = currentSubCategories.map(
        (subCategory) => subCategory.subCategoryId,
      );

      setSelectedSubCategories((previous) => [
        ...new Set([...previous, ...currentIds]),
      ]);
    } else {
      const currentIds = currentSubCategories.map(
        (subCategory) => subCategory.subCategoryId,
      );

      setSelectedSubCategories((previous) =>
        previous.filter((id) => !currentIds.includes(id)),
      );
    }
  };

  // ==========================================
  // INDIVIDUAL SELECT
  // ==========================================

  const handleSelectSubCategory = (subCategoryId) => {
    setSelectedSubCategories((previous) =>
      previous.includes(subCategoryId)
        ? previous.filter((id) => id !== subCategoryId)
        : [...previous, subCategoryId],
    );
  };

  // ==========================================
  // SEARCH
  // ==========================================

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);

    setCurrentPage(1);
    setSelectedSubCategories([]);
  };

  // ==========================================
  // STATUS FILTER
  // ==========================================

  const handleStatusFilter = (event) => {
    setStatusFilter(event.target.value);

    setCurrentPage(1);
    setSelectedSubCategories([]);
  };

  // ==========================================
  // CLEAR FILTERS
  // ==========================================

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setCurrentPage(1);
    setSelectedSubCategories([]);
  };

  // ==========================================
  // EDIT
  // ==========================================

  const handleEdit = (subCategory) => {
    navigate(`/dashboard/subcategories/edit/${subCategory.subCategoryId}`);
  };

  // ==========================================
  // DELETE
  // ==========================================

  const handleDelete = async (subCategory) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Delete Subcategory?",
      text: `Are you sure you want to delete "${subCategory.subCategoryName}"?`,
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
      const response = await deleteSubCategory(subCategory.subCategoryId);

      console.log("Delete Subcategory Response:", response);

      if (response?.success) {
        setSubCategories((previous) =>
          previous.filter(
            (item) => item.subCategoryId !== subCategory.subCategoryId,
          ),
        );

        setSelectedSubCategories((previous) =>
          previous.filter((id) => id !== subCategory.subCategoryId),
        );

        await Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: response.message || "Subcategory deleted successfully.",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        await Swal.fire({
          icon: "error",
          title: "Delete Failed",
          text: response?.message || "Unable to delete subcategory.",
        });
      }
    } catch (error) {
      console.error("Delete Subcategory Error:", error);

      await Swal.fire({
        icon: "error",
        title: "Something Went Wrong",
        text:
          error?.response?.data?.message ||
          error?.message ||
          "Unable to delete subcategory.",
      });
    }
  };
  // ==========================================
  // CHANGE STATUS
  // ==========================================

  const handleStatusToggle = async (subCategory) => {
    const newStatus = !subCategory.isActive;

    try {
      const response = await changeSubCategoryStatus(
        subCategory.subCategoryId,
        newStatus,
      );

      console.log("Change Subcategory Status Response:", response);

      if (response?.success) {
        // Update UI immediately after successful API response
        setSubCategories((previous) =>
          previous.map((item) =>
            item.subCategoryId === subCategory.subCategoryId
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
          text: `Subcategory ${
            newStatus ? "activated" : "deactivated"
          } successfully.`,
          timer: 1200,
          showConfirmButton: false,
        });
      } else {
        await Swal.fire({
          icon: "error",
          title: "Update Failed",
          text: response?.message || "Unable to update subcategory status.",
        });
      }
    } catch (error) {
      console.error("Change Subcategory Status Error:", error);

      await Swal.fire({
        icon: "error",
        title: "Update Failed",
        text:
          error?.response?.data?.message ||
          error?.message ||
          "Something went wrong while updating subcategory status.",
      });
    }
  };
  // ==========================================
  // PAGINATION
  // ==========================================

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) {
      return;
    }

    setCurrentPage(page);
    setSelectedSubCategories([]);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(Number(event.target.value));

    setCurrentPage(1);
    setSelectedSubCategories([]);
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="subcategory-list-page container-fluid px-0">
      {/* ======================================
          HEADER
      ======================================= */}

      <div className="subcategory-list-header">
        <div>
          <h1>Subcategories</h1>
          <p>Manage service subcategories by category.</p>
        </div>

        <button
          type="button"
          className="add-subcategory-btn"
          onClick={() => navigate("/dashboard/subcategories/add")}
        >
          <FiPlus />
          <span>Add Subcategory</span>
        </button>
      </div>

      {/* ======================================
          CATEGORY SELECT
      ======================================= */}

      <div className="subcategory-category-row">
        <div className="subcategory-category-group">
          <label>Category</label>

          <div className="subcategory-select-wrapper">
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              disabled={loadingCategories}
            >
              <option value="all">All Category</option>

              {categories.map((category) => (
                <option key={category.categoryId} value={category.categoryId}>
                  {category.categoryName}
                </option>
              ))}
            </select>

            <FiChevronDown />
          </div>
        </div>
      </div>

      {/* ======================================
          FILTERS
      ======================================= */}

      <div className="subcategory-filter-row">
        <div className="subcategory-search">
          <FiSearch />

          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search subcategory or slug..."
            disabled={loadingCategories || loadingSubCategories}
          />
        </div>

        <div className="subcategory-filter-group">
          <label>Status</label>

          <div className="subcategory-select-wrapper">
            <select
              value={statusFilter}
              onChange={handleStatusFilter}
              disabled={loadingCategories || loadingSubCategories}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <FiChevronDown />
          </div>
        </div>

        <button
          type="button"
          className="clear-subcategory-filter"
          onClick={handleClearFilters}
        >
          Clear All
        </button>
      </div>

      {/* ======================================
          TABLE
      ======================================= */}

      <div className="subcategory-table-wrapper">
        <div className="table-responsive">
          <table className="table subcategory-table mb-0">
            <thead>
              <tr>
                <th className="subcategory-checkbox-column">
                  <input
                    type="checkbox"
                    className="subcategory-checkbox"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                  />
                </th>

                <th>ID</th>
                <th>Subcategory</th>
                <th>Slug</th>
                <th>Status</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {/* ==================================
                  LOADING CATEGORIES
              =================================== */}

              {loadingCategories ? (
                <tr>
                  <td colSpan="6">
                    <div className="subcategories-empty-state">
                      <div className="spinner-border text-primary"></div>

                      <h5 className="mt-3">Loading categories...</h5>
                    </div>
                  </td>
                </tr>
              ) : loadingSubCategories ? (
                /* ==================================
                   LOADING SUBCATEGORIES
                =================================== */

                <tr>
                  <td colSpan="6">
                    <div className="subcategories-empty-state">
                      <div className="spinner-border text-primary"></div>

                      <h5 className="mt-3">Loading subcategories...</h5>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                /* ==================================
                   ERROR
                =================================== */

                <tr>
                  <td colSpan="6">
                    <div className="subcategories-empty-state">
                      <div className="subcategory-empty-icon">
                        <FiLayers />
                      </div>

                      <h5>Failed to load data</h5>

                      <p>{error}</p>

                      <button
                        type="button"
                        className="btn btn-primary mt-2"
                        onClick={() => fetchSubCategories(selectedCategory)}
                      >
                        Retry
                      </button>
                    </div>
                  </td>
                </tr>
              ) : currentSubCategories.length > 0 ? (
                /* ==================================
                   DATA
                =================================== */

                currentSubCategories.map((subCategory) => (
                  <tr key={subCategory.subCategoryId}>
                    {/* Checkbox */}

                    <td>
                      <input
                        type="checkbox"
                        className="subcategory-checkbox"
                        checked={selectedSubCategories.includes(
                          subCategory.subCategoryId,
                        )}
                        onChange={() =>
                          handleSelectSubCategory(subCategory.subCategoryId)
                        }
                      />
                    </td>

                    {/* ID */}

                    <td>
                      <span className="subcategory-id">
                        #{subCategory.subCategoryId}
                      </span>
                    </td>

                    {/* Subcategory */}

                    <td>
                      <div className="subcategory-profile">
                        <div className="subcategory-icon">
                          <FiLayers />
                        </div>

                        <div className="subcategory-profile-info">
                          <span className="subcategory-name">
                            {subCategory.subCategoryName}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Slug */}

                    <td>
                      <span className="subcategory-slug">
                        {subCategory.slug}
                      </span>
                    </td>

                    {/* Status */}

                    <td>
                      <div className="subcategory-status-wrapper">
                        <label className="subcategory-status-switch">
                          <input
                            type="checkbox"
                            checked={subCategory.isActive}
                            onChange={() => handleStatusToggle(subCategory)}
                          />

                          <span className="subcategory-status-slider" />
                        </label>

                        <span
                          className={
                            subCategory.isActive
                              ? "subcategory-status-text active"
                              : "subcategory-status-text inactive"
                          }
                        >
                          {subCategory.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}

                    <td>
                      <div className="subcategory-actions">
                        <button
                          type="button"
                          className="subcategory-action-btn edit"
                          title="Edit"
                          onClick={() => handleEdit(subCategory)}
                        >
                          <FiEdit2 />
                        </button>

                        <button
                          type="button"
                          className="subcategory-action-btn delete"
                          title="Delete"
                          onClick={() => handleDelete(subCategory)}
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                /* ==================================
                   EMPTY
                =================================== */

                <tr>
                  <td colSpan="6">
                    <div className="subcategories-empty-state">
                      <div className="subcategory-empty-icon">
                        <FiLayers />
                      </div>

                      <h5>No subcategories found</h5>

                      <p>
                        {searchTerm || statusFilter !== "all"
                          ? "No subcategories match the selected filters."
                          : selectedCategory === "all"
                            ? "There are no subcategories available."
                            : "There are no subcategories for the selected category."}
                      </p>
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

      {!loadingSubCategories &&
        !loadingCategories &&
        !error &&
        filteredSubCategories.length > 0 && (
          <div className="subcategory-pagination-wrapper">
            <div className="subcategory-rows-per-page">
              <span>Rows per page:</span>

              <select
                value={rowsPerPage}
                onChange={handleRowsPerPageChange}
                className="subcategory-rows-select"
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>

            <div className="subcategory-pagination">
              <span className="subcategory-page-info">
                Page {currentPage} of {totalPages}
              </span>

              <button
                type="button"
                className="subcategory-pagination-btn"
                disabled={currentPage === 1}
                onClick={() => goToPage(1)}
              >
                <FiChevronsLeft />
              </button>

              <button
                type="button"
                className="subcategory-pagination-btn"
                disabled={currentPage === 1}
                onClick={() => goToPage(currentPage - 1)}
              >
                <FiChevronLeft />
              </button>

              <button
                type="button"
                className="subcategory-pagination-btn active"
              >
                {currentPage}
              </button>

              <button
                type="button"
                className="subcategory-pagination-btn"
                disabled={currentPage === totalPages}
                onClick={() => goToPage(currentPage + 1)}
              >
                <FiChevronRight />
              </button>

              <button
                type="button"
                className="subcategory-pagination-btn"
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
};;

export default SubcategoryList;
