import { Server, Socket } from 'socket.io';
import { RoomManager } from './room/roomManager';

/**
 * List of registered custom events:
 * - session:join    -> Client registers its profile and requests room entry
 * - session:synced  -> Server sends the sanitized room snapshot down to the client
 * - user:joined     -> Server notifies peers that a new user joined
 * - user:list       -> Server broadcasts the complete list of active members
 * - code:update     -> Client emits local editor content modifications
 * - code:sync       -> Server relays updated code content to peers in the room
 */

export const eventHandlers = (serverSocket: Server, clientSocket: Socket, roomId: string) => {
  clientSocket.on('session:join', (payload: { userId: string; nickname: string; avatarUrl: string }) => {
    try {
      const { room, user } = RoomManager.joinRoom(roomId, {
        userId: payload.userId,
        socketId: clientSocket.id,
        nickname: payload.nickname,
        avatarUrl: payload.avatarUrl,
      });

      clientSocket.join(roomId);

      const snapshot = RoomManager.getRoomSnapshot(roomId, user.userId);
      clientSocket.emit('session:synced', snapshot);

      clientSocket.to(roomId).emit('user:joined', user.toJSON());
      serverSocket.to(roomId).emit('user:list', Array.from(room.users.values()).map((u) => u.toJSON()));

      console.log(`[Socket] ${user.nickname} (${user.userId}) joined room "${roomId}"`);
    } catch (err: any) {
      console.error(`[Socket] Failed to join session: ${err.message}`);
      clientSocket.emit('error', { message: err.message });
    }
  });

  clientSocket.on('code:update', (payload: { roomId: string; fileId: string; content: string }) => {
    const room = RoomManager.getRoom(payload.roomId || roomId);
    if (!room) return;

    const file = room.files.get(payload.fileId);
    if (!file) return;

    file.setContent(payload.content);

    clientSocket.to(room.roomId).emit('code:sync', {
      fileId: payload.fileId,
      content: payload.content,
    });
  });
};

export const connHandlers = (serverSocket: Server, clientSocket: Socket) => {
  clientSocket.on('disconnect', () => {
    const lookup = RoomManager.findBySocketId(clientSocket.id);
    if (!lookup) return;

    const { room, user } = lookup;
    RoomManager.leaveRoom(room.roomId, user.userId);

    console.log(`[Socket] ${user.nickname} disconnected from room "${room.roomId}"`);

    const remainingRoom = RoomManager.getRoom(room.roomId);
    if (remainingRoom) {
      serverSocket.to(room.roomId).emit(
        'user:list',
        Array.from(remainingRoom.users.values()).map((u) => u.toJSON())
      );
    }
  });
};