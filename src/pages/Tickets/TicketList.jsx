import React, { useEffect, useMemo, useState } from "react";
import {
  FiCheckCircle,
  FiClock,
  FiEye,
  FiMessageSquare,
  FiRefreshCw,
  FiSearch,
  FiHelpCircle,
  FiX,
  FiUser,
} from "react-icons/fi";
import Swal from "sweetalert2";

import {
  closeTicket,
  getAllTickets,
  getTicketChat,
  replyToTicket,
} from "../../Services/ticketApi";

import "./TicketList.css";

const TicketList = () => {
  // ==========================================
  // STATES
  // ==========================================

  const [tickets, setTickets] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  // Selected ticket
  const [selectedTicket, setSelectedTicket] = useState(null);

  // View / Chat modal
  const [showViewModal, setShowViewModal] = useState(false);

  // Chat
  const [chatMessages, setChatMessages] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);

  // Reply modal
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");
  const [replyLoading, setReplyLoading] = useState(false);

  // Closing ticket
  const [closingId, setClosingId] = useState(null);

  // ==========================================
  // FETCH ALL TICKETS
  // ==========================================

  const fetchTickets = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await getAllTickets();

      if (response?.success) {
        setTickets(Array.isArray(response.data) ? response.data : []);
      } else {
        setTickets([]);

        Swal.fire({
          icon: "error",
          title: "Unable to load tickets",
          text: response?.message || "Something went wrong.",
        });
      }
    } catch (error) {
      console.error("Failed to fetch tickets:", error);

      setTickets([]);

      Swal.fire({
        icon: "error",
        title: "Failed to load tickets",
        text:
          error?.response?.data?.message || "Unable to fetch support tickets.",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    fetchTickets();
  }, []);

  // ==========================================
  // STATISTICS
  // ==========================================

  const statistics = useMemo(() => {
    const total = tickets.length;

    const open = tickets.filter(
      (ticket) => ticket.status?.toLowerCase() === "open",
    ).length;

    const pending = tickets.filter(
      (ticket) => ticket.status?.toLowerCase() === "pending",
    ).length;

    const closed = tickets.filter(
      (ticket) =>
        ticket.status?.toLowerCase() === "closed" ||
        ticket.status?.toLowerCase() === "resolved",
    ).length;

    return {
      total,
      open,
      pending,
      closed,
    };
  }, [tickets]);

  // ==========================================
  // FILTER TICKETS
  // ==========================================

  const filteredTickets = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return tickets.filter((ticket) => {
      const matchesSearch =
        !searchValue ||
        ticket.ticketNumber?.toLowerCase().includes(searchValue) ||
        ticket.subject?.toLowerCase().includes(searchValue) ||
        ticket.description?.toLowerCase().includes(searchValue) ||
        ticket.customer?.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === "all" || ticket.status?.toLowerCase() === statusFilter;

      const matchesPriority =
        priorityFilter === "all" ||
        ticket.priority?.toLowerCase() === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tickets, search, statusFilter, priorityFilter]);

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ==========================================
  // FORMAT DATE + TIME
  // ==========================================

  const formatMessageDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ==========================================
  // VIEW TICKET + FETCH CHAT
  // ==========================================

  const handleView = async (ticket) => {
    if (!ticket?._id) return;

    try {
      setSelectedTicket(ticket);
      setChatMessages([]);
      setChatLoading(true);
      setShowViewModal(true);

      const response = await getTicketChat(ticket._id);

      if (response?.success) {
        // Use ticket returned from chat API
        if (response?.data?.ticket) {
          setSelectedTicket(response.data.ticket);
        }

        // Set conversation messages
        setChatMessages(
          Array.isArray(response?.data?.messages) ? response.data.messages : [],
        );
      } else {
        Swal.fire({
          icon: "error",
          title: "Unable to load conversation",
          text: response?.message || "Unable to fetch ticket conversation.",
        });
      }
    } catch (error) {
      console.error("Failed to fetch ticket chat:", error);

      Swal.fire({
        icon: "error",
        title: "Conversation Error",
        text:
          error?.response?.data?.message ||
          "Unable to fetch ticket conversation.",
      });
    } finally {
      setChatLoading(false);
    }
  };

  // ==========================================
  // LOAD CHAT
  // ==========================================

  const loadTicketChat = async (ticketId, showLoader = true) => {
    if (!ticketId) return null;

    try {
      if (showLoader) {
        setChatLoading(true);
      }

      const response = await getTicketChat(ticketId);

      if (response?.success) {
        if (response?.data?.ticket) {
          setSelectedTicket(response.data.ticket);
        }

        const messages = Array.isArray(response?.data?.messages)
          ? response.data.messages
          : [];

        setChatMessages(messages);

        return response;
      }

      return null;
    } catch (error) {
      console.error("Failed to load ticket chat:", error);

      if (showLoader) {
        Swal.fire({
          icon: "error",
          title: "Conversation Error",
          text:
            error?.response?.data?.message || "Unable to load conversation.",
        });
      }

      return null;
    } finally {
      if (showLoader) {
        setChatLoading(false);
      }
    }
  };

  // ==========================================
  // OPEN REPLY MODAL
  // ==========================================

  const handleOpenReply = (ticket) => {
    setSelectedTicket(ticket);
    setReplyMessage("");
    setShowReplyModal(true);
  };

  // ==========================================
  // REPLY TO TICKET
  // ==========================================

  const handleReply = async () => {
    const message = replyMessage.trim();

    if (!message) {
      Swal.fire({
        icon: "warning",
        title: "Message required",
        text: "Please enter a reply message.",
      });

      return;
    }

    if (!selectedTicket?._id) {
      return;
    }

    const ticketId = selectedTicket._id;

    try {
      setReplyLoading(true);

      const response = await replyToTicket(ticketId, message);

      if (response?.success) {
        setReplyMessage("");
        setShowReplyModal(false);

        Swal.fire({
          icon: "success",
          title: "Reply Sent",
          text: response?.message || "Your reply has been sent successfully.",
          timer: 1800,
          showConfirmButton: false,
        });

        // Refresh ticket list
        await fetchTickets(true);

        // Refresh conversation
        const chatResponse = await loadTicketChat(ticketId, false);

        // Reopen ticket conversation after reply
        if (chatResponse?.success) {
          setShowViewModal(true);
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Reply Failed",
          text: response?.message || "Unable to send reply.",
        });
      }
    } catch (error) {
      console.error("Reply error:", error);

      Swal.fire({
        icon: "error",
        title: "Reply Failed",
        text: error?.response?.data?.message || "Unable to send reply.",
      });
    } finally {
      setReplyLoading(false);
    }
  };

  // ==========================================
  // CLOSE / RESOLVE TICKET
  // ==========================================

  const handleCloseTicket = async (ticket) => {
    if (!ticket?._id) {
      return;
    }

    const result = await Swal.fire({
      icon: "question",
      title: "Resolve Ticket?",
      text: `Are you sure you want to resolve ${ticket.ticketNumber}?`,
      showCancelButton: true,
      confirmButtonText: "Yes, Resolve",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      setClosingId(ticket._id);

      const response = await closeTicket(ticket._id);

      if (response?.success) {
        Swal.fire({
          icon: "success",
          title: "Ticket Resolved",
          text: response?.message || "Ticket has been resolved successfully.",
          timer: 1800,
          showConfirmButton: false,
        });

        // Update UI immediately
        setTickets((prevTickets) =>
          prevTickets.map((item) =>
            item._id === ticket._id
              ? {
                  ...item,
                  status: "closed",
                }
              : item,
          ),
        );

        // Update selected ticket if open
        if (selectedTicket?._id === ticket._id) {
          setSelectedTicket((prev) =>
            prev
              ? {
                  ...prev,
                  status: "closed",
                }
              : prev,
          );
        }

        // Close chat modal
        setShowViewModal(false);
      } else {
        Swal.fire({
          icon: "error",
          title: "Unable to Resolve",
          text: response?.message || "Unable to close the ticket.",
        });
      }
    } catch (error) {
      console.error("Close ticket error:", error);

      Swal.fire({
        icon: "error",
        title: "Unable to Resolve",
        text:
          error?.response?.data?.message ||
          "Something went wrong while resolving the ticket.",
      });
    } finally {
      setClosingId(null);
    }
  };

  // ==========================================
  // CLOSE VIEW MODAL
  // ==========================================

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setChatMessages([]);
    setSelectedTicket(null);
  };

  // ==========================================
  // STATUS CLASS
  // ==========================================

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "open":
        return "ticket-status open";

      case "pending":
        return "ticket-status pending";

      case "closed":
      case "resolved":
        return "ticket-status closed";

      default:
        return "ticket-status";
    }
  };

  // ==========================================
  // PRIORITY CLASS
  // ==========================================

  const getPriorityClass = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "ticket-priority high";

      case "medium":
        return "ticket-priority medium";

      case "low":
        return "ticket-priority low";

      default:
        return "ticket-priority";
    }
  };

  // ==========================================
  // MESSAGE TYPE
  // ==========================================

  const isAdminMessage = (message) => {
    return message?.senderType?.toLowerCase() === "admin";
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="ticket-page">
        <div className="ticket-loading">
          <div className="ticket-spinner"></div>
          <p>Loading support tickets...</p>
        </div>
      </div>
    );
  }

  // ==========================================
  // RETURN
  // ==========================================

  return (
    <div className="ticket-page">
      {/* ========================================
          PAGE HEADER
      ======================================== */}

      <div className="ticket-page-header">
        <div className="ticket-heading">
          <div className="ticket-heading-icon">
            <FiHelpCircle />
          </div>

          <div>
            <h1>Support Tickets</h1>
            <p>Manage customer support requests and resolutions.</p>
          </div>
        </div>

        <button
          type="button"
          className="ticket-refresh-btn"
          onClick={() => fetchTickets(true)}
          disabled={refreshing}
        >
          <FiRefreshCw className={refreshing ? "spin" : ""} />

          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* ========================================
          STATISTICS
      ======================================== */}

      <div className="ticket-stats">
        {/* TOTAL */}

        <div className="ticket-stat-card">
          <div className="ticket-stat-icon total">
            <FiHelpCircle />
          </div>

          <div>
            <span>Total Tickets</span>
            <strong>{statistics.total}</strong>
          </div>
        </div>

        {/* OPEN */}

        <div className="ticket-stat-card">
          <div className="ticket-stat-icon open">
            <FiClock />
          </div>

          <div>
            <span>Open Tickets</span>
            <strong>{statistics.open}</strong>
          </div>
        </div>

        {/* PENDING */}

        <div className="ticket-stat-card">
          <div className="ticket-stat-icon pending">
            <FiClock />
          </div>

          <div>
            <span>Pending</span>
            <strong>{statistics.pending}</strong>
          </div>
        </div>

        {/* RESOLVED */}

        <div className="ticket-stat-card">
          <div className="ticket-stat-icon closed">
            <FiCheckCircle />
          </div>

          <div>
            <span>Resolved</span>
            <strong>{statistics.closed}</strong>
          </div>
        </div>
      </div>

      {/* ========================================
          FILTER SECTION
      ======================================== */}

      <div className="ticket-filter-card">
        {/* SEARCH */}

        <div className="ticket-search">
          <FiSearch />

          <input
            type="text"
            placeholder="Search ticket number, subject, customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="ticket-search-clear"
            >
              <FiX />
            </button>
          )}
        </div>

        {/* STATUS */}

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="ticket-filter-select"
        >
          <option value="all">All Status</option>
          <option value="open">Open</option>
          <option value="pending">Pending</option>
          <option value="closed">Closed</option>
        </select>

        {/* PRIORITY */}

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="ticket-filter-select"
        >
          <option value="all">All Priority</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {/* ========================================
          TABLE
      ======================================== */}

      <div className="ticket-table-card">
        <div className="ticket-table-header">
          <div>
            <h2>All Support Tickets</h2>

            <span>
              Showing {filteredTickets.length} of {tickets.length} tickets
            </span>
          </div>
        </div>

        {filteredTickets.length === 0 ? (
          <div className="ticket-empty">
            <div className="ticket-empty-icon">
              <FiHelpCircle />
            </div>

            <h3>No tickets found</h3>

            <p>
              {tickets.length === 0
                ? "There are currently no support tickets."
                : "Try changing your search or filters."}
            </p>
          </div>
        ) : (
          <div className="ticket-table-wrapper">
            <table className="ticket-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Ticket</th>
                  <th>Customer</th>
                  <th>Subject</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredTickets.map((ticket, index) => (
                  <tr key={ticket._id}>
                    {/* NUMBER */}

                    <td>
                      <span className="ticket-index">{index + 1}</span>
                    </td>

                    {/* TICKET NUMBER */}

                    <td>
                      <div className="ticket-number">
                        <FiHelpCircle />

                        <span>{ticket.ticketNumber || "—"}</span>
                      </div>
                    </td>

                    {/* CUSTOMER */}

                    <td>
                      <div className="ticket-customer">
                        <div className="customer-avatar">
                          {ticket.customer?.slice(0, 2).toUpperCase() || "CU"}
                        </div>

                        <span title={ticket.customer}>
                          {ticket.customer
                            ? `${ticket.customer.slice(0, 8)}...`
                            : "—"}
                        </span>
                      </div>
                    </td>

                    {/* SUBJECT */}

                    <td>
                      <div className="ticket-subject">
                        <strong>{ticket.subject || "No subject"}</strong>

                        <span>{ticket.description || "No description"}</span>
                      </div>
                    </td>

                    {/* PRIORITY */}

                    <td>
                      <span className={getPriorityClass(ticket.priority)}>
                        {ticket.priority || "—"}
                      </span>
                    </td>

                    {/* STATUS */}

                    <td>
                      <span className={getStatusClass(ticket.status)}>
                        <span className="status-dot"></span>

                        {ticket.status || "—"}
                      </span>
                    </td>

                    {/* CREATED */}

                    <td>
                      <span className="ticket-date">
                        {formatDate(ticket.createdAt)}
                      </span>
                    </td>

                    {/* ACTIONS */}

                    <td>
                      <div className="ticket-actions">
                        {/* VIEW */}

                        <button
                          type="button"
                          className="ticket-action view"
                          title="View Ticket"
                          onClick={() => handleView(ticket)}
                        >
                          <FiEye />
                        </button>

                        {/* REPLY */}

                        {ticket.status?.toLowerCase() !== "closed" && (
                          <button
                            type="button"
                            className="ticket-action reply"
                            title="Reply"
                            onClick={() => handleOpenReply(ticket)}
                          >
                            <FiMessageSquare />
                          </button>
                        )}

                        {/* RESOLVE */}

                        {ticket.status?.toLowerCase() !== "closed" && (
                          <button
                            type="button"
                            className="ticket-action resolve"
                            title="Resolve Ticket"
                            onClick={() => handleCloseTicket(ticket)}
                            disabled={closingId === ticket._id}
                          >
                            {closingId === ticket._id ? (
                              <span className="mini-spinner"></span>
                            ) : (
                              <FiCheckCircle />
                            )}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* =====================================================
          VIEW TICKET / CHAT MODAL
      ===================================================== */}

      {showViewModal && selectedTicket && (
        <div className="ticket-modal-overlay" onClick={handleCloseViewModal}>
          <div
            className="ticket-modal ticket-chat-modal"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ========================================
                CHAT HEADER
            ======================================== */}

            <div className="ticket-chat-header">
              <div className="ticket-chat-header-left">
                <div className="ticket-chat-ticket-number">
                  <FiMessageSquare />

                  <span>{selectedTicket.ticketNumber || "Support Ticket"}</span>
                </div>

                <h2>{selectedTicket.subject || "No Subject"}</h2>
              </div>

              <button
                type="button"
                className="modal-close-btn"
                onClick={handleCloseViewModal}
                title="Close"
              >
                <FiX />
              </button>
            </div>

            {/* ========================================
                TICKET INFORMATION
            ======================================== */}

            <div className="ticket-chat-info">
              <div className="ticket-chat-info-item">
                <span>Priority</span>

                <strong className={getPriorityClass(selectedTicket.priority)}>
                  {selectedTicket.priority || "—"}
                </strong>
              </div>

              <div className="ticket-chat-info-divider"></div>

              <div className="ticket-chat-info-item">
                <span>Status</span>

                <strong className={getStatusClass(selectedTicket.status)}>
                  <span className="status-dot"></span>

                  {selectedTicket.status || "—"}
                </strong>
              </div>

              <div className="ticket-chat-info-divider"></div>

              <div className="ticket-chat-info-item">
                <span>Created</span>

                <strong>{formatMessageDate(selectedTicket.createdAt)}</strong>
              </div>

              <div className="ticket-chat-info-divider"></div>

              <div className="ticket-chat-info-item">
                <FiUser />

                <span>Customer</span>

                <strong title={selectedTicket.customer}>
                  {selectedTicket.customer || "—"}
                </strong>
              </div>
            </div>

            {/* ========================================
                ORIGINAL CUSTOMER ISSUE
            ======================================== */}

            <div className="ticket-original-message">
              <div className="ticket-original-message-content">
                <div className="ticket-original-message-label">
                  <FiUser />

                  <span>Customer</span>

                  <span>{formatMessageDate(selectedTicket.createdAt)}</span>
                </div>

                <div className="ticket-original-message-bubble">
                  {selectedTicket.description || "No description available."}
                </div>
              </div>
            </div>

            {/* ========================================
                CONVERSATION
            ======================================== */}

            {chatLoading ? (
              <div className="ticket-chat-loading">
                <div className="ticket-spinner"></div>

                <p>Loading conversation...</p>
              </div>
            ) : (
              <div className="ticket-conversation">
                {chatMessages.length === 0 ? (
                  <div className="ticket-chat-empty">
                    <div className="ticket-chat-empty-icon">
                      <FiMessageSquare />
                    </div>

                    <p>No additional messages in this conversation.</p>
                  </div>
                ) : (
                  chatMessages.map((message) => {
                    const adminMessage = isAdminMessage(message);

                    return (
                      <div
                        key={message._id}
                        className={`chat-message ${
                          adminMessage
                            ? "admin-message-row"
                            : "customer-message-row"
                        }`}
                      >
                        <div className="chat-message-content">
                          {/* MESSAGE META */}

                          <div className="chat-message-meta">
                            {adminMessage ? (
                              <>
                                <span className="chat-sender">You</span>

                                <span className="chat-time">
                                  {formatMessageDate(message.createdAt)}
                                </span>
                              </>
                            ) : (
                              <>
                                <span className="chat-sender">Customer</span>

                                <span className="chat-time">
                                  {formatMessageDate(message.createdAt)}
                                </span>
                              </>
                            )}
                          </div>

                          {/* MESSAGE */}

                          <div
                            className={`chat-bubble ${
                              adminMessage ? "admin-bubble" : "customer-bubble"
                            }`}
                          >
                            {message.message || ""}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* ========================================
                MODAL FOOTER
            ======================================== */}

            <div className="ticket-modal-footer">
              <button
                type="button"
                className="modal-secondary-btn"
                onClick={handleCloseViewModal}
              >
                Close
              </button>

              {selectedTicket.status?.toLowerCase() !== "closed" && (
                <>
                  {/* REPLY */}

                  <button
                    type="button"
                    className="modal-reply-btn"
                    onClick={() => {
                      setShowViewModal(false);
                      handleOpenReply(selectedTicket);
                    }}
                  >
                    <FiMessageSquare />
                    Reply
                  </button>

                  {/* RESOLVE */}

                  <button
                    type="button"
                    className="modal-resolve-btn"
                    onClick={() => {
                      setShowViewModal(false);
                      handleCloseTicket(selectedTicket);
                    }}
                    disabled={closingId === selectedTicket._id}
                  >
                    {closingId === selectedTicket._id ? (
                      <>
                        <span className="mini-spinner"></span>
                        Resolving...
                      </>
                    ) : (
                      <>
                        <FiCheckCircle />
                        Resolve
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          REPLY MODAL
      ===================================================== */}

      {showReplyModal && selectedTicket && (
        <div
          className="ticket-modal-overlay"
          onClick={() => {
            if (!replyLoading) {
              setShowReplyModal(false);
            }
          }}
        >
          <div
            className="ticket-modal reply-modal"
            onClick={(e) => e.stopPropagation()}
          >
            {/* HEADER */}

            <div className="ticket-modal-header">
              <div>
                <span className="modal-label">Reply to Ticket</span>

                <h2>{selectedTicket.ticketNumber}</h2>
              </div>

              <button
                type="button"
                onClick={() => !replyLoading && setShowReplyModal(false)}
                className="modal-close-btn"
              >
                <FiX />
              </button>
            </div>

            {/* BODY */}

            <div className="ticket-modal-body">
              <div className="reply-ticket-info">
                <span>Subject</span>

                <strong>{selectedTicket.subject || "No subject"}</strong>
              </div>

              <label className="reply-label">Your Message</label>

              <textarea
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder="Write your response to the customer..."
                rows="7"
                disabled={replyLoading}
              />

              <div className="reply-character-count">
                {replyMessage.length} characters
              </div>
            </div>

            {/* FOOTER */}

            <div className="ticket-modal-footer">
              <button
                type="button"
                className="modal-secondary-btn"
                onClick={() => !replyLoading && setShowReplyModal(false)}
                disabled={replyLoading}
              >
                Cancel
              </button>

              <button
                type="button"
                className="modal-reply-btn send"
                onClick={handleReply}
                disabled={replyLoading}
              >
                {replyLoading ? (
                  <>
                    <span className="mini-spinner"></span>
                    Sending...
                  </>
                ) : (
                  <>
                    <FiMessageSquare />
                    Send Reply
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketList;
