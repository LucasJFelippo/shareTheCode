import http from 'http';
import { Server } from 'socket.io';
import { RoomManager } from './room/roomManager';
import { CodeFile } from './codeFiles/codeFile';
import { connHandlers, eventHandlers } from './socketsHandlers';

const PORT = 4000;
const ROOM_ID = 'default-session';
const ADMIN_ID = 'admin-host';

const createDefaultSession = () => {
  const room = RoomManager.createRoom(ROOM_ID, ADMIN_ID, {
    canRead: true,
    canWrite: true,
  });

  const starterFile = new CodeFile({
    fileId: 'file-1',
    fileName: 'main.js',
    language: 'javascript',
    content: `// Welcome to Share The Code!\nfunction sharedSession() {\n  console.log("Both clients are synced!");\n}\n\nsharedSession();\n`,
  });

  room.addFile(starterFile);
  console.log(`[Server] Seeded active room "${ROOM_ID}" with file "${starterFile.fileName}"`);
};

const httpServer = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ status: 'running', session: ROOM_ID }));
});

const serverSocket = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

serverSocket.on('connection', (clientSocket) => {
  connHandlers(serverSocket, clientSocket);
  eventHandlers(serverSocket, clientSocket, ROOM_ID);
});

createDefaultSession();
httpServer.listen(PORT, () => {
  console.log(`[Server] Share The Code server running on http://localhost:${PORT}`);
});