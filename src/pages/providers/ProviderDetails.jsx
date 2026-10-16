import React, { useEffect, useState } from "react";
import {
  FiArrowLeft,
  FiUser,
  FiBriefcase,
  FiFileText,
  FiStar,
  FiCreditCard,
  FiActivity,
  FiCheckCircle,
  FiXCircle,
  FiMapPin,
  FiPhone,
  FiMail,
  FiCalendar,
  FiClock,
  FiEye,
} from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../../Services/axios";
import "./ProviderDetails.css";

const ProviderDetails = () => {
  const navigate = useNavigate();
  const { userId } = useParams();

  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [featuredLoading, setFeaturedLoading] = useState(false);

  /* ============================================
     GET PROVIDER DETAILS
  ============================================ */

  const fetchProvider = async () => {
    try {
      setLoading(true);

      const response = await api.get(`/admin/providers/${userId}`);

      if (response.data?.success) {
        setProvider(response.data.data);
      } else {
        throw new Error(response.data?.message || "Failed to fetch provider");
      }
    } catch (error) {
      console.error("Provider details error:", error);

      Swal.fire({
        icon: "error",
        title: "Failed to Load Provider",
        text:
          error.response?.data?.message ||
          error.message ||
          "Unable to fetch provider details.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchProvider();
    }
  }, [userId]);

  /* ============================================
     FEATURED STATUS
  ============================================ */

  const handleFeaturedChange = async () => {
    if (!provider?.customerId?.userId) return;

    const newStatus = !provider.isFeatured;

    try {
      setFeaturedLoading(true);

      const response = await api.post("/admin/update-featured-status", {
        userId: provider.customerId.userId,
        isFeatured: newStatus,
      });

      if (response.data?.success) {
        setProvider((prev) => ({
          ...prev,
          isFeatured: newStatus,
        }));

        Swal.fire({
          icon: "success",
          title: newStatus ? "Provider Featured" : "Provider Unfeatured",
          text: newStatus
            ? "Provider has been marked as featured."
            : "Provider has been removed from featured providers.",
          timer: 1600,
          showConfirmButton: false,
        });
      } else {
        throw new Error(
          response.data?.message || "Failed to update featured status.",
        );
      }
    } catch (error) {
      console.error("Featured status error:", error);

      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text:
          error.response?.data?.message || "Unable to update featured status.",
      });
    } finally {
      setFeaturedLoading(false);
    }
  };

  /* ============================================
     HELPERS
  ============================================ */

  const getInitials = (name) => {
    if (!name) return "P";

    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase();
  };

  const formatDate = (date) => {
    if (!date) return "—";

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

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined || amount === "") {
      return "—";
    }

    return `₹${Number(amount).toLocaleString("en-IN")}`;
  };

  const getFullName = () => {
    return (
      provider?.customerId?.name ||
      provider?.profile?.fullName ||
      "Unknown Provider"
    );
  };

  const getEmail = () => {
    return provider?.customerId?.email || provider?.profile?.email || "—";
  };

  const getPhone = () => {
    const country = provider?.customerId?.phoneCountry || "";
    const phone = provider?.customerId?.phone || provider?.profile?.phone || "";

    return phone ? `${country} ${phone}`.trim() : "—";
  };

  const getProfileImage = () => {
    return provider?.customerId?.profileImage || null;
  };

  /* ============================================
     LOADING
  ============================================ */

  if (loading) {
    return (
      <div className="provider-details-page">
        <div className="provider-details-loading">
          <div className="provider-details-spinner"></div>
          <p>Loading provider details...</p>
        </div>
      </div>
    );
  }

  /* ============================================
     EMPTY
  ============================================ */

  if (!provider) {
    return (
      <div className="provider-details-page">
        <div className="provider-details-empty">
          <FiUser />

          <h3>Provider Not Found</h3>

          <p>The provider details could not be found.</p>

          <button
            type="button"
            onClick={() => navigate("/dashboard/providers")}
          >
            <FiArrowLeft />
            Back to Providers
          </button>
        </div>
      </div>
    );
  }

  const customer = provider.customerId || {};
  const profile = provider.profile || {};
  const service = provider.service || {};
  const documents = provider.documents || {};
  const bank = provider.bank || {};

  const fullName = getFullName();
  const profileImage = getProfileImage();

  /* ============================================
     RENDER
  ============================================ */

  return (
    <div className="provider-details-page">
      {/* ========================================
          BACK
      ======================================== */}

      <button
        type="button"
        className="provider-back-btn"
        onClick={() => navigate("/dashboard/providers")}
      >
        <FiArrowLeft />
        Back to Providers
      </button>

      {/* ========================================
          PROFILE HEADER
      ======================================== */}

      <div className="provider-profile-header">
        <div className="provider-profile-main">
          <div className="provider-large-avatar">
            {profileImage ? (
              <img src={profileImage} alt={fullName} />
            ) : (
              <span>{getInitials(fullName)}</span>
            )}
          </div>

          <div className="provider-profile-info">
            <div className="provider-name-row">
              <h1>{fullName}</h1>

              {customer.role && (
                <span className="provider-role-badge">{customer.role}</span>
              )}
            </div>

            <p className="provider-service-title">
              {service.serviceName || "Service not available"}
            </p>

            <div className="provider-contact-row">
              <span>
                <FiMail />
                {getEmail()}
              </span>

              <span>
                <FiPhone />
                {getPhone()}
              </span>
            </div>

            <div className="provider-status-row">
              <span
                className={`provider-status-badge ${
                  customer.isVerified ? "verified" : "not-verified"
                }`}
              >
                {customer.isVerified ? <FiCheckCircle /> : <FiXCircle />}

                {customer.isVerified ? "Verified" : "Not Verified"}
              </span>

              <span
                className={`provider-status-badge ${
                  provider.isApproved
                    ? "approved"
                    : provider.isRejected
                      ? "rejected"
                      : "pending"
                }`}
              >
                {provider.isApproved ? (
                  <FiCheckCircle />
                ) : provider.isRejected ? (
                  <FiXCircle />
                ) : (
                  <FiClock />
                )}

                {provider.isApproved
                  ? "Approved"
                  : provider.isRejected
                    ? "Rejected"
                    : "Pending"}
              </span>

              <span className="provider-rating-badge">
                <FiStar />
                {provider.averageRating ?? 0}
              </span>
            </div>
          </div>
        </div>

        {/* ======================================
            HEADER ACTIONS
        ====================================== */}

        <div className="provider-header-actions">
          <div className="provider-featured-control">
            <span>Featured</span>

            <label className="provider-toggle">
              <input
                type="checkbox"
                checked={Boolean(provider.isFeatured)}
                disabled={featuredLoading}
                onChange={handleFeaturedChange}
              />

              <span className="provider-toggle-slider"></span>
            </label>
          </div>

          {provider.isApproved ? (
            <button type="button" className="provider-reject-btn">
              <FiXCircle />
              Reject
            </button>
          ) : (
            <button type="button" className="provider-approve-btn">
              <FiCheckCircle />
              Approve
            </button>
          )}
        </div>
      </div>

      {/* ========================================
          TABS
      ======================================== */}

      <div className="provider-tabs-wrapper">
        <div className="provider-tabs">
          <button
            type="button"
            className={
              activeTab === "overview" ? "provider-tab active" : "provider-tab"
            }
            onClick={() => setActiveTab("overview")}
          >
            <FiUser />
            Overview
          </button>

          <button
            type="button"
            className={
              activeTab === "service" ? "provider-tab active" : "provider-tab"
            }
            onClick={() => setActiveTab("service")}
          >
            <FiBriefcase />
            Service
          </button>

          <button
            type="button"
            className={
              activeTab === "documents" ? "provider-tab active" : "provider-tab"
            }
            onClick={() => setActiveTab("documents")}
          >
            <FiFileText />
            Documents
          </button>

          <button
            type="button"
            className={
              activeTab === "reviews" ? "provider-tab active" : "provider-tab"
            }
            onClick={() => setActiveTab("reviews")}
          >
            <FiStar />
            Reviews
          </button>

          <button
            type="button"
            className={
              activeTab === "bank" ? "provider-tab active" : "provider-tab"
            }
            onClick={() => setActiveTab("bank")}
          >
            <FiCreditCard />
            Bank
          </button>

          <button
            type="button"
            className={
              activeTab === "activity" ? "provider-tab active" : "provider-tab"
            }
            onClick={() => setActiveTab("activity")}
          >
            <FiActivity />
            Activity
          </button>
        </div>
      </div>

      {/* ========================================
          TAB CONTENT
      ======================================== */}

      <div className="provider-tab-content">
        {/* ======================================
            OVERVIEW
        ====================================== */}

        {activeTab === "overview" && (
          <div className="provider-overview-grid">
            <div className="provider-info-card">
              <div className="provider-card-title">
                <h2>Personal Information</h2>
              </div>

              <div className="provider-info-grid">
                <div className="provider-info-item">
                  <span>Full Name</span>
                  <strong>{profile.fullName || customer.name || "—"}</strong>
                </div>

                <div className="provider-info-item">
                  <span>Email</span>
                  <strong>{getEmail()}</strong>
                </div>

                <div className="provider-info-item">
                  <span>Phone</span>
                  <strong>{getPhone()}</strong>
                </div>

                <div className="provider-info-item">
                  <span>Gender</span>
                  <strong>{profile.gender || customer.gender || "—"}</strong>
                </div>

                <div className="provider-info-item">
                  <span>Date of Birth</span>
                  <strong>{formatDate(profile.dob || customer.dob)}</strong>
                </div>

                <div className="provider-info-item">
                  <span>User ID</span>
                  <strong>{customer.userId ?? "—"}</strong>
                </div>
              </div>

              {profile.bio && (
                <div className="provider-bio">
                  <span>Bio</span>
                  <p>{profile.bio}</p>
                </div>
              )}
            </div>

            <div className="provider-info-card">
              <div className="provider-card-title">
                <h2>Provider Statistics</h2>
              </div>

              <div className="provider-stat-grid">
                <div className="provider-stat-box">
                  <strong>{provider.totalBookings ?? 0}</strong>
                  <span>Total Bookings</span>
                </div>

                <div className="provider-stat-box">
                  <strong>{provider.completedBookings ?? 0}</strong>
                  <span>Completed</span>
                </div>

                <div className="provider-stat-box">
                  <strong>{provider.totalReviews ?? 0}</strong>
                  <span>Reviews</span>
                </div>

                <div className="provider-stat-box">
                  <strong>{provider.averageRating ?? 0}</strong>
                  <span>Average Rating</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================
            SERVICE
        ====================================== */}

        {activeTab === "service" && (
          <div className="provider-info-card">
            <div className="provider-card-title">
              <h2>Service Information</h2>
            </div>

            <div className="provider-info-grid">
              <div className="provider-info-item">
                <span>Service Name</span>
                <strong>{service.serviceName || "—"}</strong>
              </div>

              <div className="provider-info-item">
                <span>Category ID</span>
                <strong>{service.categoryId ?? "—"}</strong>
              </div>

              <div className="provider-info-item">
                <span>Experience</span>
                <strong>
                  {service.experience !== undefined
                    ? `${service.experience} Years`
                    : "—"}
                </strong>
              </div>

              <div className="provider-info-item">
                <span>Service Price</span>
                <strong>{formatCurrency(service.price)}</strong>
              </div>

              <div className="provider-info-item">
                <span>Service Radius</span>
                <strong>
                  {service.serviceRadius !== undefined
                    ? `${service.serviceRadius} KM`
                    : "—"}
                </strong>
              </div>

              <div className="provider-info-item">
                <span>Sub Categories</span>
                <strong>
                  {service.subCategoryIds?.length
                    ? service.subCategoryIds.join(", ")
                    : "—"}
                </strong>
              </div>

              <div className="provider-info-item">
                <span>Languages</span>
                <strong>
                  {service.languages?.length
                    ? service.languages.join(", ")
                    : "—"}
                </strong>
              </div>
            </div>

            <div className="provider-address-section">
              <div className="provider-section-heading">
                <FiMapPin />
                <h3>Service Address</h3>
              </div>

              <div className="provider-address-grid">
                <div>
                  <span>Address</span>
                  <strong>{service.address?.address || "—"}</strong>
                </div>

                <div>
                  <span>City</span>
                  <strong>{service.address?.city || "—"}</strong>
                </div>

                <div>
                  <span>State</span>
                  <strong>{service.address?.state || "—"}</strong>
                </div>

                <div>
                  <span>Pincode</span>
                  <strong>{service.address?.pincode || "—"}</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================
            DOCUMENTS
        ====================================== */}

        {activeTab === "documents" && (
          <div className="provider-documents-wrapper">
            <div className="provider-info-card">
              <div className="provider-card-title">
                <h2>Verification Document</h2>
              </div>

              <div className="provider-document-content">
                <div className="provider-document-type">
                  <span>Document Type</span>
                  <strong>
                    {documents.verificationDocument?.documentType || "—"}
                  </strong>
                </div>

                {documents.verificationDocument?.documentImage ? (
                  <div className="provider-document-preview">
                    <img
                      src={documents.verificationDocument.documentImage}
                      alt="Verification Document"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        window.open(
                          documents.verificationDocument.documentImage,
                          "_blank",
                          "noopener,noreferrer",
                        )
                      }
                    >
                      <FiEye />
                      View Full Image
                    </button>
                  </div>
                ) : (
                  <div className="provider-no-document">
                    <FiFileText />
                    <p>No verification document uploaded.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="provider-info-card">
              <div className="provider-card-title">
                <h2>Work Images</h2>
              </div>

              {documents.workImages?.length ? (
                <div className="provider-work-images">
                  {documents.workImages.map((image, index) => (
                    <div
                      className="provider-work-image"
                      key={`${image}-${index}`}
                    >
                      <img
                        src={image}
                        alt={`Work ${index + 1}`}
                        onClick={() =>
                          window.open(image, "_blank", "noopener,noreferrer")
                        }
                      />

                      <span>Work Image {index + 1}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="provider-no-document">
                  <FiFileText />
                  <p>No work images uploaded.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ======================================
            REVIEWS
        ====================================== */}

        {activeTab === "reviews" && (
          <div className="provider-info-card">
            <div className="provider-card-title">
              <div>
                <h2>Provider Reviews</h2>
                <p>Customer reviews and ratings for this provider.</p>
              </div>

              <div className="provider-review-summary">
                <FiStar />
                <strong>{provider.averageRating ?? 0}</strong>
                <span>({provider.totalReviews ?? 0} Reviews)</span>
              </div>
            </div>

            <div className="provider-empty-tab">
              <FiStar />
              <p>Reviews will be displayed here.</p>
            </div>
          </div>
        )}

        {/* ======================================
            BANK
        ====================================== */}

        {activeTab === "bank" && (
          <div className="provider-info-card">
            <div className="provider-card-title">
              <h2>Bank Information</h2>
            </div>

            <div className="provider-info-grid">
              <div className="provider-info-item">
                <span>Account Holder Name</span>
                <strong>{bank.accountHolderName || "—"}</strong>
              </div>

              <div className="provider-info-item">
                <span>Bank Name</span>
                <strong>{bank.bankName || "—"}</strong>
              </div>

              <div className="provider-info-item">
                <span>Account Number</span>
                <strong>
                  {bank.accountNumber
                    ? `********${String(bank.accountNumber).slice(-4)}`
                    : "—"}
                </strong>
              </div>

              <div className="provider-info-item">
                <span>IFSC Code</span>
                <strong>{bank.ifscCode || "—"}</strong>
              </div>
            </div>
          </div>
        )}

        {/* ======================================
            ACTIVITY
        ====================================== */}

        {activeTab === "activity" && (
          <div className="provider-info-card">
            <div className="provider-card-title">
              <h2>Activity & Status</h2>
            </div>

            <div className="provider-info-grid">
              <div className="provider-info-item">
                <span>Registration Step</span>
                <strong>{provider.registrationStep ?? "—"}</strong>
              </div>

              <div className="provider-info-item">
                <span>Profile Completed</span>
                <strong
                  className={
                    provider.profileCompleted ? "text-success" : "text-danger"
                  }
                >
                  {provider.profileCompleted ? "Completed" : "Incomplete"}
                </strong>
              </div>

              <div className="provider-info-item">
                <span>Online Status</span>
                <strong>{provider.isOnline ? "Online" : "Offline"}</strong>
              </div>

              <div className="provider-info-item">
                <span>Availability</span>
                <strong>
                  {provider.isAvailable ? "Available" : "Unavailable"}
                </strong>
              </div>

              <div className="provider-info-item">
                <span>Featured</span>
                <strong
                  className={
                    provider.isFeatured ? "text-success" : "text-muted"
                  }
                >
                  {provider.isFeatured ? "Featured" : "Not Featured"}
                </strong>
              </div>

              <div className="provider-info-item">
                <span>Created At</span>
                <strong>{formatDate(provider.createdAt)}</strong>
              </div>

              <div className="provider-info-item">
                <span>Last Updated</span>
                <strong>{formatDate(provider.updatedAt)}</strong>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProviderDetails;
