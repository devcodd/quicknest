import React, { useMemo, useState } from "react";
import {
  FiShoppingCart,
  FiCheckCircle,
  FiRotateCcw,
  FiXCircle,
  FiEye,
  FiEdit2,
  FiTrash2,
  FiChevronLeft,
  FiChevronRight,
  FiChevronsLeft,
  FiChevronsRight,
} from "react-icons/fi";

import "./OrderList.css";

// --------------------------------------------------
// Dummy Order Data
// Later this will come from Axios/API
// --------------------------------------------------
const dummyOrders = [
  {
    id: "ORD-1001",
    customer: "Rahul Sharma",
    items: 3,
    amount: 1250,
    status: "Completed",
    createdDate: "12 Aug 2026",
    dueDate: "15 Aug 2026",
  },
  {
    id: "ORD-1002",
    customer: "Priya Singh",
    items: 2,
    amount: 850,
    status: "Pending",
    createdDate: "11 Aug 2026",
    dueDate: "14 Aug 2026",
  },
  {
    id: "ORD-1003",
    customer: "Amit Kumar",
    items: 5,
    amount: 2400,
    status: "Cancelled",
    createdDate: "10 Aug 2026",
    dueDate: "13 Aug 2026",
  },
  {
    id: "ORD-1004",
    customer: "Neha Verma",
    items: 1,
    amount: 650,
    status: "Completed",
    createdDate: "09 Aug 2026",
    dueDate: "12 Aug 2026",
  },
  {
    id: "ORD-1005",
    customer: "Vikash Gupta",
    items: 4,
    amount: 1850,
    status: "Refunded",
    createdDate: "08 Aug 2026",
    dueDate: "11 Aug 2026",
  },
  {
    id: "ORD-1006",
    customer: "Anjali Singh",
    items: 2,
    amount: 920,
    status: "Completed",
    createdDate: "07 Aug 2026",
    dueDate: "10 Aug 2026",
  },
  {
    id: "ORD-1007",
    customer: "Rohit Kumar",
    items: 6,
    amount: 3200,
    status: "Pending",
    createdDate: "06 Aug 2026",
    dueDate: "09 Aug 2026",
  },
  {
    id: "ORD-1008",
    customer: "Pooja Sharma",
    items: 3,
    amount: 1450,
    status: "Completed",
    createdDate: "05 Aug 2026",
    dueDate: "08 Aug 2026",
  },
  {
    id: "ORD-1009",
    customer: "Sanjay Verma",
    items: 2,
    amount: 780,
    status: "Refunded",
    createdDate: "04 Aug 2026",
    dueDate: "07 Aug 2026",
  },
  {
    id: "ORD-1010",
    customer: "Karan Singh",
    items: 5,
    amount: 2750,
    status: "Completed",
    createdDate: "03 Aug 2026",
    dueDate: "06 Aug 2026",
  },
  {
    id: "ORD-1011",
    customer: "Sneha Gupta",
    items: 2,
    amount: 1100,
    status: "Cancelled",
    createdDate: "02 Aug 2026",
    dueDate: "05 Aug 2026",
  },
  {
    id: "ORD-1012",
    customer: "Manish Kumar",
    items: 4,
    amount: 2100,
    status: "Completed",
    createdDate: "01 Aug 2026",
    dueDate: "04 Aug 2026",
  },
  {
    id: "ORD-1013",
    customer: "Riya Sharma",
    items: 3,
    amount: 1350,
    status: "Pending",
    createdDate: "31 Jul 2026",
    dueDate: "03 Aug 2026",
  },
  {
    id: "ORD-1014",
    customer: "Deepak Verma",
    items: 1,
    amount: 550,
    status: "Completed",
    createdDate: "30 Jul 2026",
    dueDate: "02 Aug 2026",
  },
  {
    id: "ORD-1015",
    customer: "Nisha Singh",
    items: 4,
    amount: 1950,
    status: "Refunded",
    createdDate: "29 Jul 2026",
    dueDate: "01 Aug 2026",
  },
];

// --------------------------------------------------
// Stat Card
// --------------------------------------------------
const StatCard = ({ icon, title, value, type }) => {
  return (
    <div className="col-12 col-sm-6 col-xl-3">
      <div className="order-stat-card">
        <div className={`order-stat-icon ${type}`}>{icon}</div>

        <div className="order-stat-content">
          <div className="order-stat-title">{title}</div>

          <div className="order-stat-value">{value}</div>

          <div className="order-stat-growth">
            <span>▲</span> 0%
          </div>
        </div>
      </div>
    </div>
  );
};

// --------------------------------------------------
// Main Component
// --------------------------------------------------
const OrderList = () => {
  const [orders, setOrders] = useState(dummyOrders);

  const [currentPage, setCurrentPage] = useState(1);

  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [selectedOrders, setSelectedOrders] = useState([]);

  // ------------------------------------------------
  // Statistics
  // ------------------------------------------------
  const totalOrders = orders.length;

  const completedOrders = orders.filter(
    (order) => order.status === "Completed",
  ).length;

  const refundedOrders = orders.filter(
    (order) => order.status === "Refunded",
  ).length;

  const cancelledOrders = orders.filter(
    (order) => order.status === "Cancelled",
  ).length;

  // ------------------------------------------------
  // Pagination
  // ------------------------------------------------
  const totalPages = Math.max(1, Math.ceil(orders.length / rowsPerPage));

  const startIndex = (currentPage - 1) * rowsPerPage;

  const endIndex = startIndex + rowsPerPage;

  const currentOrders = useMemo(() => {
    return orders.slice(startIndex, endIndex);
  }, [orders, startIndex, endIndex]);

  // ------------------------------------------------
  // Select All
  // ------------------------------------------------
  const isAllSelected =
    currentOrders.length > 0 &&
    currentOrders.every((order) => selectedOrders.includes(order.id));

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const currentIds = currentOrders.map((order) => order.id);

      setSelectedOrders((previous) => [
        ...new Set([...previous, ...currentIds]),
      ]);
    } else {
      const currentIds = currentOrders.map((order) => order.id);

      setSelectedOrders((previous) =>
        previous.filter((id) => !currentIds.includes(id)),
      );
    }
  };

  // ------------------------------------------------
  // Individual Selection
  // ------------------------------------------------
  const handleSelectOrder = (orderId) => {
    setSelectedOrders((previous) =>
      previous.includes(orderId)
        ? previous.filter((id) => id !== orderId)
        : [...previous, orderId],
    );
  };

  // ------------------------------------------------
  // Rows Per Page
  // ------------------------------------------------
  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(Number(event.target.value));
    setCurrentPage(1);
    setSelectedOrders([]);
  };

  // ------------------------------------------------
  // Pagination
  // ------------------------------------------------
  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;

    setCurrentPage(page);
    setSelectedOrders([]);
  };

  // ------------------------------------------------
  // Actions
  // ------------------------------------------------
  const handleView = (order) => {
    console.log("View Order:", order);
  };

  const handleEdit = (order) => {
    console.log("Edit Order:", order);
  };

  const handleDelete = (order) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${order.id}?`,
    );

    if (!confirmed) return;

    setOrders((previous) => previous.filter((item) => item.id !== order.id));

    setSelectedOrders((previous) => previous.filter((id) => id !== order.id));

    // Keep pagination valid after deletion
    const newTotalPages = Math.max(
      1,
      Math.ceil((orders.length - 1) / rowsPerPage),
    );

    if (currentPage > newTotalPages) {
      setCurrentPage(newTotalPages);
    }
  };

  // ------------------------------------------------
  // Format Amount
  // ------------------------------------------------
  const formatAmount = (amount) => {
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  return (
    <div className="order-list-page container-fluid px-0">
      {/* ==========================================
          STATISTICS
      =========================================== */}
      <div className="row g-3 mb-4">
        <StatCard
          icon={<FiShoppingCart />}
          title="Total Orders"
          value={totalOrders}
          type="total"
        />

        <StatCard
          icon={<FiCheckCircle />}
          title="Completed Orders"
          value={completedOrders}
          type="completed"
        />

        <StatCard
          icon={<FiRotateCcw />}
          title="Refunded Orders"
          value={refundedOrders}
          type="refunded"
        />

        <StatCard
          icon={<FiXCircle />}
          title="Cancelled Orders"
          value={cancelledOrders}
          type="cancelled"
        />
      </div>

      {/* ==========================================
          ORDER TABLE
      =========================================== */}
      <div className="order-table-wrapper">
        <div className="table-responsive">
          <table className="table order-table mb-0">
            <thead>
              <tr>
                <th className="order-checkbox-column">
                  <input
                    type="checkbox"
                    className="order-checkbox"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    aria-label="Select all orders"
                  />
                </th>

                <th>Order ID</th>

                <th>Customer</th>

                <th>Items</th>

                <th>Amount</th>

                <th>Created Date</th>

                <th>Due Date</th>

                <th className="text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {currentOrders.length > 0 ? (
                currentOrders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <input
                        type="checkbox"
                        className="order-checkbox"
                        checked={selectedOrders.includes(order.id)}
                        onChange={() => handleSelectOrder(order.id)}
                        aria-label={`Select ${order.id}`}
                      />
                    </td>

                    <td>
                      <span className="order-id">{order.id}</span>
                    </td>

                    <td>
                      <span className="customer-name">{order.customer}</span>
                    </td>

                    <td>{order.items}</td>

                    <td>
                      <span className="order-amount">
                        {formatAmount(order.amount)}
                      </span>
                    </td>

                    <td>{order.createdDate}</td>

                    <td>{order.dueDate}</td>

                    <td>
                      <div className="order-actions">
                        <button
                          type="button"
                          className="order-action-btn view"
                          title="View"
                          onClick={() => handleView(order)}
                        >
                          <FiEye />
                        </button>

                        <button
                          type="button"
                          className="order-action-btn edit"
                          title="Edit"
                          onClick={() => handleEdit(order)}
                        >
                          <FiEdit2 />
                        </button>

                        <button
                          type="button"
                          className="order-action-btn delete"
                          title="Delete"
                          onClick={() => handleDelete(order)}
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8">
                    <div className="order-empty-state">
                      <div className="order-empty-icon">
                        <FiShoppingCart />
                      </div>

                      <h5>No orders found</h5>

                      <p>Try adjusting your search criteria</p>
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
      <div className="order-pagination-wrapper">
        {/* Rows Per Page */}
        <div className="rows-per-page">
          <span>Rows per page:</span>

          <select
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            className="rows-select"
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>

        {/* Pagination */}
        <div className="order-pagination">
          <span className="page-info">
            Page {currentPage} of {totalPages}
          </span>

          <button
            type="button"
            className="pagination-btn"
            disabled={currentPage === 1}
            onClick={() => goToPage(1)}
            title="First page"
          >
            <FiChevronsLeft />
          </button>

          <button
            type="button"
            className="pagination-btn"
            disabled={currentPage === 1}
            onClick={() => goToPage(currentPage - 1)}
            title="Previous page"
          >
            <FiChevronLeft />
          </button>

          <button type="button" className="pagination-btn active">
            {currentPage}
          </button>

          <button
            type="button"
            className="pagination-btn"
            disabled={currentPage === totalPages}
            onClick={() => goToPage(currentPage + 1)}
            title="Next page"
          >
            <FiChevronRight />
          </button>

          <button
            type="button"
            className="pagination-btn"
            disabled={currentPage === totalPages}
            onClick={() => goToPage(totalPages)}
            title="Last page"
          >
            <FiChevronsRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderList;
