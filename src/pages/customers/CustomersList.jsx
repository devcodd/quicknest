import React, { useEffect, useRef, useState } from "react";
import {
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiEye,
  FiMail,
  FiPhone,
  FiRefreshCw,
  FiSearch,
  FiUser,
  FiX,
} from "react-icons/fi";
import Swal from "sweetalert2";

import { getAllCustomers } from "../../Services/customerApi";

import "./CustomersList.css";

const CustomersList = () => {
  // =========================================================
  // STATES
  // =========================================================

  const [customers, setCustomers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searching, setSearching] = useState(false);

  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);

  const limit = 10;

  const [pagination, setPagination] = useState({
    currentPage: 1,
    perPage: 10,
    totalCustomers: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [showCustomerModal, setShowCustomerModal] = useState(false);

  const firstSearchRender = useRef(true);

  // =========================================================
  // FETCH CUSTOMERS
  // =========================================================

  const fetchCustomers = async ({
    currentPage = 1,
    searchValue = "",
    requestType = "normal",
  } = {}) => {
    try {
      if (requestType === "initial") {
        setLoading(true);
      } else if (requestType === "refresh") {
        setRefreshing(true);
      } else if (requestType === "search") {
        setSearching(true);
      }

      const response = await getAllCustomers({
        search: searchValue.trim(),
        page: currentPage,
        limit,
      });

      if (response?.success) {
        const customerData = Array.isArray(response.customers)
          ? response.customers
          : [];

        setCustomers(customerData);

        if (response.pagination) {
          setPagination(response.pagination);
        } else {
          setPagination({
            currentPage,
            perPage: limit,
            totalCustomers: customerData.length,
            totalPages: 1,
            hasNextPage: false,
            hasPreviousPage: false,
          });
        }
      } else {
        setCustomers([]);

        Swal.fire({
          icon: "error",
          title: "Unable to load customers",
          text:
            response?.message ||
            "Something went wrong while loading customers.",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Customers API Error:", error);

      setCustomers([]);

      Swal.fire({
        icon: "error",
        title: "Failed to load customers",
        text:
          error?.response?.data?.message ||
          error?.message ||
          "Unable to fetch customers.",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
      setSearching(false);
    }
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    fetchCustomers({
      currentPage: 1,
      searchValue: "",
      requestType: "initial",
    });
  }, []);

  // =========================================================
  // DEBOUNCED SEARCH
  // =========================================================

  useEffect(() => {
    if (firstSearchRender.current) {
      firstSearchRender.current = false;
      return;
    }

    const timer = setTimeout(() => {
      fetchCustomers({
        currentPage: 1,
        searchValue: search,
        requestType: "search",
      });
    }, 400);

    return () => {
      clearTimeout(timer);
    };
  }, [search]);

  // =========================================================
  // SEARCH
  // =========================================================

  const handleSearch = (event) => {
    setSearch(event.target.value);
    setPage(1);
  };

  // =========================================================
  // CLEAR SEARCH
  // =========================================================

  const handleClearSearch = () => {
    setSearch("");
    setPage(1);
  };

  // =========================================================
  // REFRESH
  // =========================================================

  const handleRefresh = () => {
    fetchCustomers({
      currentPage: page,
      searchValue: search,
      requestType: "refresh",
    });
  };

  // =========================================================
  // PREVIOUS PAGE
  // =========================================================

  const handlePreviousPage = () => {
    if (!pagination.hasPreviousPage) {
      return;
    }

    const previousPage = page - 1;

    if (previousPage < 1) {
      return;
    }

    setPage(previousPage);

    fetchCustomers({
      currentPage: previousPage,
      searchValue: search,
      requestType: "normal",
    });
  };

  // =========================================================
  // NEXT PAGE
  // =========================================================

  const handleNextPage = () => {
    if (!pagination.hasNextPage) {
      return;
    }

    const nextPage = page + 1;

    if (pagination.totalPages && nextPage > pagination.totalPages) {
      return;
    }

    setPage(nextPage);

    fetchCustomers({
      currentPage: nextPage,
      searchValue: search,
      requestType: "normal",
    });
  };

  // =========================================================
  // VIEW CUSTOMER
  // =========================================================

  const handleViewCustomer = (customer) => {
    setSelectedCustomer(customer);
    setShowCustomerModal(true);
  };

  // =========================================================
  // CLOSE CUSTOMER MODAL
  // =========================================================

  const handleCloseCustomerModal = () => {
    setShowCustomerModal(false);
    setSelectedCustomer(null);
  };

  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "—";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =========================================================
  // FORMAT DATE + TIME
  // =========================================================

  const formatDateTime = (date) => {
    if (!date) {
      return "—";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "—";
    }

    return parsedDate.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // =========================================================
  // FORMAT PHONE
  // =========================================================

  const formatPhone = (customer) => {
    if (!customer?.phone) {
      return "—";
    }

    return `${customer.phoneCountry || ""} ${customer.phone}`.trim();
  };

  // =========================================================
  // CUSTOMER INITIALS
  // =========================================================

  const getInitials = (name) => {
    if (!name) {
      return "CU";
    }

    const words = name.trim().split(/\s+/).filter(Boolean);

    if (words.length === 1) {
      return words[0].slice(0, 2).toUpperCase();
    }

    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  };

  // =========================================================
  // PAGINATION NUMBERS
  // =========================================================

  const getStartNumber = () => {
    if (!customers.length || !pagination.totalCustomers) {
      return 0;
    }

    return (pagination.currentPage - 1) * pagination.perPage + 1;
  };

  const getEndNumber = () => {
    if (!customers.length || !pagination.totalCustomers) {
      return 0;
    }

    return Math.min(
      pagination.currentPage * pagination.perPage,
      pagination.totalCustomers,
    );
  };

  // =========================================================
  // INITIAL LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="customer-page">
        <div className="customer-loading">
          <div className="customer-spinner"></div>

          <p>Loading customers...</p>
        </div>
      </div>
    );
  }

  // =========================================================
  // MAIN UI
  // =========================================================

  return (
    <div className="customer-page">
      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="customer-page-header">
        <div className="customer-heading">
          <div className="customer-heading-icon">
            <FiUser />
          </div>

          <div>
            <h1>Customers</h1>

            <p>Manage and view all registered customers.</p>
          </div>
        </div>

        <button
          type="button"
          className="customer-refresh-btn"
          onClick={handleRefresh}
          disabled={refreshing || searching}
        >
          <FiRefreshCw className={refreshing ? "customer-spin" : ""} />

          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* =====================================================
          SUMMARY
      ===================================================== */}

      <div className="customer-summary">
        <div className="customer-summary-icon">
          <FiUser />
        </div>

        <div>
          <span>Total Customers</span>

          <strong>{pagination.totalCustomers}</strong>
        </div>
      </div>

      {/* =====================================================
          SEARCH CARD
      ===================================================== */}

      <div className="customer-filter-card">
        <div className="customer-search">
          <FiSearch />

          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search by name, email or phone..."
          />

          {search && (
            <button
              type="button"
              className="customer-search-clear"
              onClick={handleClearSearch}
              title="Clear search"
            >
              <FiX />
            </button>
          )}
        </div>

        {searching && (
          <div className="customer-searching">
            <span className="customer-small-spinner"></span>
            Searching...
          </div>
        )}
      </div>

      {/* =====================================================
          TABLE CARD
      ===================================================== */}

      <div className="customer-table-card">
        <div className="customer-table-header">
          <div>
            <h2>Customer List</h2>

            <span>
              Showing {customers.length} of {pagination.totalCustomers}{" "}
              customers
            </span>
          </div>
        </div>

        {/* ===================================================
            EMPTY STATE
        =================================================== */}

        {customers.length === 0 ? (
          <div className="customer-empty">
            <div className="customer-empty-icon">
              <FiUser />
            </div>

            <h3>{search ? "No customers found" : "No customers available"}</h3>

            <p>
              {search
                ? "Try searching with a different name, email or phone number."
                : "There are currently no customers to display."}
            </p>

            {search && (
              <button
                type="button"
                className="customer-clear-search-btn"
                onClick={handleClearSearch}
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          /* =================================================
             CUSTOMER TABLE
          ================================================= */

          <div className="customer-table-wrapper">
            <table className="customer-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Customer</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Gender</th>
                  <th>Is Verified</th>
                  <th>Registered</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {customers.map((customer, index) => (
                  <tr key={customer._id}>
                    {/* # */}

                    <td>
                      <span className="customer-index">
                        {getStartNumber() + index}
                      </span>
                    </td>

                    {/* CUSTOMER */}

                    <td>
                      <div className="customer-info">
                        {customer.profileImage ? (
                          <img
                            src={customer.profileImage}
                            alt={customer.name || "Customer"}
                            className="customer-avatar-image"
                            onError={(event) => {
                              event.currentTarget.style.display = "none";

                              const fallback =
                                event.currentTarget.nextElementSibling;

                              if (fallback) {
                                fallback.style.display = "flex";
                              }
                            }}
                          />
                        ) : null}

                        <div
                          className="customer-avatar"
                          style={{
                            display: customer.profileImage ? "none" : "flex",
                          }}
                        >
                          {getInitials(customer.name)}
                        </div>

                        <div className="customer-name-wrapper">
                          <strong>{customer.name || "Unknown Customer"}</strong>

                          <span>ID: {customer.userId ?? "—"}</span>
                        </div>
                      </div>
                    </td>

                    {/* EMAIL */}

                    <td>
                      <div className="customer-contact">
                        <FiMail />

                        <span title={customer.email || ""}>
                          {customer.email || "—"}
                        </span>
                      </div>
                    </td>

                    {/* PHONE */}

                    <td>
                      <div className="customer-contact">
                        <FiPhone />

                        <span>{formatPhone(customer)}</span>
                      </div>
                    </td>

                    {/* ROLE */}

                    <td>
                      <span
                        className={`customer-role ${
                          customer.role
                            ? customer.role.toLowerCase().replace(/\s+/g, "-")
                            : ""
                        }`}
                      >
                        {customer.role || "—"}
                      </span>
                    </td>

                    {/* GENDER */}

                    <td>
                      <span className="customer-gender">
                        {customer.gender || "—"}
                      </span>
                    </td>

                    {/* IS VERIFIED */}

                    <td>
                      <span
                        className={
                          customer.isVerified
                            ? "customer-verified verified"
                            : "customer-verified unverified"
                        }
                      >
                        <span className="customer-status-dot"></span>

                        {customer.isVerified ? "Yes" : "No"}
                      </span>
                    </td>

                    {/* REGISTERED */}

                    <td>
                      <div className="customer-date-wrapper">
                        <FiCalendar />

                        <span className="customer-date">
                          {formatDate(customer.createdAt)}
                        </span>
                      </div>
                    </td>

                    {/* ACTION */}

                    <td>
                      <button
                        type="button"
                        className="customer-view-btn"
                        onClick={() => handleViewCustomer(customer)}
                        title="View Customer"
                      >
                        <FiEye />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* =====================================================
          PAGINATION
      ===================================================== */}

      {customers.length > 0 && pagination.totalPages > 0 && (
        <div className="customer-pagination">
          <div className="customer-pagination-info">
            Showing <strong>{getStartNumber()}</strong>
            {" - "}
            <strong>{getEndNumber()}</strong>
            {" of "}
            <strong>{pagination.totalCustomers}</strong>
          </div>

          <div className="customer-pagination-controls">
            <button
              type="button"
              className="customer-pagination-btn"
              onClick={handlePreviousPage}
              disabled={!pagination.hasPreviousPage || searching}
              title="Previous page"
            >
              <FiChevronLeft />
            </button>

            <span className="customer-current-page">
              Page <strong>{pagination.currentPage}</strong>
              {" of "}
              <strong>{pagination.totalPages}</strong>
            </span>

            <button
              type="button"
              className="customer-pagination-btn"
              onClick={handleNextPage}
              disabled={!pagination.hasNextPage || searching}
              title="Next page"
            >
              <FiChevronRight />
            </button>
          </div>
        </div>
      )}

      {/* =====================================================
          CUSTOMER DETAILS MODAL
      ===================================================== */}

      {showCustomerModal && selectedCustomer && (
        <div
          className="customer-modal-overlay"
          onClick={handleCloseCustomerModal}
        >
          <div
            className="customer-modal"
            onClick={(event) => event.stopPropagation()}
          >
            {/* MODAL HEADER */}

            <div className="customer-modal-header">
              <div>
                <h2>Customer Details</h2>

                <p>Complete customer information</p>
              </div>

              <button
                type="button"
                className="customer-modal-close"
                onClick={handleCloseCustomerModal}
                title="Close"
              >
                <FiX />
              </button>
            </div>

            {/* MODAL BODY */}

            <div className="customer-modal-body">
              {/* PROFILE */}

              <div className="customer-modal-profile">
                {selectedCustomer.profileImage ? (
                  <img
                    src={selectedCustomer.profileImage}
                    alt={selectedCustomer.name || "Customer"}
                    className="customer-modal-avatar"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";

                      const fallback = event.currentTarget.nextElementSibling;

                      if (fallback) {
                        fallback.style.display = "flex";
                      }
                    }}
                  />
                ) : null}

                <div
                  className="customer-modal-avatar customer-modal-avatar-fallback"
                  style={{
                    display: selectedCustomer.profileImage ? "none" : "flex",
                  }}
                >
                  {getInitials(selectedCustomer.name)}
                </div>

                <div className="customer-modal-profile-info">
                  <h3>{selectedCustomer.name || "Unknown Customer"}</h3>

                  <span>Customer ID: {selectedCustomer.userId ?? "—"}</span>
                </div>
              </div>

              {/* DETAILS */}

              <div className="customer-details-grid">
                {/* EMAIL */}

                <div className="customer-detail-item">
                  <span className="customer-detail-label">
                    <FiMail />
                    Email
                  </span>

                  <strong>{selectedCustomer.email || "—"}</strong>
                </div>

                {/* PHONE */}

                <div className="customer-detail-item">
                  <span className="customer-detail-label">
                    <FiPhone />
                    Phone
                  </span>

                  <strong>{formatPhone(selectedCustomer)}</strong>
                </div>

                {/* ROLE */}

                <div className="customer-detail-item">
                  <span className="customer-detail-label">Role</span>

                  <span className="customer-role">
                    {selectedCustomer.role || "—"}
                  </span>
                </div>

                {/* VERIFIED */}

                <div className="customer-detail-item">
                  <span className="customer-detail-label">Is Verified</span>

                  <span
                    className={
                      selectedCustomer.isVerified
                        ? "customer-verified verified"
                        : "customer-verified unverified"
                    }
                  >
                    <span className="customer-status-dot"></span>

                    {selectedCustomer.isVerified ? "Yes" : "No"}
                  </span>
                </div>

                {/* GENDER */}

                <div className="customer-detail-item">
                  <span className="customer-detail-label">Gender</span>

                  <strong>{selectedCustomer.gender || "—"}</strong>
                </div>

                {/* DOB */}

                <div className="customer-detail-item">
                  <span className="customer-detail-label">Date of Birth</span>

                  <strong>{formatDate(selectedCustomer.dob)}</strong>
                </div>

                {/* REGISTRATION STEP */}

                <div className="customer-detail-item">
                  <span className="customer-detail-label">
                    Registration Step
                  </span>

                  <strong>{selectedCustomer.registrationStep ?? "—"}</strong>
                </div>

                {/* CREATED */}

                <div className="customer-detail-item">
                  <span className="customer-detail-label">
                    <FiCalendar />
                    Created At
                  </span>

                  <strong>{formatDateTime(selectedCustomer.createdAt)}</strong>
                </div>

                {/* UPDATED */}

                <div className="customer-detail-item">
                  <span className="customer-detail-label">Last Updated</span>

                  <strong>{formatDateTime(selectedCustomer.updatedAt)}</strong>
                </div>
              </div>
            </div>

            {/* MODAL FOOTER */}

            <div className="customer-modal-footer">
              <button
                type="button"
                className="customer-modal-cancel"
                onClick={handleCloseCustomerModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomersList;
