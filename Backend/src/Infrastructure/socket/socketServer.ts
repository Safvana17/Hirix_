import { Server } from 'socket.io';
import http from 'http'
import { logger } from '../../utils/logging/loger';
import { CodingLanguage } from '../../Domain/enums/Test';

export const initializeSocket = (server: http.Server) => {
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:5173",
            credentials: true
        }
    })

    io.on("connection", (socket) => {
        logger.info({socketId:socket.id}, 'user connected')

        socket.on('join-room', (payload: string | { roomId: string; userId?: string; userName?: string; role?: string }) => {
            const roomId = typeof payload === 'string' ? payload : payload.roomId;
            if (!roomId) return;

            const room = io.sockets.adapter.rooms.get(roomId);
            const participantCount = room?.size ?? 0;

            if (participantCount >= 2) {
                socket.emit('room-full');
                return;
            }

            if (socket.data.roomId) return;

            socket.join(roomId);
            socket.data.roomId = roomId;

            if (typeof payload === 'object') {
                socket.data.userId = payload.userId;
                socket.data.userName = payload.userName;
                socket.data.role = payload.role;
            }

            logger.info({ socketId: socket.id, roomId, participantCount }, 'User joined room');

            if (participantCount === 0) {
                socket.emit('room-waiting');
                return;
            }

            if (participantCount === 1) {
                socket.emit('room-ready', { shouldCreateOffer: true });
            }

            socket.to(roomId).emit('room-ready', { shouldCreateOffer: false });
        })

        socket.on("offer", ({roomId, offer}: {roomId: string; offer: RTCSessionDescriptionInit}) => {
            if(!socket.rooms.has(roomId)) return
            logger.info({socketId: socket.id,roomId}, "offer received")
            socket.to(roomId).emit("offer", {offer})
        })

        socket.on("answer", ({roomId, answer}: {roomId: string; answer: RTCSessionDescriptionInit}) => {
            if(!socket.rooms.has(roomId)) return
            logger.info({socketId: socket.id,roomId}, "answer received")
            socket.to(roomId).emit("answer", {answer})
        })

        socket.on("ice-candidate", ({roomId, candidate}: {roomId: string; candidate: RTCIceCandidateInit}) => {
            if(!socket.rooms.has(roomId)) return
            logger.info({socketId: socket.id,roomId}, "candidate received")
            socket.to(roomId).emit("ice-candidate", {candidate})
        })

        socket.on("chat-message", ({ roomId, id, senderId, senderName, text, timeStamp}: {roomId: string; id: string; senderId: string; senderName: string; text: string; timeStamp: number}) => {
            if(!socket.rooms.has(roomId)) return
            logger.info({socketId: socket.id,roomId}, "message received")
            socket.to(roomId).emit("chat-message", {roomId, id, senderId, senderName, text, timeStamp})
        })

        socket.on("code-change", ({ roomId, code, language, timeStamp}: {roomId: string; code: string; language: CodingLanguage; timeStamp: number}) => {
            if(!socket.rooms.has(roomId)) return
            logger.info({socketId: socket.id,roomId}, "code received")
            socket.to(roomId).emit("code-change", {code, language, timeStamp})
        })

        socket.on("toggle-media", ({ roomId, type, enabled }: {roomId: string; type: 'audio' | 'video'; enabled: boolean}) => {
            if(!socket.rooms.has(roomId)) return
            logger.info({socketId: socket.id,roomId}, "toggle received")
            socket.to(roomId).emit("toggle-media", { type, enabled })
        })

        socket.on('screen-share-state', ({roomId, active}: {roomId: string, active: boolean}) => {
            if(!socket.rooms.has(roomId)) return
            logger.info({socketId: socket.id, roomId, active}, 'screen share state changed ')
            socket.to(roomId).emit('screen-share-state', { active })
        })
        
        socket.on("interview-ended", ({ roomId }: {roomId: string}) => {
            if(!socket.rooms.has(roomId)) return
            logger.info({socketId: socket.id,roomId}, "interview ended")
            io.to(roomId).emit("interview-ended")
        })

        socket.on("user-left", ({roomId}: {roomId: string}) => {
            if(!roomId) return
            socket.to(roomId).emit("user-left")
            socket.leave(roomId)
            socket.data.roomId = undefined
        })

        socket.on("disconnect", () => {
            const roomId = socket.data.roomId
            logger.info({ socketId: socket.id, roomId },"User disconnected")
            if(roomId){
                socket.to(roomId).emit("user-left")
            }
        })
    })

    return io
}

