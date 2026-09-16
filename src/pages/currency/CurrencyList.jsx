import React, { useEffect, useMemo, useState } from "react";

import {
  FiArrowLeft,
  FiCheck,
  FiChevronLeft,
  FiChevronRight,
  FiSearch,
  FiSave,
} from "react-icons/fi";

import { useNavigate } from "react-router-dom";

import Swal from "sweetalert2";

import {
  getCurrencies,
  getSelectedCurrency,
  selectCurrency,
} from "../../Services/currencyApi";

import "./CurrencyList.css";

const CurrencyList = () => {
  const navigate = useNavigate();

  // ==========================================
  // STATE
  // ==========================================

  const [currencies, setCurrencies] = useState([]);

  const [selectedCurrency, setSelectedCurrency] = useState("");

  const [savedCurrency, setSavedCurrency] = useState("");

  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const currenciesPerPage = 10;

  // ==========================================
  // LOAD CURRENCIES
  // ==========================================

  const loadCurrencies = async () => {
    try {
      setLoading(true);

      const [currenciesResponse, selectedResponse] = await Promise.all([
        getCurrencies(),
        getSelectedCurrency(),
      ]);

      console.log("Currencies Response:", currenciesResponse);

      console.log("Selected Currency Response:", selectedResponse);

      // ----------------------------------------
      // ALL CURRENCIES
      // ----------------------------------------

      if (currenciesResponse?.success) {
        setCurrencies(currenciesResponse.data || []);
      } else {
        throw new Error(
          currenciesResponse?.message || "Unable to load currencies.",
        );
      }

      // ----------------------------------------
      // SELECTED CURRENCY
      // ----------------------------------------

      const selectedCode =
        selectedResponse?.data?.code || selectedResponse?.code;

      if (selectedCode) {
        setSelectedCurrency(selectedCode);

        setSavedCurrency(selectedCode);
      }
    } catch (error) {
      console.error("Currency Load Error:", error);

      await Swal.fire({
        icon: "error",
        title: "Unable to Load Currencies",
        text:
          error?.response?.data?.message ||
          error?.message ||
          "Something went wrong while loading currencies.",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    loadCurrencies();
  }, []);

  // ==========================================
  // SEARCH
  // ==========================================

  const filteredCurrencies = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    if (!searchValue) {
      return currencies;
    }

    return currencies.filter((currency) => {
      return (
        currency.code?.toLowerCase().includes(searchValue) ||
        currency.name?.toLowerCase().includes(searchValue) ||
        currency.symbol?.toLowerCase().includes(searchValue)
      );
    });
  }, [currencies, search]);

  // ==========================================
  // PAGINATION
  // ==========================================

  const totalPages = Math.ceil(filteredCurrencies.length / currenciesPerPage);

  const startIndex = (currentPage - 1) * currenciesPerPage;

  const currentCurrencies = filteredCurrencies.slice(
    startIndex,
    startIndex + currenciesPerPage,
  );

  // ==========================================
  // SEARCH CHANGE
  // ==========================================

  const handleSearch = (event) => {
    setSearch(event.target.value);

    setCurrentPage(1);
  };

  // ==========================================
  // SELECT CURRENCY
  // ==========================================

  const handleCurrencySelect = (code) => {
    setSelectedCurrency(code);
  };

  // ==========================================
  // SAVE CURRENCY
  // ==========================================

  const handleSaveCurrency = async () => {
    // ----------------------------------------
    // VALIDATION
    // ----------------------------------------

    if (!selectedCurrency) {
      await Swal.fire({
        icon: "warning",
        title: "Select Currency",
        text: "Please select a currency first.",
      });

      return;
    }

    // ----------------------------------------
    // NO CHANGE
    // ----------------------------------------

    if (selectedCurrency === savedCurrency) {
      await Swal.fire({
        icon: "info",
        title: "No Changes",
        text: "The selected currency is already active.",
        timer: 1500,
        showConfirmButton: false,
      });

      return;
    }

    try {
      setSaving(true);

      // --------------------------------------
      // SELECT CURRENCY API
      // --------------------------------------

      const response = await selectCurrency(selectedCurrency);

      console.log("Select Currency Response:", response);

      // --------------------------------------
      // API ERROR
      // --------------------------------------

      if (!response?.success) {
        throw new Error(response?.message || "Unable to update currency.");
      }

      // --------------------------------------
      // GET SAVED CURRENCY FROM RESPONSE
      // --------------------------------------

      const selectedData =
        response?.data ||
        currencies.find((currency) => currency.code === selectedCurrency);

      const selectedCode = selectedData?.code || selectedCurrency;

      // --------------------------------------
      // UPDATE FRONTEND STATE
      // --------------------------------------

      setSelectedCurrency(selectedCode);

      setSavedCurrency(selectedCode);

      // --------------------------------------
      // SUCCESS
      // --------------------------------------

      await Swal.fire({
        icon: "success",
        title: "Currency Updated",
        text: `${
          selectedData?.name || selectedCode
        } is now the selected currency.`,
        timer: 1600,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Select Currency Error:", error);

      await Swal.fire({
        icon: "error",
        title: "Update Failed",
        text:
          error?.response?.data?.message ||
          error?.message ||
          "Something went wrong while updating the currency.",
      });
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // SELECTED CURRENCY DATA
  // ==========================================

  const selectedCurrencyData = currencies.find(
    (currency) => currency.code === selectedCurrency,
  );

  // ==========================================
  // LOADING STATE
  // ==========================================

  if (loading) {
    return (
      <div className="currency-page">
        {/* Page Header */}

        <div className="currency-page-header">
          <button
            type="button"
            className="currency-back-btn"
            onClick={() => navigate("/dashboard")}
          >
            <FiArrowLeft />
          </button>

          <div>
            <h1>Currency Management</h1>

            <p>
              Manage the default currency used across the QuickNest platform.
            </p>
          </div>
        </div>

        {/* Loading */}

        <div className="currency-loading-state">
          <div className="spinner-border text-primary" role="status" />

          <h5>Loading currencies...</h5>

          <p>Please wait while we load the currency list.</p>
        </div>
      </div>
    );
  }

  // ==========================================
  // MAIN RENDER
  // ==========================================

  return (
    <div className="currency-page">
      {/* ======================================
          PAGE HEADER
      ======================================= */}

      <div className="currency-page-header">
        <button
          type="button"
          className="currency-back-btn"
          onClick={() => navigate("/dashboard")}
        >
          <FiArrowLeft />
        </button>

        <div>
          <h1>Currency Management</h1>

          <p>Manage the default currency used across the QuickNest platform.</p>
        </div>
      </div>

      {/* ======================================
          SELECTED CURRENCY
      ======================================= */}

      <div className="currency-selected-card">
        <div className="currency-selected-heading">
          <div>
            <span className="currency-section-label">SELECTED CURRENCY</span>

            <h3>Current Platform Currency</h3>

            <p>
              This currency is currently used across the QuickNest platform.
            </p>
          </div>

          <div className="currency-selected-check">
            <FiCheck />
          </div>
        </div>

        <div className="currency-selected-info">
          <div className="currency-symbol-box">
            {selectedCurrencyData?.symbol || selectedCurrency || "-"}
          </div>

          <div className="currency-selected-details">
            <h2>{selectedCurrencyData?.name || "Currency"}</h2>

            <span>{selectedCurrencyData?.code || selectedCurrency}</span>
          </div>
        </div>
      </div>

      {/* ======================================
          ALL CURRENCIES
      ======================================= */}

      <div className="currency-list-card">
        {/* List Header */}

        <div className="currency-list-header">
          <div>
            <h3>All Currencies</h3>

            <p>Select one currency as the platform default.</p>
          </div>

          <span className="currency-count">
            {filteredCurrencies.length} currencies
          </span>
        </div>

        {/* ==================================
            SEARCH
        =================================== */}

        <div className="currency-search-wrapper">
          <FiSearch />

          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search currency by name or code..."
          />
        </div>

        {/* ==================================
            TABLE
        =================================== */}

        <div className="currency-table-wrapper">
          <table className="currency-table">
            <thead>
              <tr>
                <th>Code</th>

                <th>Currency</th>

                <th>Symbol</th>

                <th className="currency-select-column">Select</th>
              </tr>
            </thead>

            <tbody>
              {currentCurrencies.length > 0 ? (
                currentCurrencies.map((currency) => {
                  const isSelected = selectedCurrency === currency.code;

                  return (
                    <tr
                      key={currency.code}
                      className={isSelected ? "selected" : ""}
                    >
                      {/* Code */}

                      <td>
                        <span className="currency-code">{currency.code}</span>
                      </td>

                      {/* Name */}

                      <td>
                        <span className="currency-name">{currency.name}</span>
                      </td>

                      {/* Symbol */}

                      <td>
                        <span className="currency-symbol">
                          {currency.symbol}
                        </span>
                      </td>

                      {/* Radio */}

                      <td className="currency-select-column">
                        <label className="currency-radio">
                          <input
                            type="radio"
                            name="currency"
                            value={currency.code}
                            checked={isSelected}
                            onChange={() => handleCurrencySelect(currency.code)}
                          />

                          <span className="currency-radio-mark" />
                        </label>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="4" className="currency-empty">
                    <FiSearch />

                    <h4>No currencies found</h4>

                    <p>Try searching with a different name or code.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ==================================
            PAGINATION
        =================================== */}

        {filteredCurrencies.length > 0 && (
          <div className="currency-pagination">
            <span className="currency-pagination-info">
              Showing <strong>{startIndex + 1}</strong>
              {" - "}
              <strong>
                {Math.min(
                  startIndex + currenciesPerPage,
                  filteredCurrencies.length,
                )}
              </strong>
              {" of "}
              <strong>{filteredCurrencies.length}</strong>
            </span>

            <div className="currency-pagination-buttons">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((previous) => previous - 1)}
              >
                <FiChevronLeft />
                Previous
              </button>

              <span>
                Page <strong>{currentPage}</strong>
                {" of "}
                <strong>{totalPages}</strong>
              </span>

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((previous) => previous + 1)}
              >
                Next
                <FiChevronRight />
              </button>
            </div>
          </div>
        )}

        {/* ==================================
            SAVE BUTTON
        =================================== */}

        <div className="currency-actions">
          <button
            type="button"
            className="currency-save-btn"
            onClick={handleSaveCurrency}
            disabled={saving}
          >
            {saving ? (
              <>
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                />

                <span>Saving...</span>
              </>
            ) : (
              <>
                <FiSave />

                <span>Save Currency</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CurrencyList;
