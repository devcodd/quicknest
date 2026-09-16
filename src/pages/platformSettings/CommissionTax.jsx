import React, { useEffect, useState } from "react";

import { FiCheck, FiPercent, FiSave } from "react-icons/fi";

import Swal from "sweetalert2";

import {
  getCommissionTax,
  updateCommissionTax,
} from "../../Services/platformSettingsApi";

import "./CommissionTax.css";

const CommissionTax = () => {
  // ==========================================
  // STATE
  // ==========================================

  const [commissionValue, setCommissionValue] = useState("");

  const [commissionIsActive, setCommissionIsActive] = useState(false);

  const [taxValue, setTaxValue] = useState("");

  const [taxIsActive, setTaxIsActive] = useState(false);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  // ==========================================
  // LOAD SETTINGS
  // ==========================================

  const loadSettings = async () => {
    try {
      setLoading(true);

      const response = await getCommissionTax();

      console.log("Commission Tax Response:", response);

      if (!response?.success) {
        throw new Error(
          response?.message || "Unable to load commission and tax settings.",
        );
      }

      const commission = response?.data?.commission;

      const tax = response?.data?.tax;

      // ----------------------------------------
      // COMMISSION
      // ----------------------------------------

      setCommissionValue(commission?.value ?? "");

      setCommissionIsActive(commission?.isActive ?? false);

      // ----------------------------------------
      // TAX
      // ----------------------------------------

      setTaxValue(tax?.value ?? "");

      setTaxIsActive(tax?.isActive ?? false);
    } catch (error) {
      console.error("Commission Tax Load Error:", error);

      await Swal.fire({
        icon: "error",
        title: "Unable to Load Settings",
        text:
          error?.response?.data?.message ||
          error?.message ||
          "Something went wrong while loading commission and tax settings.",
      });
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    loadSettings();
  }, []);

  // ==========================================
  // SAVE SETTINGS
  // ==========================================

  const handleSave = async () => {
    // ----------------------------------------
    // VALIDATION
    // ----------------------------------------

    if (commissionValue === "" || commissionValue === null) {
      await Swal.fire({
        icon: "warning",
        title: "Commission Required",
        text: "Please enter the commission value.",
      });

      return;
    }

    if (taxValue === "" || taxValue === null) {
      await Swal.fire({
        icon: "warning",
        title: "Tax Required",
        text: "Please enter the tax value.",
      });

      return;
    }

    if (Number(commissionValue) < 0 || Number(commissionValue) > 100) {
      await Swal.fire({
        icon: "warning",
        title: "Invalid Commission",
        text: "Commission must be between 0 and 100.",
      });

      return;
    }

    if (Number(taxValue) < 0 || Number(taxValue) > 100) {
      await Swal.fire({
        icon: "warning",
        title: "Invalid Tax",
        text: "Tax must be between 0 and 100.",
      });

      return;
    }

    try {
      setSaving(true);

      const payload = {
        commissionValue: Number(commissionValue),

        commissionIsActive: commissionIsActive,

        taxValue: Number(taxValue),

        taxIsActive: taxIsActive,
      };

      console.log("Update Commission Tax Payload:", payload);

      const response = await updateCommissionTax(payload);

      console.log("Update Commission Tax Response:", response);

      if (!response?.success) {
        throw new Error(response?.message || "Unable to update settings.");
      }

      // ----------------------------------------
      // UPDATE STATE FROM RESPONSE
      // ----------------------------------------

      if (response?.data?.commission) {
        setCommissionValue(response.data.commission.value);

        setCommissionIsActive(response.data.commission.isActive);
      }

      if (response?.data?.tax) {
        setTaxValue(response.data.tax.value);

        setTaxIsActive(response.data.tax.isActive);
      }

      await Swal.fire({
        icon: "success",
        title: "Settings Updated",
        text:
          response?.message ||
          "Commission and tax settings updated successfully.",
        timer: 1600,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Update Commission Tax Error:", error);

      await Swal.fire({
        icon: "error",
        title: "Update Failed",
        text:
          error?.response?.data?.message ||
          error?.message ||
          "Something went wrong while updating the settings.",
      });
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // LOADING STATE
  // ==========================================

  if (loading) {
    return (
      <div className="commission-tax-page">
        <div className="commission-tax-header">
          <div>
            <h1>Commission & Tax Settings</h1>

            <p>
              Manage commission and tax settings for the QuickNest platform.
            </p>
          </div>
        </div>

        <div className="commission-tax-loading">
          <div className="spinner-border text-primary" role="status" />

          <h5>Loading settings...</h5>

          <p>Please wait while we load the current settings.</p>
        </div>
      </div>
    );
  }

  // ==========================================
  // MAIN UI
  // ==========================================

  return (
    <div className="commission-tax-page">
      {/* ======================================
          PAGE HEADER
      ======================================= */}

      <div className="commission-tax-header">
        <div>
          <h1>Commission & Tax Settings</h1>

          <p>Manage commission and tax settings for the QuickNest platform.</p>
        </div>
      </div>

      {/* ======================================
          SETTINGS CARD
      ======================================= */}

      <div className="commission-tax-card">
        {/* ====================================
            COMMISSION
        ===================================== */}

        <div className="commission-tax-section">
          <div className="commission-tax-section-header">
            <div className="commission-tax-icon">
              <FiPercent />
            </div>

            <div>
              <h3>Commission</h3>

              <p>Configure the commission charged on platform services.</p>
            </div>
          </div>

          <div className="commission-tax-form-row">
            {/* Value */}

            <div className="commission-tax-field">
              <label>Commission Value</label>

              <div className="commission-tax-input-wrapper">
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={commissionValue}
                  onChange={(event) => setCommissionValue(event.target.value)}
                  placeholder="Enter commission value"
                />

                <span>%</span>
              </div>

              <small>Enter a value between 0 and 100.</small>
            </div>

            {/* Status */}

            <div className="commission-tax-status-field">
              <label>Commission Status</label>

              <div className="commission-tax-toggle-row">
                <label className="commission-tax-switch">
                  <input
                    type="checkbox"
                    checked={commissionIsActive}
                    onChange={(event) =>
                      setCommissionIsActive(event.target.checked)
                    }
                  />

                  <span className="commission-tax-slider" />
                </label>

                <span
                  className={
                    commissionIsActive
                      ? "commission-tax-status active"
                      : "commission-tax-status inactive"
                  }
                >
                  {commissionIsActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ====================================
            DIVIDER
        ===================================== */}

        <div className="commission-tax-divider" />

        {/* ====================================
            TAX
        ===================================== */}

        <div className="commission-tax-section">
          <div className="commission-tax-section-header">
            <div className="commission-tax-icon">
              <FiPercent />
            </div>

            <div>
              <h3>Tax</h3>

              <p>Configure the tax applied to platform services.</p>
            </div>
          </div>

          <div className="commission-tax-form-row">
            {/* Value */}

            <div className="commission-tax-field">
              <label>Tax Value</label>

              <div className="commission-tax-input-wrapper">
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={taxValue}
                  onChange={(event) => setTaxValue(event.target.value)}
                  placeholder="Enter tax value"
                />

                <span>%</span>
              </div>

              <small>Enter a value between 0 and 100.</small>
            </div>

            {/* Status */}

            <div className="commission-tax-status-field">
              <label>Tax Status</label>

              <div className="commission-tax-toggle-row">
                <label className="commission-tax-switch">
                  <input
                    type="checkbox"
                    checked={taxIsActive}
                    onChange={(event) => setTaxIsActive(event.target.checked)}
                  />

                  <span className="commission-tax-slider" />
                </label>

                <span
                  className={
                    taxIsActive
                      ? "commission-tax-status active"
                      : "commission-tax-status inactive"
                  }
                >
                  {taxIsActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ====================================
            ACTIONS
        ===================================== */}

        <div className="commission-tax-actions">
          <button
            type="button"
            className="commission-tax-save-btn"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? (
              <>
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                />
                Saving...
              </>
            ) : (
              <>
                <FiSave />
                Save Settings
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommissionTax;
