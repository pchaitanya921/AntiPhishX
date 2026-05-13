const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

let io;

const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: [
                'http://localhost:3000',
                'http://localhost:5173',
                'http://localhost:5174',
                'http://127.0.0.1:3000',
                'http://127.0.0.1:5173',
                'http://127.0.0.1:5174',
                process.env.FRONTEND_URL
            ].filter(Boolean),
            credentials: true
        }
    });

    // Middleware for Socket Authentication
    io.use(async (socket, next) => {
        console.log('[Socket] Incoming connection request:', socket.id);
        try {
            const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];

            if (!token) {
                console.warn('[Socket] Connection rejected: No token provided');
                return next(new Error('Authentication error: No token provided'));
            }

            const secret = process.env.JWT_SECRET;
            const decoded = jwt.verify(token, secret);
            console.log('[Socket] Token verified for user ID:', decoded.id);

            const user = await User.findById(decoded.id).select('_id role organization');
            if (!user) {
                console.warn('[Socket] Connection rejected: User not found in DB');
                return next(new Error('Authentication error: User not found'));
            }

            // Attach user data to socket
            socket.user = user;
            console.log('[Socket] Auth successful for:', user._id);
            next();
        } catch (err) {
            console.error('[Socket] Auth Failed:', err.message);
            next(new Error('Authentication error: Invalid token'));
        }
    });

    io.on('connection', (socket) => {
        console.log(`[Socket] Client connected: ${socket.id} (User: ${socket.user?._id})`);

        // Join a private room for the user
        socket.join(`user:${socket.user._id}`);

        // If user belongs to an organization, join an org room
        if (socket.user.organization) {
            socket.join(`org:${socket.user.organization}`);
        }

        // Join role-based rooms
        socket.join(`role:${socket.user.role}`);

        socket.on('disconnect', () => {
            console.log(`[Socket] Client disconnected: ${socket.id}`);
        });
    });

    return io;
};

const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized!');
    }
    return io;
};

// Helper to emit notification to a specific user
const emitToUser = (userId, event, data) => {
    if (io) {
        io.to(`user:${userId}`).emit(event, data);
    }
};

// Helper to emit notification to an organization
const emitToOrg = (orgId, event, data) => {
    if (io) {
        io.to(`org:${orgId}`).emit(event, data);
    }
};

// Helper to emit notification to a role
const emitToRole = (role, event, data) => {
    if (io) {
        io.to(`role:${role}`).emit(event, data);
    }
};

module.exports = {
    initSocket,
    getIO,
    emitToUser,
    emitToOrg,
    emitToRole
};
