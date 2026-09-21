import React, { useState } from "react";
import {
  FiX,
  FiUser,
  FiMail,
  FiPhone,
  FiCalendar,
  FiMapPin,
  FiBriefcase,
  FiClock,
  FiStar,
  FiCheckCircle,
  FiXCircle,
  FiWifi,
  FiWifiOff,
  FiShield,
  FiCreditCard,
  FiImage,
  FiFileText,
  FiEye,
  FiCheck,
  FiAlertCircle,
} from "react-icons/fi";
import Swal from "sweetalert2";

import { updateProviderStatus } from "../../Services/providerApi";

import DocumentViewer from "./DocumentViewer";

import "./ProviderDrawer.css";

const ProviderDrawer = ({ provider, onClose, onStatusUpdated }) => {
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerImages, setViewerImages] = useState([]);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [viewerTitle, setViewerTitle] = useState("");

  const [updatingStatus, setUpdatingStatus] = useState(false);

  if (!provider) return null;

  const customer = provider?.customerId || {};
  const profile = provider?.profile || {};
  const service = provider?.service || {};
  const documents = provider?.documents || {};
  const verificationDocument = documents?.verificationDocument || {};
  const bank = provider?.bank || {};

  const providerName =
    customer?.name || profile?.fullName || "Unknown Provider";

  const profileImage = customer?.profileImage;

  // ==================================================
  // HELPERS
  // ==================================================

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

  const formatPrice = (price) => {
    if (price === undefined || price === null) {
      return "—";
    }

    return `₹${Number(price).toLocaleString("en-IN")}`;
  };

  const getInitials = (name) => {
    if (!name) return "P";

    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word.charAt(0).toUpperCase())
      .join("");
  };

  const maskAccountNumber = (accountNumber) => {
    if (!accountNumber) return "—";

    const value = String(accountNumber);

    if (value.length <= 4) {
      return value;
    }

    return `${"*".repeat(value.length - 4)}${value.slice(-4)}`;
  };

  const getStatus = () => {
    if (provider?.isRejected) {
      return "rejected";
    }

    if (provider?.isApproved) {
      return "approved";
    }

    return "pending";
  };

  const status = getStatus();

  const getStatusLabel = () => {
    if (status === "approved") return "Approved";
    if (status === "rejected") return "Rejected";

    return "Pending";
  };

  // ==================================================
  // IMAGE VIEWER
  // ==================================================

  const openViewer = (images, index = 0, title = "Image Preview") => {
    if (!images?.length) return;

    setViewerImages(images);
    setViewerIndex(index);
    setViewerTitle(title);
    setViewerOpen(true);
  };

  const closeViewer = () => {
    setViewerOpen(false);
    setViewerImages([]);
    setViewerIndex(0);
    setViewerTitle("");
  };

  const handlePreviousImage = () => {
    setViewerIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNextImage = () => {
    setViewerIndex((prev) =>
      prev < viewerImages.length - 1 ? prev + 1 : prev,
    );
  };

  // ==================================================
  // APPROVE PROVIDER
  // ==================================================

  const handleApprove = async () => {
    const result = await Swal.fire({
      icon: "question",
      title: "Approve Provider?",
      text: `Are you sure you want to approve ${providerName}?`,
      showCancelButton: true,
      confirmButtonText: "Yes, Approve",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      setUpdatingStatus(true);

      const providerId = customer?.userId;

      const response = await updateProviderStatus(providerId, "approved");

      if (!response?.success) {
        throw new Error(response?.message || "Unable to approve provider.");
      }

      Swal.fire({
        icon: "success",
        title: "Provider Approved",
        text: response?.message || "Provider has been approved successfully.",
        timer: 1800,
        showConfirmButton: false,
      });

      const updatedProvider = {
        ...provider,

        isApproved: true,
        isRejected: false,
        rejectionReason: "",
      };

      if (onStatusUpdated) {
        onStatusUpdated(updatedProvider);
      }
    } catch (error) {
      console.error("Provider approval error:", error);

      Swal.fire({
        icon: "error",
        title: "Approval Failed",
        text:
          error?.response?.data?.message ||
          error?.message ||
          "Unable to approve provider.",
      });
    } finally {
      setUpdatingStatus(false);
    }
  };

  // ==================================================
  // REJECT PROVIDER
  // ==================================================

  const handleReject = async () => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Reject Provider",
      input: "textarea",
      inputLabel: "Rejection Reason",
      inputPlaceholder: "Enter the reason for rejecting this provider...",
      inputAttributes: {
        "aria-label": "Rejection reason",
      },
      inputValue: provider?.rejectionReason || "",
      showCancelButton: true,
      confirmButtonText: "Reject Provider",
      cancelButtonText: "Cancel",
      reverseButtons: true,

      inputValidator: (value) => {
        if (!value || !value.trim()) {
          return "Please enter a rejection reason.";
        }

        return undefined;
      },
    });

    if (!result.isConfirmed) return;

    const rejectionReason = result.value.trim();

    try {
      setUpdatingStatus(true);

      const providerId = customer?.userId;

      const response = await updateProviderStatus(
        providerId,
        "rejected",
        rejectionReason,
      );

      if (!response?.success) {
        throw new Error(response?.message || "Unable to reject provider.");
      }

      Swal.fire({
        icon: "success",
        title: "Provider Rejected",
        text: response?.message || "Provider has been rejected successfully.",
        timer: 1800,
        showConfirmButton: false,
      });

      const updatedProvider = {
        ...provider,

        isApproved: false,
        isRejected: true,
        rejectionReason,
      };

      if (onStatusUpdated) {
        onStatusUpdated(updatedProvider);
      }
    } catch (error) {
      console.error("Provider rejection error:", error);

      Swal.fire({
        icon: "error",
        title: "Rejection Failed",
        text:
          error?.response?.data?.message ||
          error?.message ||
          "Unable to reject provider.",
      });
    } finally {
      setUpdatingStatus(false);
    }
  };

  return (
    <>
      {/* ==================================================
          OVERLAY
      ================================================== */}

      <div className="provider-drawer-overlay" onClick={onClose} />

      {/* ==================================================
          DRAWER
      ================================================== */}

      <aside className="provider-drawer">
        {/* HEADER */}

        <div className="provider-drawer-header">
          <div>
            <h3>Provider Details</h3>

            <p>Provider ID: {customer?.userId || "—"}</p>
          </div>

          <button
            type="button"
            className="provider-drawer-close"
            onClick={onClose}
          >
            <FiX />
          </button>
        </div>

        {/* BODY */}

        <div className="provider-drawer-body">
          {/* ==================================================
              PROFILE HEADER
          ================================================== */}

          <section className="provider-profile-header">
            <div className="provider-large-avatar">
              {profileImage ? (
                <img src={profileImage} alt={providerName} />
              ) : (
                <span>{getInitials(providerName)}</span>
              )}
            </div>

            <div className="provider-profile-main">
              <h2>{providerName}</h2>

              <p>
                <FiMail />
                {customer?.email || profile?.email || "—"}
              </p>

              <div className="provider-header-statuses">
                <span className={`drawer-status-badge ${status}`}>
                  {status === "approved" && <FiCheckCircle />}

                  {status === "rejected" && <FiXCircle />}

                  {status === "pending" && <FiClock />}

                  {getStatusLabel()}
                </span>

                <span
                  className={`drawer-online-badge ${
                    provider?.isOnline ? "online" : "offline"
                  }`}
                >
                  {provider?.isOnline ? (
                    <>
                      <FiWifi />
                      Online
                    </>
                  ) : (
                    <>
                      <FiWifiOff />
                      Offline
                    </>
                  )}
                </span>
              </div>
            </div>
          </section>

          {/* ==================================================
              PROFILE
          ================================================== */}

          <section className="drawer-section">
            <div className="drawer-section-title">
              <FiUser />
              <h4>Profile Information</h4>
            </div>

            <div className="drawer-info-grid">
              <div className="drawer-info-item">
                <span>Full Name</span>
                <strong>{profile?.fullName || customer?.name || "—"}</strong>
              </div>

              <div className="drawer-info-item">
                <span>Email</span>
                <strong>{profile?.email || customer?.email || "—"}</strong>
              </div>

              <div className="drawer-info-item">
                <span>Phone</span>
                <strong>
                  {profile?.phoneCountry || customer?.phoneCountry || ""}{" "}
                  {profile?.phone || customer?.phone || "—"}
                </strong>
              </div>

              <div className="drawer-info-item">
                <span>Gender</span>
                <strong>{profile?.gender || customer?.gender || "—"}</strong>
              </div>

              <div className="drawer-info-item">
                <span>Date of Birth</span>
                <strong>{formatDate(profile?.dob || customer?.dob)}</strong>
              </div>

              <div className="drawer-info-item">
                <span>Registration Step</span>
                <strong>
                  {provider?.registrationStep ??
                    customer?.registrationStep ??
                    "—"}
                </strong>
              </div>
            </div>

            <div className="drawer-bio">
              <span>Bio</span>

              <p>{profile?.bio || "No bio provided."}</p>
            </div>
          </section>

          {/* ==================================================
              SERVICE
          ================================================== */}

          <section className="drawer-section">
            <div className="drawer-section-title">
              <FiBriefcase />
              <h4>Service Information</h4>
            </div>

            <div className="drawer-info-grid">
              <div className="drawer-info-item full">
                <span>Service Name</span>

                <strong>{service?.serviceName?.trim() || "—"}</strong>
              </div>

              <div className="drawer-info-item">
                <span>Category ID</span>

                <strong>{service?.categoryId ?? "—"}</strong>
              </div>

              <div className="drawer-info-item">
                <span>Subcategory IDs</span>

                <strong>
                  {service?.subCategoryIds?.length
                    ? service.subCategoryIds.join(", ")
                    : "—"}
                </strong>
              </div>

              <div className="drawer-info-item">
                <span>Languages</span>

                <strong>
                  {service?.languages?.length
                    ? service.languages.join(", ")
                    : "—"}
                </strong>
              </div>

              <div className="drawer-info-item">
                <span>Price</span>

                <strong className="drawer-price">
                  {formatPrice(service?.price)}
                </strong>
              </div>

              <div className="drawer-info-item">
                <span>Experience</span>

                <strong>
                  {service?.experience !== undefined
                    ? `${service.experience} Years`
                    : "—"}
                </strong>
              </div>

              <div className="drawer-info-item">
                <span>Service Radius</span>

                <strong>
                  {service?.serviceRadius !== undefined
                    ? `${service.serviceRadius} km`
                    : "—"}
                </strong>
              </div>
            </div>
          </section>

          {/* ==================================================
              LOCATION
          ================================================== */}

          <section className="drawer-section">
            <div className="drawer-section-title">
              <FiMapPin />
              <h4>Service Location</h4>
            </div>

            <div className="drawer-location">
              <FiMapPin />

              <div>
                <strong>
                  {service?.address?.address || "Address not available"}
                </strong>

                <p>
                  {[
                    service?.address?.city,
                    service?.address?.state,
                    service?.address?.pincode,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </div>
            </div>

            {service?.location?.coordinates?.length === 2 && (
              <div className="drawer-coordinates">
                <span>Coordinates</span>

                <strong>
                  {service.location.coordinates[1]},{" "}
                  {service.location.coordinates[0]}
                </strong>
              </div>
            )}
          </section>

          {/* ==================================================
              DOCUMENTS
          ================================================== */}

          <section className="drawer-section">
            <div className="drawer-section-title">
              <FiShield />
              <h4>Verification Documents</h4>
            </div>

            {/* DOCUMENT */}

            <div className="verification-document-card">
              <div
                className="verification-document-preview clickable"
                onClick={() =>
                  verificationDocument?.documentImage &&
                  openViewer(
                    [verificationDocument.documentImage],
                    0,
                    verificationDocument?.documentType ||
                      "Verification Document",
                  )
                }
              >
                {verificationDocument?.documentImage ? (
                  <img
                    src={verificationDocument.documentImage}
                    alt={
                      verificationDocument.documentType ||
                      "Verification document"
                    }
                  />
                ) : (
                  <div className="document-placeholder">
                    <FiFileText />
                    <span>No document</span>
                  </div>
                )}
              </div>

              <div className="verification-document-info">
                <div>
                  <span>Document Type</span>

                  <strong>{verificationDocument?.documentType || "—"}</strong>
                </div>

                {verificationDocument?.documentImage && (
                  <button
                    type="button"
                    className="document-view-btn"
                    onClick={() =>
                      openViewer(
                        [verificationDocument.documentImage],
                        0,
                        verificationDocument?.documentType ||
                          "Verification Document",
                      )
                    }
                  >
                    <FiEye />
                    View Document
                  </button>
                )}
              </div>
            </div>

            {/* WORK IMAGES */}

            <div className="work-images-block">
              <div className="work-images-heading">
                <div>
                  <FiImage />
                  <span>Work Images</span>
                </div>

                <small>{documents?.workImages?.length || 0} images</small>
              </div>

              {documents?.workImages?.length > 0 ? (
                <div className="work-images-grid">
                  {documents.workImages.map((image, index) => (
                    <div
                      className="work-image-item"
                      key={`${image}-${index}`}
                      onClick={() =>
                        openViewer(
                          documents.workImages,
                          index,
                          "Provider Work Images",
                        )
                      }
                    >
                      <img src={image} alt={`Work ${index + 1}`} />

                      <span>{index + 1}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-work-images">
                  <FiImage />
                  <span>No work images uploaded</span>
                </div>
              )}
            </div>
          </section>

          {/* ==================================================
              PERFORMANCE
          ================================================== */}

          <section className="drawer-section">
            <div className="drawer-section-title">
              <FiStar />
              <h4>Performance</h4>
            </div>

            <div className="performance-grid">
              <div className="performance-card">
                <FiStar />

                <strong>{provider?.averageRating ?? "0.0"}</strong>

                <span>Rating</span>
              </div>

              <div className="performance-card">
                <FiUser />

                <strong>{provider?.totalReviews ?? 0}</strong>

                <span>Reviews</span>
              </div>

              <div className="performance-card">
                <FiBriefcase />

                <strong>{provider?.totalBookings ?? 0}</strong>

                <span>Total Bookings</span>
              </div>

              <div className="performance-card">
                <FiCheckCircle />

                <strong>{provider?.completedBookings ?? 0}</strong>

                <span>Completed</span>
              </div>
            </div>
          </section>

          {/* ==================================================
              PROVIDER STATUS
          ================================================== */}

          <section className="drawer-section">
            <div className="drawer-section-title">
              <FiShield />
              <h4>Provider Status</h4>
            </div>

            <div className="status-list">
              <div className="status-list-item">
                <span>Approval Status</span>

                <strong className={`status-text ${status}`}>
                  {getStatusLabel()}
                </strong>
              </div>

              <div className="status-list-item">
                <span>Profile Completed</span>

                <strong>{provider?.profileCompleted ? "Yes" : "No"}</strong>
              </div>

              <div className="status-list-item">
                <span>Online</span>

                <strong>{provider?.isOnline ? "Yes" : "No"}</strong>
              </div>

              <div className="status-list-item">
                <span>Available</span>

                <strong>{provider?.isAvailable ? "Yes" : "No"}</strong>
              </div>

              <div className="status-list-item">
                <span>Featured</span>

                <strong>{provider?.isFeatured ? "Yes" : "No"}</strong>
              </div>
            </div>

            {/* REJECTION REASON */}

            {provider?.isRejected && provider?.rejectionReason && (
              <div className="rejection-reason-box">
                <span>
                  <FiAlertCircle />
                  Rejection Reason
                </span>

                <p>{provider.rejectionReason}</p>
              </div>
            )}

            {/* ACTION BUTTONS */}

            <div className="provider-status-actions">
              {status !== "approved" && (
                <button
                  type="button"
                  className="provider-approve-btn"
                  onClick={handleApprove}
                  disabled={updatingStatus}
                >
                  <FiCheck />

                  {updatingStatus ? "Updating..." : "Approve Provider"}
                </button>
              )}

              {status !== "rejected" && (
                <button
                  type="button"
                  className="provider-reject-btn"
                  onClick={handleReject}
                  disabled={updatingStatus}
                >
                  <FiXCircle />

                  {updatingStatus ? "Updating..." : "Reject Provider"}
                </button>
              )}
            </div>
          </section>

          {/* ==================================================
              BANK
          ================================================== */}

          <section className="drawer-section">
            <div className="drawer-section-title">
              <FiCreditCard />
              <h4>Bank Details</h4>
            </div>

            {Object.keys(bank).length > 0 ? (
              <div className="drawer-info-grid">
                <div className="drawer-info-item">
                  <span>Account Holder</span>

                  <strong>{bank?.accountHolderName || "—"}</strong>
                </div>

                <div className="drawer-info-item">
                  <span>Bank Name</span>

                  <strong>{bank?.bankName || "—"}</strong>
                </div>

                <div className="drawer-info-item">
                  <span>Account Number</span>

                  <strong>{maskAccountNumber(bank?.accountNumber)}</strong>
                </div>

                <div className="drawer-info-item">
                  <span>IFSC Code</span>

                  <strong>{bank?.ifscCode || "—"}</strong>
                </div>
              </div>
            ) : (
              <div className="no-bank-details">
                <FiCreditCard />
                <span>No bank details available</span>
              </div>
            )}
          </section>

          {/* ==================================================
              ACCOUNT INFORMATION
          ================================================== */}

          <section className="drawer-section">
            <div className="drawer-section-title">
              <FiCalendar />
              <h4>Account Information</h4>
            </div>

            <div className="drawer-info-grid">
              <div className="drawer-info-item">
                <span>Created At</span>

                <strong>{formatDate(provider?.createdAt)}</strong>
              </div>

              <div className="drawer-info-item">
                <span>Last Updated</span>

                <strong>{formatDate(provider?.updatedAt)}</strong>
              </div>
            </div>
          </section>
        </div>
      </aside>

      {/* ==================================================
          IMAGE VIEWER
      ================================================== */}

      {viewerOpen && (
        <DocumentViewer
          images={viewerImages}
          currentIndex={viewerIndex}
          title={viewerTitle}
          onClose={closeViewer}
          onPrevious={handlePreviousImage}
          onNext={handleNextImage}
        />
      )}
    </>
  );
};

export default ProviderDrawer;
