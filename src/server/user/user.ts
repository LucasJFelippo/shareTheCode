export type UserRole = 'admin' | 'viewer';

export interface UserProps {
  userId: string;
  socketId: string;
  nickname: string;
  avatarUrl: string;
  role: UserRole;
}

export class User {
  public readonly userId: string;
  public socketId: string;
  public nickname: string;
  public avatarUrl: string;
  public role: UserRole;

  constructor(props: UserProps) {
    this.userId = props.userId;
    this.socketId = props.socketId;
    this.nickname = props.nickname;
    this.avatarUrl = props.avatarUrl;
    this.role = props.role;
  }

  public isAdmin(): boolean {
    return this.role === 'admin';
  }

  public updateSocketId(newSocketId: string): void {
    this.socketId = newSocketId;
  }

  public updateProfile(nickname?: string, avatarUrl?: string): void {
    if (nickname) this.nickname = nickname;
    if (avatarUrl) this.avatarUrl = avatarUrl;
  }

  public toJSON(): UserProps {
    return {
      userId: this.userId,
      socketId: this.socketId,
      nickname: this.nickname,
      avatarUrl: this.avatarUrl,
      role: this.role,
    };
  }
}