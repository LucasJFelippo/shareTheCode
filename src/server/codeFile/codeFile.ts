export interface UserFilePermission {
  canRead: boolean;
  canWrite: boolean;
}

export interface CodeFileProps {
  fileId: string;
  fileName: string;
  language: string;
  content?: string;
}

export class CodeFile {
  public readonly fileId: string;
  public fileName: string;
  public language: string;
  private content: string;
  private userPermissions: Map<string, UserFilePermission>;

  constructor(props: CodeFileProps) {
    this.fileId = props.fileId;
    this.fileName = props.fileName;
    this.language = props.language;
    this.content = props.content ?? '';
    this.userPermissions = new Map();
  }

  public getContent(): string {
    return this.content;
  }

  public setContent(newContent: string): void {
    this.content = newContent;
  }

  public setPermission(userId: string, perms: UserFilePermission): void {
    this.userPermissions.set(userId, { ...perms });
  }

  public getPermission(userId: string): UserFilePermission | undefined {
    return this.userPermissions.get(userId);
  }

  public revokeUser(userId: string): boolean {
    return this.userPermissions.delete(userId);
  }

  public canRead(userId: string): boolean {
    return this.userPermissions.get(userId)?.canRead ?? false;
  }

  public canWrite(userId: string): boolean {
    return this.userPermissions.get(userId)?.canWrite ?? false;
  }

  public toJSON(forUserId?: string) {
    const isAllowedToRead = forUserId ? this.canRead(forUserId) : true;
    return {
      fileId: this.fileId,
      fileName: this.fileName,
      language: this.language,
      content: isAllowedToRead ? this.content : '',
      permissions: Object.fromEntries(this.userPermissions),
    };
  }
}