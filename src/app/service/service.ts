import React, { useEffect } from 'react';
import { io } from 'socket.io-client';
import { sessionData } from './sessionData';

const BACKEND_URL = 'http://localhost:4000';
export const socket = io(BACKEND_URL, {
  autoConnect: false,
});

export const emitCodeUpdate = (roomId: string, fileId: string, content: string) => {
  if (!socket.connected) {
    console.log('[service]  WARNING  Cannot emit code:update, socket is not connected');
    return;
  }
  socket.emit('code:update', { roomId, fileId, content });
};

export const Service = () => {
  const currentUser = sessionData((state) => state.currentUser);
  const setMembers = sessionData((state) => state.setMembers);
  const setFiles = sessionData((state) => state.setFiles);
  const setActiveFileId = sessionData((state) => state.setActiveFileId);
  const updateFileContent = sessionData((state) => state.updateFileContent);

  useEffect(() => {
    socket.connect();

    socket.on('connect', () => {
      console.log(`[service]  INFO     Connected to backend socket with ID: ${socket.id}`);
      socket.emit('session:join', {
        userId: currentUser.userId,
        nickname: currentUser.nickname,
        avatarUrl: currentUser.avatarUrl,
      });
      console.log(`[service]  DEBUG    Dispatched session:join for user ${currentUser.nickname} (${currentUser.userId})`);
    });

    socket.on('session:synced', (snapshot) => {
      if (!snapshot) return;
      console.log('[service]  INFO     Received initial session:synced snapshot');

      if (snapshot.files?.length > 0) {
        setFiles(snapshot.files);
        setActiveFileId(snapshot.activeFileId || snapshot.files[0].fileId);
      }
      if (snapshot.users) {
        setMembers(snapshot.users);
      }
    });

    socket.on('user:list', (userList) => {
      console.log(`[service]  DEBUG    user:list updated. Count: ${userList.length}`);
      setMembers(userList);
    });

    socket.on('code:sync', ({ fileId, content }) => {
      console.log(`[service]  DEBUG    Received code:sync for fileId: ${fileId}`);
      updateFileContent(fileId, content);
    });

    socket.on('disconnect', (reason) => {
      console.log(`[service]  WARNING  Socket disconnected. Reason: ${reason}`);
    });

    return () => {
      socket.off('connect');
      socket.off('session:synced');
      socket.off('user:list');
      socket.off('code:sync');
      socket.off('disconnect');
      socket.disconnect();
    };
  }, []);

  return null;
};

export default Service;