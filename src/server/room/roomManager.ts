import { Room, ROOM_REGISTRY } from './roomRegistry';
import { User, UserRole } from '../user/user';
import { CodeFile, UserFilePermission } from '../codeFiles/codeFile';

export class RoomManager {
  public static createRoom(
    roomId: string,
    adminUserId: string,
    defaultPermissions?: UserFilePermission
  ): Room {
    if (ROOM_REGISTRY.has(roomId)) {
      throw new Error(`Room with ID "${roomId}" already exists.`);
    }

    const newRoom = new Room({
      roomId,
      adminUserId,
      defaultPermissions,
    });

    ROOM_REGISTRY.set(roomId, newRoom);
    return newRoom;
  }

  public static getRoom(roomId: string): Room | undefined {
    return ROOM_REGISTRY.get(roomId);
  }

  public static destroyRoom(roomId: string): boolean {
    return ROOM_REGISTRY.delete(roomId);
  }

  public static findBySocketId(
    socketId: string
  ): { room: Room; user: User } | undefined {
    for (const room of ROOM_REGISTRY.values()) {
      for (const user of room.users.values()) {
        if (user.socketId === socketId) {
          return { room, user };
        }
      }
    }
    return undefined;
  }

  public static joinRoom(
    roomId: string,
    userData: {
      userId: string;
      socketId: string;
      nickname: string;
      avatarUrl: string;
      role?: UserRole;
    }
  ): { room: Room; user: User } {
    const room = this.getRoom(roomId);
    if (!room) {
      throw new Error(`Room "${roomId}" does not exist.`);
    }

    const isSessionAdmin = userData.userId === room.adminUserId;
    const role: UserRole = isSessionAdmin ? 'admin' : (userData.role ?? 'viewer');

    let user = room.users.get(userData.userId);

    if (user) {
      user.updateSocketId(userData.socketId);
      user.updateProfile(userData.nickname, userData.avatarUrl);
    } else {
      user = new User({
        userId: userData.userId,
        socketId: userData.socketId,
        nickname: userData.nickname,
        avatarUrl: userData.avatarUrl,
        role,
      });
      room.addUser(user);
    }

    return { room, user };
  }

  public static leaveRoom(
    roomId: string,
    userId: string
  ): { room: Room | null; removedUser: User | undefined } {
    const room = this.getRoom(roomId);
    if (!room) {
      return { room: null, removedUser: undefined };
    }

    const removedUser = room.users.get(userId);
    room.removeUser(userId);

    if (room.users.size === 0) {
      this.destroyRoom(roomId);
      return { room: null, removedUser };
    }

    return { room, removedUser };
  }

  public static getRoomSnapshot(roomId: string, targetUserId: string) {
    const room = this.getRoom(roomId);
    if (!room) return null;

    const requester = room.users.get(targetUserId);
    const isAdmin = requester?.isAdmin() ?? false;

    const sanitizedFiles = Array.from(room.files.values()).map((file) => {
      const perms = file.getPermission(targetUserId);
      const canRead = isAdmin || (perms?.canRead ?? false);
      const canWrite = isAdmin || (perms?.canWrite ?? false);

      return {
        fileId: file.fileId,
        fileName: file.fileName,
        language: file.language,
        content: canRead ? file.getContent() : '',
        permissions: {
          canRead,
          canWrite,
        },
      };
    });

    const userList = Array.from(room.users.values()).map((u) => u.toJSON());

    return {
      roomId: room.roomId,
      adminUserId: room.adminUserId,
      activeFileId: room.activeFileId,
      files: sanitizedFiles,
      users: userList,
      defaultPermissions: room.defaultPermissions,
    };
  }
}