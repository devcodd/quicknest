import React, { useState } from "react";
import {
  FiCreditCard,
  FiEye,
  FiEyeOff,
  FiSave,
  FiShield,
} from "react-icons/fi";
import "./PaymentGateway.css";

const initialGateways = [
  {
    id: 1,
    name: "Razorpay",
    description: "Accept payments securely through Razorpay.",
    enabled: true,
    environment: "test",
    live: {
      publicKey: "",
      secretKey: "",
    },
    test: {
      publicKey: "rzp_test_xxxxxxxxx",
      secretKey: "test_secret_xxxxxxxxx",
    },
  },
  {
    id: 2,
    name: "Stripe",
    description: "Accept card and online payments through Stripe.",
    enabled: false,
    environment: "test",
    live: {
      publicKey: "",
      secretKey: "",
    },
    test: {
      publicKey: "pk_test_xxxxxxxxx",
      secretKey: "sk_test_xxxxxxxxx",
    },
  },
  {
    id: 3,
    name: "PayPal",
    description: "Accept payments using PayPal.",
    enabled: true,
    environment: "live",
    live: {
      publicKey: "paypal_live_client_xxxxx",
      secretKey: "paypal_live_secret_xxxxx",
    },
    test: {
      publicKey: "paypal_test_client_xxxxx",
      secretKey: "paypal_test_secret_xxxxx",
    },
  },
];

const PaymentGateway = () => {
  const [gateways, setGateways] = useState(initialGateways);
  const [visibleSecrets, setVisibleSecrets] = useState({});

  const handleToggle = (id) => {
    setGateways((prev) =>
      prev.map((gateway) =>
        gateway.id === id ? { ...gateway, enabled: !gateway.enabled } : gateway,
      ),
    );
  };

  const handleEnvironmentChange = (id, environment) => {
    setGateways((prev) =>
      prev.map((gateway) =>
        gateway.id === id ? { ...gateway, environment } : gateway,
      ),
    );
  };

  const handleInputChange = (id, field, value) => {
    setGateways((prev) =>
      prev.map((gateway) => {
        if (gateway.id !== id) return gateway;

        return {
          ...gateway,
          [gateway.environment]: {
            ...gateway[gateway.environment],
            [field]: value,
          },
        };
      }),
    );
  };

  const toggleSecretVisibility = (id) => {
    setVisibleSecrets((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSave = (gateway) => {
    console.log("Gateway configuration:", gateway);

    alert(`${gateway.name} settings saved successfully.`);
  };

  return (
    <div className="payment-gateway-page">
      {/* Header */}
      <div className="payment-page-header">
        <div>
          <h2>Payment Gateway</h2>
          <p>Manage payment gateways and configure their credentials.</p>
        </div>
      </div>

      {/* Gateway List */}
      <div className="payment-gateway-list">
        {gateways.map((gateway) => {
          const currentEnvironment = gateway.environment;
          const currentCredentials = gateway[currentEnvironment];

          return (
            <div
              className={`payment-gateway-card ${
                !gateway.enabled ? "gateway-disabled" : ""
              }`}
              key={gateway.id}
            >
              {/* Gateway Header */}
              <div className="gateway-card-header">
                <div className="gateway-info">
                  <div className="gateway-icon">
                    <FiCreditCard />
                  </div>

                  <div>
                    <h3>{gateway.name}</h3>
                    <p>{gateway.description}</p>
                  </div>
                </div>

                {/* Toggle */}
                <label className="gateway-toggle">
                  <input
                    type="checkbox"
                    checked={gateway.enabled}
                    onChange={() => handleToggle(gateway.id)}
                  />

                  <span className="toggle-slider"></span>
                </label>
              </div>

              {/* Divider */}
              <div className="gateway-divider"></div>

              {/* Environment */}
              <div className="environment-section">
                <div className="environment-title">
                  <span>Environment</span>

                  {gateway.enabled && (
                    <span className="active-environment">
                      {currentEnvironment === "live"
                        ? "Live Mode"
                        : "Test Mode"}
                    </span>
                  )}
                </div>

                <div className="environment-options">
                  <label className="radio-option">
                    <input
                      type="radio"
                      name={`environment-${gateway.id}`}
                      value="live"
                      checked={gateway.environment === "live"}
                      onChange={() =>
                        handleEnvironmentChange(gateway.id, "live")
                      }
                    />

                    <span className="custom-radio"></span>

                    <span>Live</span>
                  </label>

                  <label className="radio-option">
                    <input
                      type="radio"
                      name={`environment-${gateway.id}`}
                      value="test"
                      checked={gateway.environment === "test"}
                      onChange={() =>
                        handleEnvironmentChange(gateway.id, "test")
                      }
                    />

                    <span className="custom-radio"></span>

                    <span>Test</span>
                  </label>
                </div>
              </div>

              {/* Credentials */}
              <div className="gateway-credentials">
                <div className="credential-field">
                  <label>Public Key / Client ID</label>

                  <input
                    type="text"
                    value={currentCredentials.publicKey}
                    placeholder="Enter public key"
                    disabled={!gateway.enabled}
                    onChange={(e) =>
                      handleInputChange(gateway.id, "publicKey", e.target.value)
                    }
                  />
                </div>

                <div className="credential-field">
                  <label>Secret Key / Client Secret</label>

                  <div className="secret-input-wrapper">
                    <input
                      type={visibleSecrets[gateway.id] ? "text" : "password"}
                      value={currentCredentials.secretKey}
                      placeholder="Enter secret key"
                      disabled={!gateway.enabled}
                      onChange={(e) =>
                        handleInputChange(
                          gateway.id,
                          "secretKey",
                          e.target.value,
                        )
                      }
                    />

                    <button
                      type="button"
                      className="secret-toggle-btn"
                      disabled={!gateway.enabled}
                      onClick={() => toggleSecretVisibility(gateway.id)}
                    >
                      {visibleSecrets[gateway.id] ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Security Info */}
              <div className="gateway-security-note">
                <FiShield />

                <span>
                  Credentials are securely stored and used only for payment
                  processing.
                </span>
              </div>

              {/* Footer */}
              <div className="gateway-card-footer">
                <span
                  className={`gateway-status ${
                    gateway.enabled ? "status-enabled" : "status-disabled"
                  }`}
                >
                  <span className="status-dot"></span>

                  {gateway.enabled ? "Gateway Enabled" : "Gateway Disabled"}
                </span>

                <button
                  className="save-gateway-btn"
                  onClick={() => handleSave(gateway)}
                  disabled={!gateway.enabled}
                >
                  <FiSave />
                  Save Changes
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PaymentGateway;
