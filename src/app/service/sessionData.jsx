import { create } from 'zustand';

export const sessionData = create((set) => ({
  currentUser: {
    userId: 'usr_' + Math.random().toString(36).substring(2, 9),
    nickname: 'Dev_' + Math.floor(Math.random() * 1000),
    avatarUrl: '/avatar1.png',
    role: 'viewer',
  },
  members: [],
  files: [],
  activeFileId: null,

  setCurrentUser: (userData) =>
    set((state) => ({ currentUser: { ...state.currentUser, ...userData } })),

  setMembers: (members) => set({ members }),

  setFiles: (files) => set({ files }),

  setActiveFileId: (fileId) => set({ activeFileId: fileId }),

  updateFileContent: (fileId, content) =>
    set((state) => ({
      files: state.files.map((file) =>
        file.fileId === fileId ? { ...file, content } : file
      ),
    })),
}));