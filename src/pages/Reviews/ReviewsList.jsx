import React, { useEffect, useState } from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiMessageSquare,
  FiRefreshCw,
  FiStar,
} from "react-icons/fi";
import Swal from "sweetalert2";

import { getAllReviews } from "../../Services/reviewsApi";

import "./ReviewsList.css";

const ReviewsList = () => {
  // ============================================
  // REVIEWS
  // ============================================

  const [reviews, setReviews] = useState([]);

  // ============================================
  // LOADING
  // ============================================

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // ============================================
  // PAGINATION
  // ============================================

  const [currentPage, setCurrentPage] = useState(1);

  const [pagination, setPagination] = useState({
    totalReviews: 0,
    currentPage: 1,
    totalPages: 1,
    limit: 10,
  });

  const limit = 10;

  // ============================================
  // FETCH REVIEWS
  // ============================================

  const fetchReviews = async (page = 1, isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await getAllReviews({
        page,
        limit,
      });

      if (response?.success) {
        setReviews(Array.isArray(response.data) ? response.data : []);

        setPagination(
          response.pagination || {
            totalReviews: response?.count || 0,
            currentPage: page,
            totalPages: 1,
            limit,
          },
        );

        setCurrentPage(response?.pagination?.currentPage || page);
      } else {
        setReviews([]);

        Swal.fire({
          icon: "error",
          title: "Unable to load reviews",
          text:
            response?.message || "Something went wrong while loading reviews.",
        });
      }
    } catch (error) {
      console.error("Reviews fetch error:", error);

      setReviews([]);

      Swal.fire({
        icon: "error",
        title: "Failed to load reviews",
        text:
          error?.response?.data?.message ||
          "Unable to fetch reviews. Please try again.",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ============================================
  // INITIAL LOAD
  // ============================================

  useEffect(() => {
    fetchReviews(1);
  }, []);

  // ============================================
  // REFRESH
  // ============================================

  const handleRefresh = () => {
    fetchReviews(currentPage, true);
  };

  // ============================================
  // PAGINATION
  // ============================================

  const handlePreviousPage = () => {
    if (currentPage <= 1) {
      return;
    }

    const newPage = currentPage - 1;

    fetchReviews(newPage);
  };

  const handleNextPage = () => {
    if (currentPage >= pagination.totalPages) {
      return;
    }

    const newPage = currentPage + 1;

    fetchReviews(newPage);
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > pagination.totalPages || page === currentPage) {
      return;
    }

    fetchReviews(page);
  };

  // ============================================
  // HELPERS
  // ============================================

  const getInitials = (name) => {
    if (!name) {
      return "U";
    }

    const words = name.trim().split(/\s+/).filter(Boolean);

    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    }

    return (
      words[0].charAt(0) + words[words.length - 1].charAt(0)
    ).toUpperCase();
  };

  const getRating = (rating) => {
    const numericRating = Number(rating);

    if (Number.isNaN(numericRating) || numericRating < 0) {
      return 0;
    }

    return Math.min(Math.round(numericRating), 5);
  };

  const getServiceName = (serviceName) => {
    if (typeof serviceName !== "string" || !serviceName.trim()) {
      return "—";
    }

    return serviceName.trim();
  };

  // ============================================
  // PAGE NUMBERS
  // ============================================

  const getPageNumbers = () => {
    const totalPages = pagination.totalPages || 1;

    const pages = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }

      return pages;
    }

    pages.push(1);

    if (currentPage > 3) {
      pages.push("...");
    }

    const start = Math.max(2, currentPage - 1);

    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push("...");
    }

    pages.push(totalPages);

    return pages;
  };

  // ============================================
  // LOADING UI
  // ============================================

  if (loading) {
    return (
      <div className="reviews-page">
        <div className="reviews-loading">
          <div className="reviews-spinner"></div>

          <p>Loading reviews...</p>
        </div>
      </div>
    );
  }

  // ============================================
  // MAIN UI
  // ============================================

  return (
    <div className="reviews-page">
      {/* ========================================
          HEADER
      ======================================== */}

      <div className="reviews-header">
        <div>
          <h2>Reviews</h2>

          <p>View customer reviews and ratings for providers.</p>
        </div>

        <button
          type="button"
          className="reviews-refresh-btn"
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <FiRefreshCw
            className={refreshing ? "reviews-refresh-spinning" : ""}
          />

          <span>{refreshing ? "Refreshing..." : "Refresh"}</span>
        </button>
      </div>

      {/* ========================================
          SUMMARY
      ======================================== */}

      <div className="reviews-summary">
        <div className="reviews-summary-icon">
          <FiMessageSquare />
        </div>

        <div className="reviews-summary-content">
          <span>Total Reviews</span>

          <strong>{pagination.totalReviews || 0}</strong>
        </div>
      </div>

      {/* ========================================
          TABLE CARD
      ======================================== */}

      <div className="reviews-table-card">
        <div className="reviews-table-wrapper">
          <table className="reviews-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Customer</th>
                <th>Provider</th>
                <th>Service</th>
                <th>Rating</th>
                <th>Review</th>
              </tr>
            </thead>

            <tbody>
              {reviews.length > 0 ? (
                reviews.map((item) => {
                  const customerName = item?.customerName || "Unknown Customer";

                  const providerName = item?.providerName || "Unknown Provider";

                  const rating = getRating(item?.rating);

                  return (
                    <tr key={item?._id || item?.bookingId}>
                      {/* ==================================
                          BOOKING ID
                      ================================== */}

                      <td>
                        <span className="review-booking-id">
                          #{item?.bookingId ?? "—"}
                        </span>
                      </td>

                      {/* ==================================
                          CUSTOMER
                      ================================== */}

                      <td>
                        <div className="review-user">
                          {item?.customerImage ? (
                            <img
                              src={item.customerImage}
                              alt={customerName}
                              className="review-user-image"
                            />
                          ) : (
                            <div className="review-user-image review-avatar-fallback">
                              {getInitials(customerName)}
                            </div>
                          )}

                          <div className="review-user-details">
                            <strong>{customerName}</strong>
                          </div>
                        </div>
                      </td>

                      {/* ==================================
                          PROVIDER
                      ================================== */}

                      <td>
                        <div className="review-user">
                          {item?.providerImage ? (
                            <img
                              src={item.providerImage}
                              alt={providerName}
                              className="review-user-image"
                            />
                          ) : (
                            <div className="review-user-image review-avatar-fallback">
                              {getInitials(providerName)}
                            </div>
                          )}

                          <div className="review-user-details">
                            <strong>{providerName}</strong>
                          </div>
                        </div>
                      </td>

                      {/* ==================================
                          SERVICE
                      ================================== */}

                      <td>
                        <span className="review-service-name">
                          {getServiceName(item?.serviceName)}
                        </span>
                      </td>

                      {/* ==================================
                          RATING
                      ================================== */}

                      <td>
                        <div
                          className="review-rating"
                          aria-label={`${rating} out of 5 stars`}
                        >
                          <div className="review-stars">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <FiStar
                                key={star}
                                className={
                                  star <= rating ? "star-filled" : "star-empty"
                                }
                              />
                            ))}
                          </div>

                          <span className="review-rating-number">
                            {item?.rating ?? 0}/5
                          </span>
                        </div>
                      </td>

                      {/* ==================================
                          REVIEW
                      ================================== */}

                      <td>
                        <div className="review-text">
                          <span>
                            {item?.review?.trim()
                              ? item.review
                              : "No review provided"}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="reviews-empty-cell">
                    <div className="reviews-empty">
                      <div className="reviews-empty-icon">
                        <FiMessageSquare />
                      </div>

                      <h4>No Reviews Found</h4>

                      <p>There are currently no reviews available.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ========================================
            PAGINATION
        ======================================== */}

        {pagination.totalPages > 1 && (
          <div className="reviews-pagination">
            <div className="reviews-pagination-info">
              Showing page <strong>{pagination.currentPage}</strong> of{" "}
              <strong>{pagination.totalPages}</strong>
              <span>({pagination.totalReviews} reviews)</span>
            </div>

            <div className="reviews-pagination-controls">
              <button
                type="button"
                className="reviews-page-arrow"
                disabled={currentPage === 1}
                onClick={handlePreviousPage}
                aria-label="Previous page"
              >
                <FiChevronLeft />
              </button>

              {getPageNumbers().map((page, index) => {
                if (page === "...") {
                  return (
                    <span
                      key={`ellipsis-${index}`}
                      className="reviews-page-ellipsis"
                    >
                      ...
                    </span>
                  );
                }

                return (
                  <button
                    type="button"
                    key={page}
                    className={`reviews-page-number ${
                      currentPage === page ? "active" : ""
                    }`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                type="button"
                className="reviews-page-arrow"
                disabled={currentPage === pagination.totalPages}
                onClick={handleNextPage}
                aria-label="Next page"
              >
                <FiChevronRight />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsList;
