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
  FiImage,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import { getBanners } from "../../Services/bannerApi";

import "./BannerList.css";

const BannerList = () => {
  const navigate = useNavigate();

  // ==========================================
  // STATES
  // ==========================================

  const [banners, setBanners] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  const [statusFilter, setStatusFilter] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);

  const [cardsPerPage, setCardsPerPage] = useState(6);

  // ==========================================
  // GET BANNERS
  // ==========================================

  const fetchBanners = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getBanners();

      console.log("Banner API Response:", response);

      /*
        Expected API response:

        {
          success: true,
          count: 4,
          data: [...]
        }
      */

      if (response?.success) {
        setBanners(response.data || []);
      } else {
        setBanners([]);

        setError(response?.message || "Failed to fetch banners.");
      }
    } catch (error) {
      console.error("Banner API Error:", error);

      setBanners([]);

      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to load banners.",
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // INITIAL API CALL
  // ==========================================

  useEffect(() => {
    fetchBanners();
  }, []);

  // ==========================================
  // FILTER
  // ==========================================

  const filteredBanners = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return banners.filter((banner) => {
      const title = banner.title?.toLowerCase() || "";

      const matchesSearch = !search || title.includes(search);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && banner.isActive) ||
        (statusFilter === "inactive" && !banner.isActive);

      return matchesSearch && matchesStatus;
    });
  }, [banners, searchTerm, statusFilter]);

  // ==========================================
  // PAGINATION
  // ==========================================

  const totalPages = Math.max(
    1,
    Math.ceil(filteredBanners.length / cardsPerPage),
  );

  const startIndex = (currentPage - 1) * cardsPerPage;

  const currentBanners = filteredBanners.slice(
    startIndex,
    startIndex + cardsPerPage,
  );

  // ==========================================
  // SEARCH
  // ==========================================

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);

    setCurrentPage(1);
  };

  // ==========================================
  // STATUS FILTER
  // ==========================================

  const handleStatusFilter = (event) => {
    setStatusFilter(event.target.value);

    setCurrentPage(1);
  };

  // ==========================================
  // CLEAR FILTERS
  // ==========================================

  const handleClearFilters = () => {
    setSearchTerm("");

    setStatusFilter("all");

    setCurrentPage(1);
  };

  // ==========================================
  // VIEW
  // ==========================================

  const handleView = (banner) => {
    console.log("View Banner:", banner);

    // Future:
    // navigate(`/dashboard/banners/${banner.bannerId}`);
  };

  // ==========================================
  // EDIT
  // ==========================================

  const handleEdit = (banner) => {
    navigate(`/dashboard/banners/edit/${banner.bannerId}`, {
      state: {
        banner,
      },
    });
  };

  // ==========================================
  // DELETE
  // ==========================================

  const handleDelete = (banner) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${banner.title}"?`,
    );

    if (!confirmed) {
      return;
    }

    /*
      Delete API will be connected here
      once the actual endpoint is provided.

      For now we only remove it from
      the frontend state.
    */

    setBanners((previous) =>
      previous.filter((item) => item.bannerId !== banner.bannerId),
    );
  };

  // ==========================================
  // STATUS TOGGLE
  // ==========================================

  const handleStatusToggle = (bannerId) => {
    /*
      Status update API will be connected
      once the actual endpoint is provided.

      For now this updates the UI only.
    */

    setBanners((previous) =>
      previous.map((banner) =>
        banner.bannerId === bannerId
          ? {
              ...banner,
              isActive: !banner.isActive,
            }
          : banner,
      ),
    );
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
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
  };

  const handleCardsPerPageChange = (event) => {
    setCardsPerPage(Number(event.target.value));

    setCurrentPage(1);
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="banner-list-page container-fluid px-0">
      {/* ======================================
          HEADER
      ======================================= */}

      <div className="banner-list-header">
        <div>
          <h1>Banner List</h1>

          <p>Manage your website banners.</p>
        </div>

        <button
          type="button"
          className="add-banner-btn"
          onClick={() => navigate("/dashboard/banners/add")}
        >
          <FiPlus />

          <span>Add Banner</span>
        </button>
      </div>

      {/* ======================================
          FILTERS
      ======================================= */}

      <div className="banner-filter-row">
        {/* Search */}

        <div className="banner-search">
          <FiSearch />

          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search banner by title..."
          />
        </div>

        {/* Status */}

        <div className="banner-filter-group">
          <label>Status</label>

          <div className="banner-select-wrapper">
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
          className="clear-banner-filter"
          onClick={handleClearFilters}
        >
          Clear All
        </button>
      </div>

      {/* ======================================
          CONTENT
      ======================================= */}

      {loading ? (
        /* ====================================
           LOADING
        ===================================== */

        <div className="banner-state-container">
          <div className="spinner-border text-primary"></div>

          <h5>Loading banners...</h5>
        </div>
      ) : error ? (
        /* ====================================
           ERROR
        ===================================== */

        <div className="banner-state-container">
          <div className="banner-state-icon error">
            <FiImage />
          </div>

          <h5>Failed to load banners</h5>

          <p>{error}</p>

          <button
            type="button"
            className="btn btn-primary"
            onClick={fetchBanners}
          >
            Retry
          </button>
        </div>
      ) : currentBanners.length > 0 ? (
        /* ====================================
           BANNER GRID
        ===================================== */

        <div className="row g-4">
          {currentBanners.map((banner) => (
            <div className="col-xl-4 col-lg-6 col-md-6" key={banner.bannerId}>
              <div className="banner-card">
                {/* ==========================
                      IMAGE
                  =========================== */}

                <div className="banner-image-wrapper">
                  <img
                    src={banner.image}
                    alt={banner.title}
                    className="banner-image"
                  />

                  <span
                    className={
                      banner.isActive
                        ? "banner-status-badge active"
                        : "banner-status-badge inactive"
                    }
                  >
                    {banner.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                {/* ==========================
                      CONTENT
                  =========================== */}

                <div className="banner-card-content">
                  <div className="banner-card-title-row">
                    <h3>{banner.title}</h3>

                    <span className="banner-id">#{banner.bannerId}</span>
                  </div>

                  <div className="banner-created-date">
                    Created {formatDate(banner.createdAt)}
                  </div>

                  {/* ========================
                        STATUS
                    ========================= */}

                  <div className="banner-status-row">
                    <div className="banner-status-info">
                      <label className="banner-status-switch">
                        <input
                          type="checkbox"
                          checked={banner.isActive}
                          onChange={() => handleStatusToggle(banner.bannerId)}
                        />

                        <span className="banner-status-slider" />
                      </label>

                      <span
                        className={
                          banner.isActive
                            ? "banner-status-text active"
                            : "banner-status-text inactive"
                        }
                      >
                        {banner.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>

                  {/* ========================
                        ACTIONS
                    ========================= */}

                  <div className="banner-card-actions">
                    <button
                      type="button"
                      className="banner-action-btn view"
                      title="View"
                      onClick={() => handleView(banner)}
                    >
                      <FiEye />

                      <span>View</span>
                    </button>

                    <button
                      type="button"
                      className="banner-action-btn edit"
                      title="Edit"
                      onClick={() => handleEdit(banner)}
                    >
                      <FiEdit2 />

                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      className="banner-action-btn delete"
                      title="Delete"
                      onClick={() => handleDelete(banner)}
                    >
                      <FiTrash2 />

                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* ====================================
           EMPTY
        ===================================== */

        <div className="banner-state-container">
          <div className="banner-state-icon">
            <FiImage />
          </div>

          <h5>No banners found</h5>

          <p>Try adjusting your search or filters.</p>
        </div>
      )}

      {/* ======================================
          PAGINATION
      ======================================= */}

      {!loading && !error && filteredBanners.length > 0 && (
        <div className="banner-pagination-wrapper">
          {/* Cards Per Page */}

          <div className="banner-rows-per-page">
            <span>Cards per page:</span>

            <select
              value={cardsPerPage}
              onChange={handleCardsPerPageChange}
              className="banner-rows-select"
            >
              <option value="3">3</option>

              <option value="6">6</option>

              <option value="9">9</option>

              <option value="12">12</option>
            </select>
          </div>

          {/* Pagination */}

          <div className="banner-pagination">
            <span className="banner-page-info">
              Page {currentPage} of {totalPages}
            </span>

            <button
              type="button"
              className="banner-pagination-btn"
              disabled={currentPage === 1}
              onClick={() => goToPage(1)}
            >
              <FiChevronsLeft />
            </button>

            <button
              type="button"
              className="banner-pagination-btn"
              disabled={currentPage === 1}
              onClick={() => goToPage(currentPage - 1)}
            >
              <FiChevronLeft />
            </button>

            <button type="button" className="banner-pagination-btn active">
              {currentPage}
            </button>

            <button
              type="button"
              className="banner-pagination-btn"
              disabled={currentPage === totalPages}
              onClick={() => goToPage(currentPage + 1)}
            >
              <FiChevronRight />
            </button>

            <button
              type="button"
              className="banner-pagination-btn"
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

export default BannerList;
