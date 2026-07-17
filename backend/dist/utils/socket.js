"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIO = exports.initializeSocket = void 0;
const socket_io_1 = require("socket.io");
const env_1 = __importDefault(require("../config/env"));
let io;
const initializeSocket = (server) => {
    io = new socket_io_1.Server(server, {
        cors: {
            origin: [
                env_1.default.frontend_url || "https://atithi.cornortech.com",
                "https://atithi.cornortech.com",
                "https://www.atithi.cornortech.com",
                "http://localhost:3000",
            ],
            credentials: true,
        },
        transports: ["websocket", "polling"],
    });
    io.on("connection", (socket) => {
        console.log("✅ User connected:", socket.id, "from", socket.handshake.address);
        socket.on("disconnect", (reason) => {
            console.log("❌ User disconnected:", socket.id, "reason:", reason);
        });
        socket.on("error", (error) => {
            console.error("🔴 Socket error for", socket.id, ":", error);
        });
    });
    // Log socket.io initialization
    console.log("✅ Socket.IO initialized with CORS origin:", env_1.default.frontend_url);
    return io;
};
exports.initializeSocket = initializeSocket;
const getIO = () => {
    if (!io) {
        throw new Error("Socket.IO not initialized");
    }
    return io;
};
exports.getIO = getIO;
