import { WebSocket } from 'ws';

interface Socket {
  ws: WebSocket;
  rooms: Map<string, Room>;
}

interface Room {
  name: string;
  sockets: Map<WebSocket, Socket>;
}

export class RoomsStorage {
  private readonly rooms: Map<string, Room> = new Map();
  private readonly sockets: Map<WebSocket, Socket> = new Map();

  public getWebSockets(name: string): WebSocket[] {
    const room = this.rooms.get(name);
    if (!room) return [];

    const webSockets: WebSocket[] = [];
    room.sockets.forEach((socket) => webSockets.push(socket.ws));
    return webSockets;
  }

  public getRooms(ws: WebSocket): string[] {
    const socket = this.sockets.get(ws);
    if (!socket) return [];

    const rooms: string[] = [];
    socket.rooms.forEach((room) => rooms.push(room.name));
    return rooms;
  }

  public addSocketToRoom(ws: WebSocket, name: string): void {
    let socket = this.sockets.get(ws);
    if (!socket) {
      this.storeSocket(ws);
      socket = this.sockets.get(ws);
    }

    let room = this.rooms.get(name);
    if (!room) {
      this.storeRoom(name);
      room = this.rooms.get(name);
    }

    const isAlreadyAdded = socket.rooms.has(room.name);
    if (isAlreadyAdded) return;

    socket.rooms.set(room.name, room);
    room.sockets.set(ws, socket);
  }

  public removeSocketFromRoom(ws: WebSocket, name: string): void {
    const socket = this.sockets.get(ws);
    const room = this.rooms.get(name);
    if (!socket || !room) return;

    const isAdded = socket.rooms.has(room.name);
    if (!isAdded) return;

    room.sockets.delete(ws);
    socket.rooms.delete(room.name);
  }

  public dropSocket(ws: WebSocket): void {
    const socket = this.sockets.get(ws);
    if (!socket) return;

    socket.rooms.forEach((room) => room.sockets.delete(socket.ws));
    socket.rooms = new Map();
  }

  public dropRoom(name: string): void {
    const room = this.rooms.get(name);
    if (!room) return;

    room.sockets.forEach((socket) => socket.rooms.delete(room.name));
    room.sockets = new Map();
  }

  private storeSocket(ws: WebSocket): void {
    this.sockets.set(ws, {
      ws,
      rooms: new Map(),
    });
  }

  private storeRoom(name: string): void {
    this.rooms.set(name, {
      name,
      sockets: new Map(),
    });
  }
}
