import React, { useEffect, useState } from "react";
import {
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiLoader,
  FiRefreshCw,
  FiSearch,
  FiUser,
  FiUsers,
} from "react-icons/fi";

import { getAllBookings } from "../../Services/bookingApi";

import "./Bookings.css";

const Bookings = () => {
  // ============================================
  // BOOKINGS
  // ============================================

  const [bookings, setBookings] = useState([]);
  const [allBookings, setAllBookings] = useState([]);

  // ============================================
  // LOADING / ERROR
  // ============================================

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ============================================
  // PAGINATION
  // ============================================

  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(20);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    limit: 20,
    totalBookings: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  // ============================================
  // SEARCH
  // ============================================

  const [searchTerm, setSearchTerm] = useState("");

  // ============================================
  // FETCH BOOKINGS
  // ============================================

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAllBookings({
        page: 1,
        limit: 1000,
      });

      if (!response?.success) {
        throw new Error(response?.message || "Failed to fetch bookings.");
      }

      const bookingData = response?.data || [];

      setAllBookings(bookingData);

      setPagination({
        currentPage: 1,
        limit,
        totalBookings:
          response?.pagination?.totalBookings || bookingData.length,
        totalPages: response?.pagination?.totalPages || 1,
        hasNextPage: false,
        hasPreviousPage: false,
      });

      setBookings(bookingData);
    } catch (err) {
      console.error("Bookings API Error:", err);

      setBookings([]);
      setAllBookings([]);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load bookings.",
      );
    } finally {
      setLoading(false);
    }
  };
  // ============================================
  // FETCH WHEN PAGE / LIMIT CHANGES
  // ============================================

  useEffect(() => {
    fetchBookings();
  }, []);

  // ============================================
  // SEARCH
  // ============================================

  const filteredBookings = allBookings.filter((booking) => {
    const search = searchTerm.trim().toLowerCase();

    if (!search) {
      return true;
    }

    return (
      String(booking?.bookingId || "")
        .toLowerCase()
        .includes(search) ||
      String(booking?.serviceName || "")
        .toLowerCase()
        .includes(search) ||
      String(booking?.providerName || "")
        .toLowerCase()
        .includes(search) ||
      String(booking?.customerName || "")
        .toLowerCase()
        .includes(search) ||
      String(booking?.paymentStatus || "")
        .toLowerCase()
        .includes(search) ||
      String(booking?.paymentMethod || "")
        .toLowerCase()
        .includes(search) ||
      String(booking?.bookingStatus || "")
        .toLowerCase()
        .includes(search)
    );
  });

  // ============================================
  // FORMAT AMOUNT
  // ============================================

  const formatAmount = (booking) => {
    const symbol = booking?.currency?.symbol || "";
    const amount = booking?.totalAmount;

    if (amount === null || amount === undefined || amount === "") {
      return "N/A";
    }

    return `${symbol}${Number(amount).toLocaleString("en-IN")}`;
  };

  // ============================================
  // FORMAT DATE
  // ============================================

  const formatDate = (date) => {
    if (!date) {
      return "N/A";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ============================================
  // PAYMENT STATUS CLASS
  // ============================================

  const getPaymentStatusClass = (status) => {
    switch (String(status || "").toLowerCase()) {
      case "paid":
        return "status-badge success";

      case "pending":
        return "status-badge warning";

      case "failed":
        return "status-badge danger";

      case "refunded":
        return "status-badge info";

      default:
        return "status-badge neutral";
    }
  };

  // ============================================
  // BOOKING STATUS CLASS
  // ============================================

  const getBookingStatusClass = (status) => {
    switch (String(status || "").toLowerCase()) {
      case "completed":
        return "status-badge success";

      case "pending":
        return "status-badge warning";

      case "confirmed":
        return "status-badge info";

      case "cancelled":
      case "canceled":
        return "status-badge danger";

      case "rejected":
        return "status-badge danger";

      default:
        return "status-badge neutral";
    }
  };

  // ============================================
  // NEXT PAGE
  // ============================================

  const handleNextPage = () => {
    if (pagination.hasNextPage) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  // ============================================
  // PREVIOUS PAGE
  // ============================================

  const handlePreviousPage = () => {
    if (pagination.hasPreviousPage) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  // ============================================
  // LIMIT CHANGE
  // ============================================

  const handleLimitChange = (e) => {
    const newLimit = Number(e.target.value);

    setLimit(newLimit);
    setCurrentPage(1);
  };

  // ============================================
  // REFRESH
  // ============================================

  const handleRefresh = () => {
    fetchBookings();
  };

  // ============================================
  // LOADING
  // ============================================

  if (loading) {
    return (
      <div className="bookings-page">
        <div className="bookings-loading">
          <FiLoader className="bookings-loading-icon" />

          <p>Loading bookings...</p>
        </div>
      </div>
    );
  }

  // ============================================
  // UI
  // ============================================

  return (
    <div className="bookings-page">
      {/* ========================================
          HEADER
      ======================================== */}

      <div className="bookings-header">
        <div>
          <h1>
            <FiCalendar />
            Bookings
          </h1>

          <p>Manage and monitor all customer bookings.</p>
        </div>

        <button
          type="button"
          className="booking-refresh-btn"
          onClick={handleRefresh}
          disabled={loading}
        >
          <FiRefreshCw />
          Refresh
        </button>
      </div>

      {/* ========================================
          SUMMARY
      ======================================== */}

      <div className="booking-summary">
        <div className="booking-summary-card">
          <div className="summary-icon">
            <FiCalendar />
          </div>

          <div>
            <span>Total Bookings</span>

            <strong>{pagination.totalBookings}</strong>
          </div>
        </div>

        <div className="booking-summary-card">
          <div className="summary-icon">
            <FiUsers />
          </div>

          <div>
            <span>Current Page</span>

            <strong>
              {pagination.currentPage} / {pagination.totalPages || 1}
            </strong>
          </div>
        </div>
      </div>

      {/* ========================================
          ERROR
      ======================================== */}

      {error && (
        <div className="bookings-error">
          <span>{error}</span>

          <button type="button" onClick={handleRefresh}>
            Try Again
          </button>
        </div>
      )}

      {/* ========================================
          TABLE CARD
      ======================================== */}

      <div className="bookings-table-card">
        {/* TOOLBAR */}

        <div className="bookings-toolbar">
          <div className="booking-search">
            <FiSearch />

            <input
              type="text"
              placeholder="Search booking, customer, provider..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="booking-limit">
            <label>Show</label>

            <select value={limit} onChange={handleLimitChange}>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        {/* ======================================
            TABLE
        ====================================== */}

        <div className="bookings-table-wrapper">
          <table className="bookings-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Service</th>
                <th>Provider</th>
                <th>Customer</th>
                <th>Payment</th>
                <th>Method</th>
                <th>Date & Time</th>
                <th>Amount</th>
                <th>Booking Status</th>
              </tr>
            </thead>

            <tbody>
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => (
                  <tr key={booking.bookingId}>
                    {/* BOOKING ID */}

                    <td>
                      <span className="booking-id">#{booking.bookingId}</span>
                    </td>

                    {/* SERVICE */}

                    <td>
                      <div className="booking-service">
                        <span className="service-name">
                          {booking?.serviceName || "N/A"}
                        </span>
                      </div>
                    </td>

                    {/* PROVIDER */}

                    <td>
                      <div className="person-cell">
                        <div className="person-avatar">
                          <FiUser />
                        </div>

                        <span>{booking?.providerName || "N/A"}</span>
                      </div>
                    </td>

                    {/* CUSTOMER */}

                    <td>
                      <div className="person-cell">
                        <div className="person-avatar">
                          <FiUser />
                        </div>

                        <span>{booking?.customerName || "N/A"}</span>
                      </div>
                    </td>

                    {/* PAYMENT STATUS */}

                    <td>
                      <span
                        className={getPaymentStatusClass(
                          booking?.paymentStatus,
                        )}
                      >
                        {booking?.paymentStatus || "N/A"}
                      </span>
                    </td>

                    {/* PAYMENT METHOD */}

                    <td>{booking?.paymentMethod || "N/A"}</td>

                    {/* DATE & TIME */}

                    <td>
                      <div className="booking-datetime">
                        <span>{formatDate(booking?.bookingDate)}</span>

                        <small>
                          <FiClock />

                          {booking?.bookingTime || "N/A"}
                        </small>
                      </div>
                    </td>

                    {/* AMOUNT */}

                    <td>
                      <strong className="booking-amount">
                        {formatAmount(booking)}
                      </strong>
                    </td>

                    {/* BOOKING STATUS */}

                    <td>
                      <span
                        className={getBookingStatusClass(
                          booking?.bookingStatus,
                        )}
                      >
                        {booking?.bookingStatus || "N/A"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="bookings-empty">
                    {searchTerm
                      ? "No bookings found for your search."
                      : "No bookings available."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ======================================
            PAGINATION
        ====================================== */}

        <div className="bookings-pagination">
          <div className="pagination-info">
            Showing <strong>{filteredBookings.length}</strong> of{" "}
            <strong>{pagination.totalBookings}</strong> bookings
          </div>

          <div className="pagination-controls">
            <button
              type="button"
              onClick={handlePreviousPage}
              disabled={!pagination.hasPreviousPage}
            >
              <FiChevronLeft />
              Previous
            </button>

            <span className="page-number">
              Page <strong>{pagination.currentPage}</strong> of{" "}
              <strong>{pagination.totalPages || 1}</strong>
            </span>

            <button
              type="button"
              onClick={handleNextPage}
              disabled={!pagination.hasNextPage}
            >
              Next
              <FiChevronRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bookings;
