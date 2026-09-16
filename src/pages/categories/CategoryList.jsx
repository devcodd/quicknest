import React, { useEffect, useMemo, useState } from "react";
import {
  FiSearch,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiChevronsLeft,
  FiChevronsRight,
  FiLayers,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import {
  getCategories,
  deleteCategory,
  updateCategory,
  updateCategoryStatus,
} from "../../Services/categoryApi";

import "./CategoryList.css";
import Swal from "sweetalert2";

const CategoryList = () => {
  const navigate = useNavigate();

  // ==========================================
  // STATES
  // ==========================================

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // ==========================================
  // GET CATEGORIES
  // ==========================================

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getCategories();

      console.log("Category API Response:", response);

      if (response?.success) {
        setCategories(response.data || []);
      } else {
        setCategories([]);
        setError(response?.message || "Failed to fetch categories.");
      }
    } catch (error) {
      console.error("Category API Error:", error);

      setCategories([]);

      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to load categories.",
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // INITIAL API CALL
  // ==========================================

  useEffect(() => {
    fetchCategories();
  }, []);

  // ==========================================
  // FILTER
  // ==========================================

  const filteredCategories = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return categories.filter((category) => {
      const categoryName = category.categoryName?.toLowerCase() || "";

      const slug = category.slug?.toLowerCase() || "";

      const matchesSearch =
        !search || categoryName.includes(search) || slug.includes(search);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && category.isActive) ||
        (statusFilter === "inactive" && !category.isActive);

      return matchesSearch && matchesStatus;
    });
  }, [categories, searchTerm, statusFilter]);

  // ==========================================
  // PAGINATION
  // ==========================================

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCategories.length / rowsPerPage),
  );

  const startIndex = (currentPage - 1) * rowsPerPage;

  const currentCategories = filteredCategories.slice(
    startIndex,
    startIndex + rowsPerPage,
  );

  // ==========================================
  // SELECT ALL
  // ==========================================

  const isAllSelected =
    currentCategories.length > 0 &&
    currentCategories.every((category) =>
      selectedCategories.includes(category.categoryId),
    );

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const currentIds = currentCategories.map(
        (category) => category.categoryId,
      );

      setSelectedCategories((previous) => [
        ...new Set([...previous, ...currentIds]),
      ]);
    } else {
      const currentIds = currentCategories.map(
        (category) => category.categoryId,
      );

      setSelectedCategories((previous) =>
        previous.filter((id) => !currentIds.includes(id)),
      );
    }
  };

  // ==========================================
  // INDIVIDUAL SELECT
  // ==========================================

  const handleSelectCategory = (categoryId) => {
    setSelectedCategories((previous) =>
      previous.includes(categoryId)
        ? previous.filter((id) => id !== categoryId)
        : [...previous, categoryId],
    );
  };

  // ==========================================
  // STATUS TOGGLE
  // ==========================================

  const handleStatusToggle = async (category) => {
    const newStatus = !category.isActive;

    try {
      const response = await updateCategoryStatus(
        category.categoryId,
        newStatus,
      );

      console.log("Category Status Update Response:", response);

      if (response?.success) {
        setCategories((previous) =>
          previous.map((item) =>
            item.categoryId === category.categoryId
              ? {
                  ...item,
                  isActive: newStatus,
                }
              : item,
          ),
        );

        Swal.fire({
          icon: "success",
          title: "Status Updated",
          text: response.message || "Category status updated successfully.",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Update Failed",
          text: response?.message || "Unable to update category status.",
        });
      }
    } catch (error) {
      console.error("Category Status Update Error:", error);

      Swal.fire({
        icon: "error",
        title: "Something went wrong",
        text:
          error?.response?.data?.message ||
          error?.message ||
          "Unable to update category status.",
      });
    }
  };

  // ==========================================
  // SEARCH
  // ==========================================

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
    setSelectedCategories([]);
  };

  // ==========================================
  // STATUS FILTER
  // ==========================================

  const handleStatusFilter = (event) => {
    setStatusFilter(event.target.value);
    setCurrentPage(1);
    setSelectedCategories([]);
  };

  // ==========================================
  // CLEAR FILTERS
  // ==========================================

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setCurrentPage(1);
    setSelectedCategories([]);
  };

  // ==========================================
  // DELETE
  // ==========================================

  const handleDelete = async (category) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Delete Category?",
      text: `Are you sure you want to delete "${category.categoryName}"?`,
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      setLoading(true);

      const response = await deleteCategory(category.categoryId);

      console.log("Delete Category Response:", response);

      if (response?.success) {
        setCategories((previous) =>
          previous.filter((item) => item.categoryId !== category.categoryId),
        );

        setSelectedCategories((previous) =>
          previous.filter((id) => id !== category.categoryId),
        );

        Swal.fire({
          icon: "success",
          title: "Deleted",
          text: response.message || "Category deleted successfully.",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Delete Failed",
          text: response?.message || "Failed to delete category.",
        });
      }
    } catch (error) {
      console.error("Delete Category Error:", error);

      Swal.fire({
        icon: "error",
        title: "Something went wrong",
        text:
          error?.response?.data?.message ||
          error?.message ||
          "Something went wrong while deleting the category.",
      });
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // VIEW
  // ==========================================

  // const handleView = (category) => {
  //   console.log("View Category:", category);

  //   // Future:
  //   // navigate(`/dashboard/categories/${category.categoryId}`);
  // };

  // ==========================================
  // EDIT
  // ==========================================

  const handleEdit = (category) => {
    navigate(`/dashboard/categories/edit/${category.categoryId}`, {
      state: {
        category,
      },
    });
  };

  // ==========================================
  // PAGINATION
  // ==========================================

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) {
      return;
    }

    setCurrentPage(page);
    setSelectedCategories([]);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(Number(event.target.value));
    setCurrentPage(1);
    setSelectedCategories([]);
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="category-list-page container-fluid px-0">
      {/* ======================================
          HEADER
      ======================================= */}

      <div className="category-list-header">
        <h1>Categories</h1>

        <button
          type="button"
          className="add-category-btn"
          onClick={() => navigate("/dashboard/categories/add")}
        >
          <FiPlus />
          <span>Add Category</span>
        </button>
      </div>

      {/* ======================================
          FILTERS
      ======================================= */}

      <div className="category-filter-row">
        {/* Search */}

        <div className="category-search">
          <FiSearch />

          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search Category by name..."
          />
        </div>

        {/* Status */}

        <div className="category-filter-group">
          <label>Status</label>

          <div className="category-select-wrapper">
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
          className="clear-category-filter"
          onClick={handleClearFilters}
        >
          Clear All
        </button>
      </div>

      {/* ======================================
          TABLE
      ======================================= */}

      <div className="category-table-wrapper">
        <div className="table-responsive">
          <table className="table category-table mb-0">
            <thead>
              <tr>
                <th className="category-checkbox-column">
                  <input
                    type="checkbox"
                    className="category-checkbox"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                  />
                </th>

                <th>Category</th>

                <th>Slug</th>

                <th>Description</th>

                <th>Status</th>

                <th className="text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {/* ==================================
                  LOADING
              =================================== */}

              {loading ? (
                <tr>
                  <td colSpan="6">
                    <div className="categories-empty-state">
                      <div className="spinner-border text-primary"></div>

                      <h5 className="mt-3">Loading categories...</h5>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                /* ==================================
                   ERROR
                =================================== */

                <tr>
                  <td colSpan="6">
                    <div className="categories-empty-state">
                      <div className="categories-empty-icon">
                        <FiLayers />
                      </div>

                      <h5>Failed to load categories</h5>

                      <p>{error}</p>

                      <button
                        type="button"
                        className="btn btn-primary mt-2"
                        onClick={fetchCategories}
                      >
                        Retry
                      </button>
                    </div>
                  </td>
                </tr>
              ) : currentCategories.length > 0 ? (
                /* ==================================
                   DATA
                =================================== */

                currentCategories.map((category) => (
                  <tr key={category.categoryId}>
                    {/* Checkbox */}

                    <td>
                      <input
                        type="checkbox"
                        className="category-checkbox"
                        checked={selectedCategories.includes(
                          category.categoryId,
                        )}
                        onChange={() =>
                          handleSelectCategory(category.categoryId)
                        }
                      />
                    </td>

                    {/* Category */}

                    <td>
                      <div className="category-profile">
                        <img
                          src={category.image}
                          alt={category.categoryName}
                          className="category-image"
                        />

                        <div className="category-profile-info">
                          <span className="category-name">
                            {category.categoryName}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Slug */}

                    <td>
                      <span className="category-slug">{category.slug}</span>
                    </td>

                    {/* Description */}

                    <td>
                      <div className="category-description">
                        {category.description}
                      </div>
                    </td>

                    {/* Status */}

                    <td>
                      <div className="category-status-wrapper">
                        <label className="category-status-switch">
                          <input
                            type="checkbox"
                            checked={category.isActive}
                            onChange={() => handleStatusToggle(category)}
                          />

                          <span className="category-status-slider" />
                        </label>

                        <span
                          className={
                            category.isActive
                              ? "category-status-text active"
                              : "category-status-text inactive"
                          }
                        >
                          {category.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}

                    <td>
                      <div className="category-actions">
                        {/* View - kept for future use */}

                        {/* <button
                          type="button"
                          className="category-action-btn view"
                          title="View"
                          onClick={() =>
                            handleView(category)
                          }
                        >
                          <FiEye />
                        </button> */}

                        <button
                          type="button"
                          className="category-action-btn edit"
                          title="Edit"
                          onClick={() => handleEdit(category)}
                        >
                          <FiEdit2 />
                        </button>

                        <button
                          type="button"
                          className="category-action-btn delete"
                          title="Delete"
                          onClick={() => handleDelete(category)}
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
                    <div className="categories-empty-state">
                      <div className="categories-empty-icon">
                        <FiLayers />
                      </div>

                      <h5>No categories found</h5>

                      <p>Try adjusting your search or filters</p>
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

      <div className="category-pagination-wrapper">
        <div className="category-rows-per-page">
          <span>Rows per page:</span>

          <select
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            className="category-rows-select"
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>

        <div className="category-pagination">
          <span className="category-page-info">
            Page {currentPage} of {totalPages}
          </span>

          <button
            type="button"
            className="category-pagination-btn"
            disabled={currentPage === 1}
            onClick={() => goToPage(1)}
          >
            <FiChevronsLeft />
          </button>

          <button
            type="button"
            className="category-pagination-btn"
            disabled={currentPage === 1}
            onClick={() => goToPage(currentPage - 1)}
          >
            <FiChevronLeft />
          </button>

          <button type="button" className="category-pagination-btn active">
            {currentPage}
          </button>

          <button
            type="button"
            className="category-pagination-btn"
            disabled={currentPage === totalPages}
            onClick={() => goToPage(currentPage + 1)}
          >
            <FiChevronRight />
          </button>

          <button
            type="button"
            className="category-pagination-btn"
            disabled={currentPage === totalPages}
            onClick={() => goToPage(totalPages)}
          >
            <FiChevronsRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryList;
