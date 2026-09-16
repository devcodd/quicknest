import api from "./axios";

// ==========================================
// GET ALL TICKETS
// ==========================================

export const getAllTickets = async () => {
  const response = await api.get("/support/all-tickets");

  return response.data;
};

// ==========================================
// REPLY TO TICKET
// ==========================================

export const replyToTicket = async (ticketId, message) => {
  const response = await api.post(`/support/tickets/${ticketId}/reply`, {
    message,
  });

  return response.data;
};

// ==========================================
// CLOSE / RESOLVE TICKET
// ==========================================

export const closeTicket = async (ticketId) => {
  const response = await api.patch(`/support/tickets/${ticketId}/close`);

  return response.data;
};
// ==========================================
// GET TICKET CHAT
// ==========================================

export const getTicketChat = async (ticketId) => {
  const response = await api.get(
    `/support/tickets/${ticketId}/chat`
  );

  return response.data;
};