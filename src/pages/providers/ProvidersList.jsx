import React, { useEffect, useState } from "react";

import {
  FiEye,
  FiRefreshCw,
  FiSearch,
  FiUser,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

import Swal from "sweetalert2";

import {
  getAllProviders,
  getProviderById,
  updateFeaturedStatus,
} from "../../Services/providerApi";

import "./ProvidersList.css";

import ProviderDrawer from "./ProviderDrawer";

const ProvidersList = () => {
  // --------------------------------------------------
  // PROVIDERS
  // --------------------------------------------------

  const [providers, setProviders] = useState([]);

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // --------------------------------------------------
  // FEATURED UPDATE
  // --------------------------------------------------

  const [updatingFeaturedId, setUpdatingFeaturedId] = useState(null);

  // --------------------------------------------------
  // SEARCH
  // --------------------------------------------------

  const [search, setSearch] = useState("");

  // --------------------------------------------------
  // PROVIDER DRAWER
  // --------------------------------------------------

  const [selectedProvider, setSelectedProvider] = useState(null);

  const [showDrawer, setShowDrawer] = useState(false);

  const [loadingDetails, setLoadingDetails] = useState(false);

  // --------------------------------------------------
  // PAGINATION
  // --------------------------------------------------

  const [currentPage, setCurrentPage] = useState(1);

  /*
   * API currently doesn't provide pagination information
   * in the endpoint you've shared, so pagination is handled
   * on the loaded provider list.
   */

  const itemsPerPage = 10;

  // --------------------------------------------------
  // FETCH PROVIDERS
  // --------------------------------------------------

  const fetchProviders = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await getAllProviders();

      if (response?.success) {
        setProviders(Array.isArray(response.data) ? response.data : []);
      } else {
        setProviders([]);

        Swal.fire({
          icon: "error",
          title: "Unable to load providers",
          text: response?.message || "Something went wrong.",
        });
      }
    } catch (error) {
      console.error("Provider fetch error:", error);

      setProviders([]);

      Swal.fire({
        icon: "error",
        title: "Failed to load providers",
        text:
          error?.response?.data?.message ||
          "Unable to fetch providers. Please try again.",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // --------------------------------------------------
  // INITIAL FETCH
  // --------------------------------------------------

  useEffect(() => {
    fetchProviders();
  }, []);

  // --------------------------------------------------
  // SEARCH
  // --------------------------------------------------

  const filteredProviders = providers.filter((provider) => {
    const customer = provider?.customerId || {};

    const profile = provider?.profile || {};

    const service = provider?.service || {};

    const searchText = search.toLowerCase().trim();

    if (!searchText) {
      return true;
    }

    return (
      customer?.name?.toLowerCase().includes(searchText) ||
      profile?.fullName?.toLowerCase().includes(searchText) ||
      customer?.email?.toLowerCase().includes(searchText) ||
      customer?.phone?.toLowerCase().includes(searchText) ||
      service?.serviceName?.toLowerCase().includes(searchText) ||
      service?.address?.city?.toLowerCase().includes(searchText) ||
      service?.address?.state?.toLowerCase().includes(searchText)
    );
  });

  // --------------------------------------------------
  // UPDATE PROVIDER AFTER DRAWER ACTION
  // --------------------------------------------------

  const handleProviderStatusUpdated = (updatedProvider) => {
    setSelectedProvider(updatedProvider);

    setProviders((prevProviders) =>
      prevProviders.map((provider) =>
        provider?._id === updatedProvider?._id ? updatedProvider : provider,
      ),
    );
  };

  // --------------------------------------------------
  // FEATURED TOGGLE
  // --------------------------------------------------

  const handleFeaturedToggle = async (provider) => {
    const userId = provider?.customerId?.userId;

    if (!userId) {
      Swal.fire({
        icon: "error",
        title: "User ID not found",
        text: "Unable to update featured status.",
      });

      return;
    }

    const newFeaturedStatus = !Boolean(provider?.isFeatured);

    try {
      setUpdatingFeaturedId(userId);

      const response = await updateFeaturedStatus(userId, newFeaturedStatus);

      if (!response?.success) {
        throw new Error(
          response?.message || "Failed to update featured status.",
        );
      }

      /*
       * Update only the provider whose
       * featured status was changed.
       */
      setProviders((prevProviders) =>
        prevProviders.map((item) =>
          item?.customerId?.userId === userId
            ? {
                ...item,
                isFeatured: newFeaturedStatus,
              }
            : item,
        ),
      );

      Swal.fire({
        icon: "success",
        title: "Updated",
        text: newFeaturedStatus
          ? "Provider marked as featured."
          : "Provider removed from featured.",
        timer: 1200,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Featured status update error:", error);

      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text:
          error?.response?.data?.message ||
          error?.message ||
          "Unable to update featured status.",
      });
    } finally {
      setUpdatingFeaturedId(null);
    }
  };

  // --------------------------------------------------
  // PAGINATION
  // --------------------------------------------------

  const totalPages = Math.ceil(filteredProviders.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;

  const currentProviders = filteredProviders.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  // --------------------------------------------------
  // RESET PAGE WHEN SEARCH CHANGES
  // --------------------------------------------------

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // --------------------------------------------------
  // VIEW PROVIDER
  // --------------------------------------------------

  const handleViewProvider = async (provider) => {
    const providerId = provider?.customerId?.userId;

    if (!providerId) {
      Swal.fire({
        icon: "error",
        title: "Provider ID not found",
        text: "Unable to load provider details.",
      });

      return;
    }

    try {
      setLoadingDetails(true);
      setShowDrawer(true);

      const response = await getProviderById(providerId);

      if (response?.success) {
        setSelectedProvider(response.data);
      } else {
        setShowDrawer(false);

        Swal.fire({
          icon: "error",
          title: "Unable to load provider",
          text: response?.message || "Provider details could not be loaded.",
        });
      }
    } catch (error) {
      console.error("Provider detail error:", error);

      setShowDrawer(false);

      Swal.fire({
        icon: "error",
        title: "Failed to load provider",
        text:
          error?.response?.data?.message || "Unable to fetch provider details.",
      });
    } finally {
      setLoadingDetails(false);
    }
  };

  // --------------------------------------------------
  // CLOSE DRAWER
  // --------------------------------------------------

  const handleCloseDrawer = () => {
    setShowDrawer(false);

    setTimeout(() => {
      setSelectedProvider(null);
    }, 300);
  };

  // --------------------------------------------------
  // HELPERS
  // --------------------------------------------------

  const getProviderName = (provider) => {
    return (
      provider?.customerId?.name ||
      provider?.profile?.fullName ||
      "Unknown Provider"
    );
  };

  const getServiceName = (provider) => {
    return provider?.service?.serviceName?.trim() || "—";
  };

  const getLocation = (provider) => {
    const address = provider?.service?.address;

    if (!address) {
      return "—";
    }

    const location = [address.city, address.state].filter(Boolean).join(", ");

    return location || address.address || "—";
  };

  const getStatus = (provider) => {
    if (provider?.isRejected) {
      return "rejected";
    }

    if (provider?.isApproved) {
      return "approved";
    }

    return "pending";
  };

  const getInitials = (name) => {
    if (!name) {
      return "P";
    }

    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word.charAt(0).toUpperCase())
      .join("");
  };

  const formatRating = (rating) => {
    if (rating === undefined || rating === null) {
      return "—";
    }

    return Number(rating).toFixed(1);
  };

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="providers-page">
        <div className="providers-loading">
          <div className="providers-spinner"></div>

          <p>Loading providers...</p>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div className="providers-page">
      {/* ============================================
          PAGE HEADER
      ============================================ */}

      <div className="providers-header">
        <div>
          <h2>Providers</h2>

          <p>Manage and review service providers</p>
        </div>

        <button
          type="button"
          className="provider-refresh-btn"
          onClick={() => fetchProviders(true)}
          disabled={refreshing}
        >
          <FiRefreshCw className={refreshing ? "refresh-spinning" : ""} />

          <span>{refreshing ? "Refreshing..." : "Refresh"}</span>
        </button>
      </div>

      {/* ============================================
          SUMMARY CARDS
      ============================================ */}

      <div className="provider-summary-grid">
        <div className="provider-summary-card">
          <div className="summary-icon">
            <FiUser />
          </div>

          <div>
            <span>Total Providers</span>

            <strong>{providers.length}</strong>
          </div>
        </div>

        <div className="provider-summary-card">
          <div className="summary-icon approved">
            <FiCheckCircle />
          </div>

          <div>
            <span>Approved</span>

            <strong>
              {providers.filter((provider) => provider?.isApproved).length}
            </strong>
          </div>
        </div>

        <div className="provider-summary-card">
          <div className="summary-icon pending">
            <FiClock />
          </div>

          <div>
            <span>Pending</span>

            <strong>
              {
                providers.filter(
                  (provider) => !provider?.isApproved && !provider?.isRejected,
                ).length
              }
            </strong>
          </div>
        </div>

        <div className="provider-summary-card">
          <div className="summary-icon">
            <FiCheckCircle />
          </div>

          <div>
            <span>Featured</span>

            <strong>
              {providers.filter((provider) => provider?.isFeatured).length}
            </strong>
          </div>
        </div>
      </div>

      {/* ============================================
          SEARCH
      ============================================ */}

      <div className="providers-toolbar">
        <div className="provider-search">
          <FiSearch />

          <input
            type="text"
            placeholder="Search provider, email, service or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {search && (
            <button
              type="button"
              className="search-clear"
              onClick={() => setSearch("")}
            >
              ×
            </button>
          )}
        </div>

        <div className="provider-result-count">
          {filteredProviders.length} provider
          {filteredProviders.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* ============================================
          TABLE
      ============================================ */}

      <div className="providers-table-card">
        <div className="providers-table-wrapper">
          <table className="providers-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Provider</th>
                <th>Service</th>
                <th>Location</th>
                <th>Rating</th>
                <th>Status</th>
                <th>Featured</th>
                <th>Bookings</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {currentProviders.length > 0 ? (
                currentProviders.map((provider, index) => {
                  const name = getProviderName(provider);

                  const customer = provider?.customerId;

                  const status = getStatus(provider);

                  const userId = customer?.userId;

                  const isFeatured = Boolean(provider?.isFeatured);

                  const isUpdating = updatingFeaturedId === userId;

                  return (
                    <tr key={provider?._id || index}>
                      {/* # */}

                      <td>
                        <span className="provider-number">
                          {startIndex + index + 1}
                        </span>
                      </td>

                      {/* PROVIDER */}

                      <td>
                        <div className="provider-info">
                          {customer?.profileImage ? (
                            <img
                              src={customer.profileImage}
                              alt={name}
                              className="provider-avatar"
                            />
                          ) : (
                            <div className="provider-avatar provider-avatar-placeholder">
                              {getInitials(name)}
                            </div>
                          )}

                          <div className="provider-info-text">
                            <strong>{name}</strong>

                            <span>{customer?.email || "—"}</span>
                          </div>
                        </div>
                      </td>

                      {/* SERVICE */}

                      <td>
                        <span className="service-name">
                          {getServiceName(provider)}
                        </span>
                      </td>

                      {/* LOCATION */}

                      <td>
                        <span className="provider-location">
                          {getLocation(provider)}
                        </span>
                      </td>

                      {/* RATING */}

                      <td>
                        <div className="provider-rating">
                          <span className="rating-star">★</span>

                          <span>{formatRating(provider?.averageRating)}</span>
                        </div>
                      </td>

                      {/* STATUS */}

                      <td>
                        {status === "approved" && (
                          <span className="provider-status approved">
                            <FiCheckCircle />
                            Approved
                          </span>
                        )}

                        {status === "rejected" && (
                          <span className="provider-status rejected">
                            <FiXCircle />
                            Rejected
                          </span>
                        )}

                        {status === "pending" && (
                          <span className="provider-status pending">
                            <FiClock />
                            Pending
                          </span>
                        )}
                      </td>

                      {/* FEATURED */}

                      <td>
                        <label
                          className={`apple-switch ${
                            isUpdating ? "updating" : ""
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isFeatured}
                            disabled={isUpdating || !userId}
                            onChange={() => handleFeaturedToggle(provider)}
                          />

                          <span className="apple-slider">
                            <span className="apple-knob"></span>
                          </span>
                        </label>
                      </td>

                      {/* BOOKINGS */}

                      <td>
                        <span className="booking-count">
                          {provider?.totalBookings ?? 0}
                        </span>
                      </td>

                      {/* ACTION */}

                      <td>
                        <button
                          type="button"
                          className="provider-view-btn"
                          onClick={() => handleViewProvider(provider)}
                          title="View Provider"
                        >
                          <FiEye />

                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="9" className="providers-empty-cell">
                    <div className="providers-empty">
                      <div className="empty-icon">
                        <FiUser />
                      </div>

                      <h4>
                        {search
                          ? "No providers found"
                          : "No providers available"}
                      </h4>

                      <p>
                        {search
                          ? "Try changing your search keyword."
                          : "There are currently no providers to display."}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ============================================
            PAGINATION
        ============================================ */}

        {totalPages > 1 && (
          <div className="providers-pagination">
            <span className="pagination-info">
              Showing <strong>{startIndex + 1}</strong> to{" "}
              <strong>
                {Math.min(startIndex + itemsPerPage, filteredProviders.length)}
              </strong>{" "}
              of <strong>{filteredProviders.length}</strong>
            </span>

            <div className="pagination-buttons">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                <FiChevronLeft />
              </button>

              {Array.from(
                {
                  length: totalPages,
                },
                (_, index) => index + 1,
              ).map((page) => (
                <button
                  type="button"
                  key={page}
                  className={currentPage === page ? "active" : ""}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                <FiChevronRight />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ============================================
          PROVIDER DRAWER
      ============================================ */}

      {showDrawer && (
        <ProviderDrawer
          provider={selectedProvider}
          onClose={handleCloseDrawer}
          onStatusUpdated={handleProviderStatusUpdated}
        />
      )}
    </div>
  );
};

export default ProvidersList;
