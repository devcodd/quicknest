import React, { useEffect, useMemo, useState } from "react";

import {
  FiEdit2,
  FiEye,
  FiPhone,
  FiSearch,
  FiTrash2,
  FiUser,
  FiUsers,
} from "react-icons/fi";

import { useNavigate } from "react-router-dom";

import Swal from "sweetalert2";

import { getAllUsers } from "../../Services/userApi";

import "./UserList.css";

const UserList = () => {
  const navigate = useNavigate();

  // ==========================================
  // STATE
  // ==========================================

  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [roleFilter, setRoleFilter] = useState("all");

  const [verificationFilter, setVerificationFilter] = useState("all");

  // ==========================================
  // GET USERS
  // ==========================================

  const loadUsers = async () => {
    try {
      setLoading(true);

      const response = await getAllUsers();

      console.log("Users Response:", response);

      if (!response?.success) {
        throw new Error(response?.message || "Unable to load users.");
      }

      setUsers(Array.isArray(response?.users) ? response.users : []);
    } catch (error) {
      console.error("Users Load Error:", error);

      await Swal.fire({
        icon: "error",
        title: "Unable to Load Users",
        text:
          error?.response?.data?.message ||
          error?.message ||
          "Something went wrong while loading users.",
      });
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    loadUsers();
  }, []);

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "-";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ==========================================
  // FORMAT PHONE
  // ==========================================

  const getPhoneNumber = (user) => {
    const countryCode = user?.phoneCountry || "";

    const phone = user?.phone || "";

    if (!countryCode && !phone) {
      return "-";
    }

    return `${countryCode} ${phone}`.trim();
  };

  // ==========================================
  // USER INITIALS
  // ==========================================

  const getInitials = (name) => {
    if (!name) {
      return "U";
    }

    const words = name.trim().split(/\s+/);

    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }

    return `${words[0][0]}${words[1][0]}`.toUpperCase();
  };

  // ==========================================
  // ROLE LABEL
  // ==========================================

  const formatRole = (role) => {
    if (!role) {
      return "-";
    }

    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  // ==========================================
  // FILTER USERS
  // ==========================================

  const filteredUsers = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return users.filter((user) => {
      // --------------------------------------
      // SEARCH
      // --------------------------------------

      const matchesSearch =
        !searchValue ||
        user?.name?.toLowerCase().includes(searchValue) ||
        user?.email?.toLowerCase().includes(searchValue) ||
        user?.phone?.toLowerCase().includes(searchValue) ||
        String(user?.userId || "")
          .toLowerCase()
          .includes(searchValue);

      // --------------------------------------
      // ROLE
      // --------------------------------------

      const matchesRole =
        roleFilter === "all" || user?.role?.toLowerCase() === roleFilter;

      // --------------------------------------
      // VERIFICATION
      // --------------------------------------

      const matchesVerification =
        verificationFilter === "all" ||
        (verificationFilter === "verified" && user?.isVerified === true) ||
        (verificationFilter === "not-verified" && user?.isVerified !== true);

      return matchesSearch && matchesRole && matchesVerification;
    });
  }, [users, search, roleFilter, verificationFilter]);

  // ==========================================
  // SUMMARY
  // ==========================================

  const totalUsers = users.length;

  const providerCount = users.filter(
    (user) => user?.role?.toLowerCase() === "provider",
  ).length;

  const customerCount = users.filter(
    (user) => user?.role?.toLowerCase() === "customer",
  ).length;

  const verifiedCount = users.filter(
    (user) => user?.isVerified === true,
  ).length;

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="user-list">
        <div className="user-list-header">
          <div>
            <h1>Users</h1>

            <p>
              Manage and monitor all registered users on the QuickNest platform.
            </p>
          </div>
        </div>

        <div className="user-list-loading">
          <div className="spinner-border text-primary" role="status" />

          <h5>Loading users...</h5>

          <p>Please wait while we load the users.</p>
        </div>
      </div>
    );
  }

  // ==========================================
  // MAIN UI
  // ==========================================

  return (
    <div className="user-list">
      {/* ======================================
          PAGE HEADER
      ======================================= */}

      <div className="user-list-header">
        <div>
          <h1>Users</h1>

          <p>
            Manage and monitor all registered users on the QuickNest platform.
          </p>
        </div>
      </div>

      {/* ======================================
          SUMMARY CARDS
      ======================================= */}

      <div className="user-summary-grid">
        {/* TOTAL */}

        <div className="user-summary-card">
          <div className="user-summary-icon total">
            <FiUsers />
          </div>

          <div>
            <span>Total Users</span>

            <strong>{totalUsers}</strong>
          </div>
        </div>

        {/* PROVIDERS */}

        <div className="user-summary-card">
          <div className="user-summary-icon provider">
            <FiUser />
          </div>

          <div>
            <span>Providers</span>

            <strong>{providerCount}</strong>
          </div>
        </div>

        {/* CUSTOMERS */}

        <div className="user-summary-card">
          <div className="user-summary-icon customer">
            <FiUser />
          </div>

          <div>
            <span>Customers</span>

            <strong>{customerCount}</strong>
          </div>
        </div>

        {/* VERIFIED */}

        <div className="user-summary-card">
          <div className="user-summary-icon verified">
            <FiUsers />
          </div>

          <div>
            <span>Verified</span>

            <strong>{verifiedCount}</strong>
          </div>
        </div>
      </div>

      {/* ======================================
          USERS CARD
      ======================================= */}

      <div className="user-table-card">
        {/* ====================================
            CARD HEADER
        ===================================== */}

        <div className="user-table-header">
          <div>
            <h3>All Users</h3>

            <p>
              {filteredUsers.length}{" "}
              {filteredUsers.length === 1 ? "user" : "users"} found
            </p>
          </div>
        </div>

        {/* ====================================
            FILTERS
        ===================================== */}

        <div className="user-filter-bar">
          {/* SEARCH */}

          <div className="user-search">
            <FiSearch />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name, email, phone..."
            />
          </div>

          {/* ROLE */}

          <select
            value={roleFilter}
            onChange={(event) => setRoleFilter(event.target.value)}
            className="user-filter-select"
          >
            <option value="all">All Roles</option>

            <option value="customer">Customer</option>

            <option value="provider">Provider</option>

            <option value="user">User</option>
          </select>

          {/* VERIFICATION */}

          <select
            value={verificationFilter}
            onChange={(event) => setVerificationFilter(event.target.value)}
            className="user-filter-select"
          >
            <option value="all">All Verification</option>

            <option value="verified">Verified</option>

            <option value="not-verified">Not Verified</option>
          </select>
        </div>

        {/* ====================================
            EMPTY SEARCH RESULT
        ===================================== */}

        {filteredUsers.length === 0 ? (
          <div className="user-empty">
            <div className="user-empty-icon">
              <FiUsers />
            </div>

            <h4>No Users Found</h4>

            <p>No users match your current search or filter.</p>
          </div>
        ) : (
          /* ==================================
             TABLE
          =================================== */

          <div className="user-table-wrapper">
            <table className="user-table">
              <thead>
                <tr>
                  <th>#</th>

                  <th>User</th>

                  <th>Email</th>

                  <th>Phone</th>

                  <th>Role</th>

                  <th>Verification</th>

                  <th>Registration</th>

                  <th>Joined</th>

                  <th className="user-actions-column">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((user, index) => {
                  const userId = user?.userId || user?._id || user?.id;

                  return (
                    <tr key={userId || `${user?.email}-${index}`}>
                      {/* NUMBER */}

                      <td>
                        <span className="user-number">{index + 1}</span>
                      </td>

                      {/* USER */}

                      <td>
                        <div className="user-info">
                          {user?.profileImage ? (
                            <img
                              src={user.profileImage}
                              alt={user?.name || "User"}
                              className="user-avatar"
                            />
                          ) : (
                            <div className="user-avatar user-avatar-placeholder">
                              {getInitials(user?.name)}
                            </div>
                          )}

                          <div className="user-name-wrapper">
                            <strong>{user?.name || "Unknown User"}</strong>

                            <span>ID: {user?.userId || "-"}</span>
                          </div>
                        </div>
                      </td>

                      {/* EMAIL */}

                      <td>
                        <span className="user-email">{user?.email || "-"}</span>
                      </td>

                      {/* PHONE */}

                      <td>
                        <span className="user-phone">
                          {getPhoneNumber(user)}
                        </span>
                      </td>

                      {/* ROLE */}

                      <td>
                        <span
                          className={`user-role-badge ${
                            user?.role?.toLowerCase() || "unknown"
                          }`}
                        >
                          {formatRole(user?.role)}
                        </span>
                      </td>

                      {/* VERIFICATION */}

                      <td>
                        <span
                          className={
                            user?.isVerified
                              ? "user-verification verified"
                              : "user-verification not-verified"
                          }
                        >
                          <span className="user-status-dot" />

                          {user?.isVerified ? "Verified" : "Not Verified"}
                        </span>
                      </td>

                      {/* REGISTRATION */}

                      <td>
                        <span className="user-registration">
                          Step {user?.registrationStep ?? "-"}
                        </span>
                      </td>

                      {/* JOINED */}

                      <td>
                        <span className="user-joined">
                          {formatDate(user?.createdAt)}
                        </span>
                      </td>

                      {/* ACTIONS */}

                      <td>
                        <div className="user-actions">
                          {/* VIEW */}

                          <button
                            type="button"
                            className="user-view-btn"
                            title="View User"
                            onClick={() => {
                              if (!userId) {
                                Swal.fire({
                                  icon: "error",
                                  title: "Invalid User",
                                  text: "User ID is missing.",
                                });

                                return;
                              }

                              navigate(`/dashboard/users/view/${userId}`);
                            }}
                          >
                            <FiEye />
                          </button>

                          {/* EDIT */}

                          <button
                            type="button"
                            className="user-edit-btn"
                            title="Edit User"
                            onClick={() => {
                              Swal.fire({
                                icon: "info",
                                title: "Edit User",
                                text: "Edit API is not connected yet.",
                              });
                            }}
                          >
                            <FiEdit2 />
                          </button>

                          {/* DELETE */}

                          <button
                            type="button"
                            className="user-delete-btn"
                            title="Delete User"
                            onClick={() => {
                              Swal.fire({
                                icon: "info",
                                title: "Delete User",
                                text: "Delete API is not connected yet.",
                              });
                            }}
                          >
                            <FiTrash2 />
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

export default UserList;
