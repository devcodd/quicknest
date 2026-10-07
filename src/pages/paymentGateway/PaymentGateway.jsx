import React, { useEffect, useState } from "react";
import {
  FiCreditCard,
  FiEye,
  FiEyeOff,
  FiSave,
  FiShield,
  FiLoader,
} from "react-icons/fi";
import Swal from "sweetalert2";

import {
  getStripeConfig,
  saveStripeConfig,
  updateStripeMode,
  updateStripeStatus,
} from "../../Services/paymentGatewayApi";

import "./PaymentGateway.css";

const PaymentGateway = () => {
  // ============================================
  // STRIPE STATUS
  // ============================================

  const [isActive, setIsActive] = useState(false);

  // ============================================
  // SELECTED MODE
  // Empty by default
  // ============================================

  const [selectedMode, setSelectedMode] = useState("");

  // ============================================
  // TEST CREDENTIALS
  // ============================================

  const [testCredentials, setTestCredentials] = useState({
    publishableKey: "",
    secretKey: "",
    webhookSecret: "",
  });

  // ============================================
  // LIVE CREDENTIALS
  // ============================================

  const [liveCredentials, setLiveCredentials] = useState({
    publishableKey: "",
    secretKey: "",
    webhookSecret: "",
  });

  // ============================================
  // LOADING STATES
  // ============================================

  const [loading, setLoading] = useState(true);
  const [savingMode, setSavingMode] = useState("");
  const [changingStatus, setChangingStatus] = useState(false);

  // ============================================
  // PASSWORD VISIBILITY
  // ============================================

  const [showTestSecret, setShowTestSecret] = useState(false);
  const [showTestWebhook, setShowTestWebhook] = useState(false);

  const [showLiveSecret, setShowLiveSecret] = useState(false);
  const [showLiveWebhook, setShowLiveWebhook] = useState(false);

  // ============================================
  // GET RESPONSE DATA
  // ============================================

  const getApiData = (response) => {
    if (response?.data) {
      return response.data;
    }

    return response;
  };

  // ============================================
  // FETCH STRIPE CONFIGURATION
  // ============================================

  const fetchStripeConfig = async () => {
    try {
      setLoading(true);

      const response = await getStripeConfig();

      const data = getApiData(response);

      console.log("Stripe GET Response:", data);

      setIsActive(Boolean(data?.isActive ?? data?.active ?? false));

      setSelectedMode(data?.activeMode || "");

      if (data?.test) {
        setTestCredentials({
          publishableKey: data.test.publishableKey || "",
          secretKey: data.test.secretKey || "",
          webhookSecret: data.test.webhookSecret || "",
        });
      }

      if (data?.live) {
        setLiveCredentials({
          publishableKey: data.live.publishableKey || "",
          secretKey: data.live.secretKey || "",
          webhookSecret: data.live.webhookSecret || "",
        });
      }

      /*
       * If API returns one credential object
       * with mode, put it into the corresponding
       * form.
       */

      if (data?.mode === "test" && !data?.test) {
        setTestCredentials({
          publishableKey: data?.publishableKey || "",
          secretKey: data?.secretKey || "",
          webhookSecret: data?.webhookSecret || "",
        });
      }

      if (data?.mode === "live" && !data?.live) {
        setLiveCredentials({
          publishableKey: data?.publishableKey || "",
          secretKey: data?.secretKey || "",
          webhookSecret: data?.webhookSecret || "",
        });
      }

      /*
       * Important:
       * We intentionally DON'T set selectedMode
       * from API.
       *
       * It remains empty until admin explicitly
       * selects Test or Live.
       */
    } catch (error) {
      console.error("Failed to fetch Stripe configuration:", error);

      Swal.fire({
        icon: "error",
        title: "Unable to Load Stripe",
        text:
          error?.response?.data?.message ||
          "Failed to load Stripe configuration.",
      });
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // INITIAL LOAD
  // ============================================

  useEffect(() => {
    fetchStripeConfig();
  }, []);

  // ============================================
  // TEST INPUT CHANGE
  // ============================================

  const handleTestChange = (field, value) => {
    setTestCredentials((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // ============================================
  // LIVE INPUT CHANGE
  // ============================================

  const handleLiveChange = (field, value) => {
    setLiveCredentials((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // ============================================
  // MODE SELECTION
  // ============================================

  const handleModeSelection = (mode) => {
    setSelectedMode(mode);
  };

  // ============================================
  // ENABLE / DISABLE STRIPE
  // ============================================

  const handleStatusChange = async () => {
    const newStatus = !isActive;

    const result = await Swal.fire({
      icon: newStatus ? "question" : "warning",
      title: newStatus ? "Enable Stripe?" : "Disable Stripe?",
      text: newStatus
        ? "Stripe will be enabled for payments."
        : "Stripe will be disabled and unavailable for payments.",
      showCancelButton: true,
      confirmButtonText: newStatus ? "Yes, Enable" : "Yes, Disable",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      setChangingStatus(true);

      const response = await updateStripeStatus(newStatus);

      if (response?.success === false) {
        throw new Error(response?.message || "Failed to update Stripe status.");
      }

      setIsActive(newStatus);

      await Swal.fire({
        icon: "success",
        title: newStatus ? "Stripe Enabled" : "Stripe Disabled",
        text: newStatus
          ? "Stripe payment gateway has been enabled."
          : "Stripe payment gateway has been disabled.",
        timer: 1600,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Stripe status update error:", error);

      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text:
          error?.response?.data?.message ||
          error?.message ||
          "Failed to update Stripe status.",
      });
    } finally {
      setChangingStatus(false);
    }
  };

  // ============================================
  // SAVE TEST CREDENTIALS
  // ============================================

  const handleSaveTest = async () => {
    if (!testCredentials.publishableKey.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Publishable Key Required",
        text: "Please enter the Test Publishable Key.",
      });

      return;
    }

    if (!testCredentials.secretKey.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Secret Key Required",
        text: "Please enter the Test Secret Key.",
      });

      return;
    }

    if (!testCredentials.webhookSecret.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Webhook Secret Required",
        text: "Please enter the Test Webhook Secret.",
      });

      return;
    }

    const result = await Swal.fire({
      icon: "question",
      title: "Save Test Credentials?",
      text: "These Stripe credentials will be saved in Test Mode.",
      showCancelButton: true,
      confirmButtonText: "Yes, Save",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      setSavingMode("test");

      const payload = {
        mode: "test",
        publishableKey: testCredentials.publishableKey.trim(),
        secretKey: testCredentials.secretKey.trim(),
        webhookSecret: testCredentials.webhookSecret.trim(),
      };

      console.log("Stripe Test POST Payload:", payload);

      const response = await saveStripeConfig(payload);

      if (response?.success === false) {
        throw new Error(
          response?.message || "Failed to save Test credentials.",
        );
      }

      await Swal.fire({
        icon: "success",
        title: "Test Credentials Saved",
        text: "Stripe Test Mode credentials have been saved successfully.",
        timer: 1800,
        showConfirmButton: false,
      });

      await fetchStripeConfig();
    } catch (error) {
      console.error("Test credentials save error:", error);

      Swal.fire({
        icon: "error",
        title: "Save Failed",
        text:
          error?.response?.data?.message ||
          error?.message ||
          "Failed to save Test credentials.",
      });
    } finally {
      setSavingMode("");
    }
  };

  // ============================================
  // SAVE LIVE CREDENTIALS
  // ============================================

  const handleSaveLive = async () => {
    if (!liveCredentials.publishableKey.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Publishable Key Required",
        text: "Please enter the Live Publishable Key.",
      });

      return;
    }

    if (!liveCredentials.secretKey.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Secret Key Required",
        text: "Please enter the Live Secret Key.",
      });

      return;
    }

    if (!liveCredentials.webhookSecret.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Webhook Secret Required",
        text: "Please enter the Live Webhook Secret.",
      });

      return;
    }

    const result = await Swal.fire({
      icon: "warning",
      title: "Save Live Credentials?",
      text: "These are production Stripe credentials. Make sure they are correct.",
      showCancelButton: true,
      confirmButtonText: "Yes, Save",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      setSavingMode("live");

      const payload = {
        mode: "live",
        publishableKey: liveCredentials.publishableKey.trim(),
        secretKey: liveCredentials.secretKey.trim(),
        webhookSecret: liveCredentials.webhookSecret.trim(),
      };

      console.log("Stripe Live POST Payload:", payload);

      const response = await saveStripeConfig(payload);

      if (response?.success === false) {
        throw new Error(
          response?.message || "Failed to save Live credentials.",
        );
      }

      await Swal.fire({
        icon: "success",
        title: "Live Credentials Saved",
        text: "Stripe Live Mode credentials have been saved successfully.",
        timer: 1800,
        showConfirmButton: false,
      });

      await fetchStripeConfig();
    } catch (error) {
      console.error("Live credentials save error:", error);

      Swal.fire({
        icon: "error",
        title: "Save Failed",
        text:
          error?.response?.data?.message ||
          error?.message ||
          "Failed to save Live credentials.",
      });
    } finally {
      setSavingMode("");
    }
  };

  // ============================================
  // LOADING
  // ============================================

  if (loading) {
    return (
      <div className="payment-gateway-page">
        <div className="payment-loading">
          <FiLoader className="payment-loading-icon" />

          <p>Loading Stripe configuration...</p>
        </div>
      </div>
    );
  }

  // ============================================
  // UI
  // ============================================

  return (
    <div className="payment-gateway-page">
      {/* ========================================
          HEADER
      ======================================== */}

      <div className="payment-page-header">
        <div>
          <h1>
            <FiCreditCard />
            Payment Gateway
          </h1>

          <p>Configure Stripe payment gateway settings for your platform.</p>
        </div>
      </div>

      {/* ========================================
          STRIPE CARD
      ======================================== */}

      <div className="payment-gateway-card">
        {/* CARD HEADER */}

        <div className="gateway-card-header">
          <div className="gateway-title-section">
            <div className="gateway-icon">
              <FiCreditCard />
            </div>

            <div>
              <h2>Stripe</h2>

              <p>Secure online payments through Stripe.</p>
            </div>
          </div>

          {/* STATUS */}

          <div className="gateway-status">
            <span
              className={
                isActive ? "status-label active" : "status-label inactive"
              }
            >
              {isActive ? "Enabled" : "Disabled"}
            </span>

            <button
              type="button"
              className={`gateway-toggle ${isActive ? "active" : ""}`}
              onClick={handleStatusChange}
              disabled={changingStatus}
            >
              <span className="toggle-circle">
                {changingStatus && <FiLoader className="toggle-spinner" />}
              </span>
            </button>
          </div>
        </div>

        {/* CARD BODY */}

        <div className="gateway-card-body">
          {/* ======================================
              MODE SELECTION
          ====================================== */}

          <div className="gateway-section mode-selection-section">
            <div className="section-heading">
              <div>
                <h3>Active Payment Mode</h3>

                <p>Select the Stripe mode you want to use for payments.</p>
              </div>
            </div>

            <div className="mode-radio-container">
              {/* TEST */}

              <label
                className={`mode-radio-card ${
                  selectedMode === "test" ? "selected" : ""
                }`}
              >
                <input
                  type="radio"
                  name="stripeMode"
                  checked={selectedMode === "test"}
                  onChange={() => handleModeSelection("test")}
                  disabled={!isActive}
                />

                <div className="mode-radio-content">
                  <strong>Test Mode</strong>

                  <span>Use test credentials for development and testing.</span>
                </div>
              </label>

              {/* LIVE */}

              <label
                className={`mode-radio-card ${
                  selectedMode === "live" ? "selected" : ""
                }`}
              >
                <input
                  type="radio"
                  name="stripeMode"
                  checked={selectedMode === "live"}
                  onChange={() => handleModeSelection("live")}
                  disabled={!isActive}
                />

                <div className="mode-radio-content">
                  <strong>Live Mode</strong>

                  <span>
                    Use real Stripe credentials for production payments.
                  </span>
                </div>
              </label>
            </div>

            {!selectedMode && (
              <div className="mode-help-text">
                Select Test or Live Mode to activate that payment environment.
              </div>
            )}
          </div>

          {/* ======================================
              SECURITY NOTICE
          ====================================== */}

          <div className="gateway-security-notice">
            <FiShield />

            <div>
              <strong>Secure Credentials</strong>

              <p>
                Keep your Stripe secret credentials private. Never expose them
                in frontend code or public repositories.
              </p>
            </div>
          </div>

          {/* ======================================
              TEST CREDENTIALS
          ====================================== */}

          <div className="gateway-section credential-section">
            <div className="credential-section-header">
              <div>
                <span className="credential-badge test">TEST</span>

                <h3>Test Credentials</h3>

                <p>Configure Stripe credentials for development and testing.</p>
              </div>
            </div>

            <div className="credentials-grid">
              {/* PUBLISHABLE KEY */}

              <div className="form-group">
                <label>Publishable Key</label>

                <input
                  type="text"
                  value={testCredentials.publishableKey}
                  onChange={(e) =>
                    handleTestChange("publishableKey", e.target.value)
                  }
                  placeholder="pk_test_xxxxxxxxx"
                  disabled={!isActive}
                />
              </div>

              {/* SECRET KEY */}

              <div className="form-group">
                <label>Secret Key</label>

                <div className="password-input-wrapper">
                  <input
                    type={showTestSecret ? "text" : "password"}
                    value={testCredentials.secretKey}
                    onChange={(e) =>
                      handleTestChange("secretKey", e.target.value)
                    }
                    placeholder="sk_test_xxxxxxxxx"
                    disabled={!isActive}
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowTestSecret((prev) => !prev)}
                    disabled={!isActive}
                  >
                    {showTestSecret ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              {/* WEBHOOK SECRET */}

              <div className="form-group">
                <label>Webhook Secret</label>

                <div className="password-input-wrapper">
                  <input
                    type={showTestWebhook ? "text" : "password"}
                    value={testCredentials.webhookSecret}
                    onChange={(e) =>
                      handleTestChange("webhookSecret", e.target.value)
                    }
                    placeholder="whsec_test_xxxxxxxxx"
                    disabled={!isActive}
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowTestWebhook((prev) => !prev)}
                    disabled={!isActive}
                  >
                    {showTestWebhook ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>
            </div>

            {/* TEST SAVE BUTTON */}

            <div className="credential-save-area">
              <button
                type="button"
                className="save-gateway-btn test-save-btn"
                onClick={handleSaveTest}
                disabled={!isActive || savingMode === "test"}
              >
                {savingMode === "test" ? (
                  <>
                    <FiLoader className="button-spinner" />
                    Saving Test Credentials...
                  </>
                ) : (
                  <>
                    <FiSave />
                    Save Test Credentials
                  </>
                )}
              </button>
            </div>
          </div>

          {/* ======================================
              LIVE CREDENTIALS
          ====================================== */}

          <div className="gateway-section credential-section live-credential-section">
            <div className="credential-section-header">
              <div>
                <span className="credential-badge live">LIVE</span>

                <h3>Live Credentials</h3>

                <p>
                  Configure Stripe credentials for real production payments.
                </p>
              </div>
            </div>

            <div className="credentials-grid">
              {/* PUBLISHABLE KEY */}

              <div className="form-group">
                <label>Publishable Key</label>

                <input
                  type="text"
                  value={liveCredentials.publishableKey}
                  onChange={(e) =>
                    handleLiveChange("publishableKey", e.target.value)
                  }
                  placeholder="pk_live_xxxxxxxxx"
                  disabled={!isActive}
                />
              </div>

              {/* SECRET KEY */}

              <div className="form-group">
                <label>Secret Key</label>

                <div className="password-input-wrapper">
                  <input
                    type={showLiveSecret ? "text" : "password"}
                    value={liveCredentials.secretKey}
                    onChange={(e) =>
                      handleLiveChange("secretKey", e.target.value)
                    }
                    placeholder="sk_live_xxxxxxxxx"
                    disabled={!isActive}
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowLiveSecret((prev) => !prev)}
                    disabled={!isActive}
                  >
                    {showLiveSecret ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              {/* WEBHOOK SECRET */}

              <div className="form-group">
                <label>Webhook Secret</label>

                <div className="password-input-wrapper">
                  <input
                    type={showLiveWebhook ? "text" : "password"}
                    value={liveCredentials.webhookSecret}
                    onChange={(e) =>
                      handleLiveChange("webhookSecret", e.target.value)
                    }
                    placeholder="whsec_live_xxxxxxxxx"
                    disabled={!isActive}
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowLiveWebhook((prev) => !prev)}
                    disabled={!isActive}
                  >
                    {showLiveWebhook ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>
            </div>

            {/* LIVE SAVE BUTTON */}

            <div className="credential-save-area">
              <button
                type="button"
                className="save-gateway-btn live-save-btn"
                onClick={handleSaveLive}
                disabled={!isActive || savingMode === "live"}
              >
                {savingMode === "live" ? (
                  <>
                    <FiLoader className="button-spinner" />
                    Saving Live Credentials...
                  </>
                ) : (
                  <>
                    <FiSave />
                    Save Live Credentials
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentGateway;
