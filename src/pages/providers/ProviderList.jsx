import React, { useMemo, useState } from "react";
import {
  FiSearch,
  FiChevronDown,
  FiPlus,
  FiEye,
  FiEdit2,
  FiTrash2,
  FiChevronLeft,
  FiChevronRight,
  FiChevronsLeft,
  FiChevronsRight,
} from "react-icons/fi";

import "./ProviderList.css";

const dummyProviders = [
  {
    id: 1,
    name: "Rahul Sharma",
    email: "rahul.sharma@example.com",
    image: "https://i.pravatar.cc/150?img=12",
    joiningDate: "12 Aug 2026",
    commission: 15,
    loginType: "Provider",
    walletBalance: 4500,
    reviews: 4.8,
    status: true,
  },
  {
    id: 2,
    name: "Amit Kumar",
    email: "amit.kumar@example.com",
    image: "https://i.pravatar.cc/150?img=11",
    joiningDate: "10 Aug 2026",
    commission: 12,
    loginType: "Provider",
    walletBalance: 6200,
    reviews: 4.6,
    status: true,
  },
  {
    id: 3,
    name: "Vikash Gupta",
    email: "vikash.gupta@example.com",
    image: "https://i.pravatar.cc/150?img=14",
    joiningDate: "08 Aug 2026",
    commission: 18,
    loginType: "Customer",
    walletBalance: 3200,
    reviews: 4.5,
    status: true,
  },
  {
    id: 4,
    name: "Rohit Kumar",
    email: "rohit.kumar@example.com",
    image: "https://i.pravatar.cc/150?img=13",
    joiningDate: "06 Aug 2026",
    commission: 15,
    loginType: "Provider",
    walletBalance: 2800,
    reviews: 4.2,
    status: false,
  },
  {
    id: 5,
    name: "Sanjay Verma",
    email: "sanjay.verma@example.com",
    image: "https://i.pravatar.cc/150?img=68",
    joiningDate: "04 Aug 2026",
    commission: 10,
    loginType: "Provider",
    walletBalance: 5100,
    reviews: 4.9,
    status: true,
  },
  {
    id: 6,
    name: "Karan Singh",
    email: "karan.singh@example.com",
    image: "https://i.pravatar.cc/150?img=15",
    joiningDate: "02 Aug 2026",
    commission: 14,
    loginType: "Customer",
    walletBalance: 1900,
    reviews: 4.3,
    status: true,
  },
  {
    id: 7,
    name: "Deepak Verma",
    email: "deepak.verma@example.com",
    image: "https://i.pravatar.cc/150?img=60",
    joiningDate: "30 Jul 2026",
    commission: 16,
    loginType: "Provider",
    walletBalance: 3900,
    reviews: 4.7,
    status: false,
  },
  {
    id: 8,
    name: "Manish Kumar",
    email: "manish.kumar@example.com",
    image: "https://i.pravatar.cc/150?img=52",
    joiningDate: "28 Jul 2026",
    commission: 13,
    loginType: "Provider",
    walletBalance: 2700,
    reviews: 4.4,
    status: true,
  },
  {
    id: 9,
    name: "Suresh Kumar",
    email: "suresh.kumar@example.com",
    image: "https://i.pravatar.cc/150?img=33",
    joiningDate: "26 Jul 2026",
    commission: 11,
    loginType: "Customer",
    walletBalance: 1800,
    reviews: 4.1,
    status: true,
  },
  {
    id: 10,
    name: "Arjun Gupta",
    email: "arjun.gupta@example.com",
    image: "https://i.pravatar.cc/150?img=56",
    joiningDate: "24 Jul 2026",
    commission: 17,
    loginType: "Provider",
    walletBalance: 7300,
    reviews: 4.8,
    status: true,
  },
  {
    id: 11,
    name: "Nitin Sharma",
    email: "nitin.sharma@example.com",
    image: "https://i.pravatar.cc/150?img=51",
    joiningDate: "22 Jul 2026",
    commission: 15,
    loginType: "Provider",
    walletBalance: 4100,
    reviews: 4.5,
    status: false,
  },
  {
    id: 12,
    name: "Pankaj Singh",
    email: "pankaj.singh@example.com",
    image: "https://i.pravatar.cc/150?img=53",
    joiningDate: "20 Jul 2026",
    commission: 12,
    loginType: "Customer",
    walletBalance: 2400,
    reviews: 4.2,
    status: true,
  },
  {
    id: 13,
    name: "Anil Kumar",
    email: "anil.kumar@example.com",
    image: "https://i.pravatar.cc/150?img=59",
    joiningDate: "18 Jul 2026",
    commission: 14,
    loginType: "Provider",
    walletBalance: 3600,
    reviews: 4.6,
    status: true,
  },
  {
    id: 14,
    name: "Rakesh Verma",
    email: "rakesh.verma@example.com",
    image: "https://i.pravatar.cc/150?img=57",
    joiningDate: "16 Jul 2026",
    commission: 16,
    loginType: "Provider",
    walletBalance: 5200,
    reviews: 4.9,
    status: true,
  },
  {
    id: 15,
    name: "Vivek Sharma",
    email: "vivek.sharma@example.com",
    image: "https://i.pravatar.cc/150?img=58",
    joiningDate: "14 Jul 2026",
    commission: 13,
    loginType: "Customer",
    walletBalance: 1500,
    reviews: 4.0,
    status: false,
  },
  {
    id: 16,
    name: "Mohit Gupta",
    email: "mohit.gupta@example.com",
    image: "https://i.pravatar.cc/150?img=61",
    joiningDate: "12 Jul 2026",
    commission: 15,
    loginType: "Provider",
    walletBalance: 4600,
    reviews: 4.7,
    status: true,
  },
];

const ProviderList = () => {
  const [providers, setProviders] = useState(dummyProviders);

  const [searchTerm, setSearchTerm] = useState("");

  const [statusFilter, setStatusFilter] = useState("all");

  const [loginTypeFilter, setLoginTypeFilter] = useState("all");

  const [selectedProviders, setSelectedProviders] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);

  const [rowsPerPage, setRowsPerPage] = useState(10);

  // ==================================================
  // FILTER PROVIDERS
  // ==================================================

  const filteredProviders = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return providers.filter((provider) => {
      const matchesSearch =
        !search ||
        provider.name.toLowerCase().includes(search) ||
        provider.email.toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && provider.status) ||
        (statusFilter === "inactive" && !provider.status);

      const matchesLoginType =
        loginTypeFilter === "all" ||
        provider.loginType.toLowerCase() === loginTypeFilter;

      return matchesSearch && matchesStatus && matchesLoginType;
    });
  }, [providers, searchTerm, statusFilter, loginTypeFilter]);

  // ==================================================
  // PAGINATION
  // ==================================================

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProviders.length / rowsPerPage),
  );

  const startIndex = (currentPage - 1) * rowsPerPage;

  const currentProviders = filteredProviders.slice(
    startIndex,
    startIndex + rowsPerPage,
  );

  // ==================================================
  // SELECT ALL
  // ==================================================

  const isAllSelected =
    currentProviders.length > 0 &&
    currentProviders.every((provider) =>
      selectedProviders.includes(provider.id),
    );

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const currentIds = currentProviders.map((provider) => provider.id);

      setSelectedProviders((previous) => [
        ...new Set([...previous, ...currentIds]),
      ]);
    } else {
      const currentIds = currentProviders.map((provider) => provider.id);

      setSelectedProviders((previous) =>
        previous.filter((id) => !currentIds.includes(id)),
      );
    }
  };

  // ==================================================
  // INDIVIDUAL SELECTION
  // ==================================================

  const handleSelectProvider = (providerId) => {
    setSelectedProviders((previous) =>
      previous.includes(providerId)
        ? previous.filter((id) => id !== providerId)
        : [...previous, providerId],
    );
  };

  // ==================================================
  // STATUS TOGGLE
  // ==================================================

  const handleStatusToggle = (providerId) => {
    setProviders((previous) =>
      previous.map((provider) =>
        provider.id === providerId
          ? {
              ...provider,
              status: !provider.status,
            }
          : provider,
      ),
    );
  };

  // ==================================================
  // CLEAR FILTERS
  // ==================================================

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setLoginTypeFilter("all");
    setCurrentPage(1);
    setSelectedProviders([]);
  };

  // ==================================================
  // SEARCH
  // ==================================================

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
    setSelectedProviders([]);
  };

  // ==================================================
  // FILTER CHANGE
  // ==================================================

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
    setCurrentPage(1);
    setSelectedProviders([]);
  };

  const handleLoginTypeFilterChange = (event) => {
    setLoginTypeFilter(event.target.value);
    setCurrentPage(1);
    setSelectedProviders([]);
  };

  // ==================================================
  // DELETE
  // ==================================================

  const handleDelete = (provider) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${provider.name}?`,
    );

    if (!confirmed) return;

    setProviders((previous) =>
      previous.filter((item) => item.id !== provider.id),
    );

    setSelectedProviders((previous) =>
      previous.filter((id) => id !== provider.id),
    );

    const newTotalPages = Math.max(
      1,
      Math.ceil((filteredProviders.length - 1) / rowsPerPage),
    );

    if (currentPage > newTotalPages) {
      setCurrentPage(newTotalPages);
    }
  };

  // ==================================================
  // ACTIONS
  // ==================================================

  const handleView = (provider) => {
    console.log("View Provider:", provider);
  };

  const handleEdit = (provider) => {
    console.log("Edit Provider:", provider);
  };

  const handleAddProvider = () => {
    console.log("Add Provider");
  };

  // ==================================================
  // PAGINATION
  // ==================================================

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;

    setCurrentPage(page);
    setSelectedProviders([]);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(Number(event.target.value));
    setCurrentPage(1);
    setSelectedProviders([]);
  };

  // ==================================================
  // CURRENCY
  // ==================================================

  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  return (
    <div className="provider-list-page container-fluid px-0">
      {/* ==========================================
          PAGE HEADER
      =========================================== */}

      <div className="provider-list-header">
        <h1>Provider List</h1>

        <button
          type="button"
          className="add-provider-btn"
          onClick={handleAddProvider}
        >
          <FiPlus />
          <span>Add Provider</span>
        </button>
      </div>

      {/* ==========================================
          FILTERS
      =========================================== */}

      <div className="provider-filter-row">
        {/* Search */}

        <div className="provider-search">
          <FiSearch />

          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search Provider by Name.."
          />
        </div>

        {/* Status */}

        <div className="provider-filter-group">
          <label>Status</label>

          <div className="provider-select-wrapper">
            <select value={statusFilter} onChange={handleStatusFilterChange}>
              <option value="all">All Status</option>

              <option value="active">Active</option>

              <option value="inactive">Inactive</option>
            </select>

            <FiChevronDown />
          </div>
        </div>

        {/* Login Type */}

        <div className="provider-filter-group login-filter">
          <label>Login Type</label>

          <div className="provider-select-wrapper">
            <select
              value={loginTypeFilter}
              onChange={handleLoginTypeFilterChange}
            >
              <option value="all">All</option>

              <option value="provider">Provider</option>

              <option value="customer">Customer</option>
            </select>

            <FiChevronDown />
          </div>
        </div>

        {/* Clear */}

        <button
          type="button"
          className="clear-provider-filter"
          onClick={handleClearFilters}
        >
          Clear All
        </button>
      </div>

      {/* ==========================================
          TABLE
      =========================================== */}

      <div className="provider-table-wrapper">
        <div className="table-responsive">
          <table className="table provider-table mb-0">
            <thead>
              <tr>
                <th className="provider-checkbox-column">
                  <input
                    type="checkbox"
                    className="provider-checkbox"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                  />
                </th>

                <th>Provider</th>

                <th>Joining Date</th>

                <th>Commission</th>

                <th>Login Type</th>

                <th>Wallet Balance</th>

                <th>Reviews</th>

                <th>Status</th>

                <th className="text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {currentProviders.length > 0 ? (
                currentProviders.map((provider) => (
                  <tr key={provider.id}>
                    {/* Checkbox */}

                    <td>
                      <input
                        type="checkbox"
                        className="provider-checkbox"
                        checked={selectedProviders.includes(provider.id)}
                        onChange={() => handleSelectProvider(provider.id)}
                      />
                    </td>

                    {/* Provider */}

                    <td>
                      <div className="provider-profile">
                        <img
                          src={provider.image}
                          alt={provider.name}
                          className="provider-avatar"
                        />

                        <div className="provider-profile-info">
                          <span className="provider-name">{provider.name}</span>

                          <span className="provider-email">
                            {provider.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Joining Date */}

                    <td>{provider.joiningDate}</td>

                    {/* Commission */}

                    <td>
                      <span className="provider-commission">
                        {provider.commission}%
                      </span>
                    </td>

                    {/* Login Type */}

                    <td>
                      <span
                        className={`provider-login-badge ${provider.loginType.toLowerCase()}`}
                      >
                        {provider.loginType}
                      </span>
                    </td>

                    {/* Wallet */}

                    <td>
                      <span className="provider-wallet">
                        {formatCurrency(provider.walletBalance)}
                      </span>
                    </td>

                    {/* Reviews */}

                    <td>
                      <div className="provider-review">
                        <span className="review-star">★</span>

                        <span>{provider.reviews}</span>
                      </div>
                    </td>

                    {/* Status */}

                    <td>
                      <div className="provider-status-wrapper">
                        <label className="provider-status-switch">
                          <input
                            type="checkbox"
                            checked={provider.status}
                            onChange={() => handleStatusToggle(provider.id)}
                          />

                          <span className="provider-status-slider" />
                        </label>

                        <span
                          className={
                            provider.status
                              ? "provider-status-text active"
                              : "provider-status-text inactive"
                          }
                        >
                          {provider.status ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}

                    <td>
                      <div className="provider-actions">
                        <button
                          type="button"
                          className="provider-action-btn view"
                          title="View"
                          onClick={() => handleView(provider)}
                        >
                          <FiEye />
                        </button>

                        <button
                          type="button"
                          className="provider-action-btn edit"
                          title="Edit"
                          onClick={() => handleEdit(provider)}
                        >
                          <FiEdit2 />
                        </button>

                        <button
                          type="button"
                          className="provider-action-btn delete"
                          title="Delete"
                          onClick={() => handleDelete(provider)}
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9">
                    <div className="providers-empty-state">
                      <div className="providers-empty-icon">
                        <FiSearch />
                      </div>

                      <h5>No providers found</h5>

                      <p>Try adjusting your filters or search criteria</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ==========================================
          PAGINATION
      =========================================== */}

      <div className="provider-pagination-wrapper">
        <div className="provider-rows-per-page">
          <span>Rows per page:</span>

          <select
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            className="provider-rows-select"
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>

        <div className="provider-pagination">
          <span className="provider-page-info">
            Page {currentPage} of {totalPages}
          </span>

          <button
            type="button"
            className="provider-pagination-btn"
            disabled={currentPage === 1}
            onClick={() => goToPage(1)}
          >
            <FiChevronsLeft />
          </button>

          <button
            type="button"
            className="provider-pagination-btn"
            disabled={currentPage === 1}
            onClick={() => goToPage(currentPage - 1)}
          >
            <FiChevronLeft />
          </button>

          <button type="button" className="provider-pagination-btn active">
            {currentPage}
          </button>

          <button
            type="button"
            className="provider-pagination-btn"
            disabled={currentPage === totalPages}
            onClick={() => goToPage(currentPage + 1)}
          >
            <FiChevronRight />
          </button>

          <button
            type="button"
            className="provider-pagination-btn"
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

export default ProviderList;
