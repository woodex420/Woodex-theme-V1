/**
 * Socket.IO real-time setup
 * - Live support: agents online status, new conversations
 * - Builder: collaborative editing, presence
 * - Notifications: leads, mentions
 */

let io = null;
const onlineAgents = new Map(); // agentId -> { socketId, name, lastSeen }

export function initSocket(server) {
  io = server;

  io.on("connection", (socket) => {
    console.log("[socket] connected:", socket.id);

    // ====== AGENT PRESENCE ======
    socket.on("agent:online", ({ agentId, name }) => {
      onlineAgents.set(agentId, { socketId: socket.id, name, lastSeen: Date.now() });
      io.emit("agents:online", Array.from(onlineAgents.entries()).map(([id, v]) => ({ id, ...v })));
    });

    socket.on("agent:offline", ({ agentId }) => {
      onlineAgents.delete(agentId);
      io.emit("agents:online", Array.from(onlineAgents.entries()).map(([id, v]) => ({ id, ...v })));
    });

    // ====== CONVERSATIONS ======
    socket.on("conversation:join", ({ conversationId }) => {
      socket.join(`conv:${conversationId}`);
    });

    socket.on("conversation:leave", ({ conversationId }) => {
      socket.leave(`conv:${conversationId}`);
    });

    socket.on("conversation:message", ({ conversationId, message }) => {
      io.to(`conv:${conversationId}`).emit("conversation:message", { conversationId, message });
    });

    socket.on("conversation:typing", ({ conversationId, agentName }) => {
      socket.to(`conv:${conversationId}`).emit("conversation:typing", { conversationId, agentName });
    });

    // ====== BUILDER SYNC ======
    socket.on("builder:join", ({ pageId }) => {
      socket.join(`page:${pageId}`);
      socket.to(`page:${pageId}`).emit("builder:joined", { socketId: socket.id });
    });

    socket.on("builder:update", ({ pageId, blocks }) => {
      socket.to(`page:${pageId}`).emit("builder:update", { pageId, blocks });
    });

    socket.on("builder:cursor", ({ pageId, x, y }) => {
      socket.to(`page:${pageId}`).emit("builder:cursor", { socketId: socket.id, x, y });
    });

    // ====== NOTIFICATIONS ======
    socket.on("disconnect", () => {
      console.log("[socket] disconnected:", socket.id);
      for (const [id, v] of onlineAgents.entries()) {
        if (v.socketId === socket.id) {
          onlineAgents.delete(id);
        }
      }
      io.emit("agents:online", Array.from(onlineAgents.entries()).map(([id, v]) => ({ id, ...v })));
    });
  });
}

// ====== HELPERS ======
export function emitNewLead(lead) {
  if (!io) return;
  io.emit("lead:new", lead);
}

export function emitNewConversation(conversation) {
  if (!io) return;
  io.emit("conversation:new", conversation);
}

export function emitConversationUpdate(conversation) {
  if (!io) return;
  io.emit("conversation:updated", conversation);
}

export function emitAlert(payload) {
  if (!io) return;
  io.emit("alert", payload);
}

export function getOnlineAgents() {
  return Array.from(onlineAgents.entries()).map(([id, v]) => ({ id, ...v }));
}
