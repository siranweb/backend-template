import { WebSocket } from 'ws';

export interface IRoomsStorage {
  getWebSockets(roomName: string): WebSocket[];
  getRooms(ws: WebSocket): string[];
  addSocketToRoom(ws: WebSocket, roomName: string): void;
  removeSocketFromRoom(ws: WebSocket, roomName: string): void;
  dropSocket(ws: WebSocket): void;
  dropRoom(roomName: string): void;
}

export type Socket = {
  ws: WebSocket;
  rooms: Map<string, Room>;
};

export type Room = {
  name: string;
  sockets: Map<WebSocket, Socket>;
};
