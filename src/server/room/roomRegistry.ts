import { User } from '../user/user';
import { CodeFile, UserFilePermission } from '../codeFiles/codeFile';

export interface RoomProps {
  roomId: string;
  adminUserId: string;
  defaultPermissions?: UserFilePermission;
}

export class Room {
  public readonly roomId: string;
  public readonly adminUserId: string;
  public defaultPermissions: UserFilePermission;
  
  public users: Map<string, User>;
  public files: Map<string, CodeFile>;
  public activeFileId: string | null;

  constructor(props: RoomProps) {
    this.roomId = props.roomId;
    this.adminUserId = props.adminUserId;
    this.defaultPermissions = props.defaultPermissions ?? {
      canRead: true,
      canWrite: false,
    };
    this.users = new Map();
    this.files = new Map();
    this.activeFileId = null;
  }

  public addUser(user: User): void {
    this.users.set(user.userId, user);

    if (!user.isAdmin()) {
      for (const file of this.files.values()) {
        if (!file.getPermission(user.userId)) {
          file.setPermission(user.userId, this.defaultPermissions);
        }
      }
    } else {
      for (const file of this.files.values()) {
        file.setPermission(user.userId, { canRead: true, canWrite: true });
      }
    }
  }

  public removeUser(userId: string): boolean {
    for (const file of this.files.values()) {
      file.revokeUser(userId);
    }
    return this.users.delete(userId);
  }

  public addFile(file: CodeFile): void {
    this.files.set(file.fileId, file);

    for (const user of this.users.values()) {
      if (user.isAdmin()) {
        file.setPermission(user.userId, { canRead: true, canWrite: true });
      } else {
        file.setPermission(user.userId, this.defaultPermissions);
      }
    }

    if (!this.activeFileId) {
      this.activeFileId = file.fileId;
    }
  }

  public removeFile(fileId: string): boolean {
    const deleted = this.files.delete(fileId);
    if (this.activeFileId === fileId) {
      const remainingKeys = Array.from(this.files.keys());
      this.activeFileId = remainingKeys.length > 0 ? remainingKeys[0] : null;
    }
    return deleted;
  }
}

export const ROOM_REGISTRY: Map<string, Room> = new Map();