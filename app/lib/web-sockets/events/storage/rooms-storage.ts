import { WebSocket } from 'ws';
import { IRoomsStorage, Room, Socket } from '../../types/rooms-storage.interface';

export class RoomsStorage implements IRoomsStorage {
  private readonly rooms: Map<string, Room> = new Map();
  private readonly sockets: Map<WebSocket, Socket> = new Map();

  public getWebSockets(roomName: string): WebSocket[] {
    const room = this.rooms.get(roomName);
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

  public addSocketToRoom(ws: WebSocket, roomName: string): void {
    let socket = this.sockets.get(ws);
    if (!socket) {
      socket = this.storeSocket(ws);
    }

    let room = this.rooms.get(roomName);
    if (!room) {
      room = this.storeRoom(roomName);
    }

    const isAlreadyAdded = socket.rooms.has(room.name);
    if (isAlreadyAdded) return;

    socket.rooms.set(room.name, room);
    room.sockets.set(ws, socket);
  }

  public removeSocketFromRoom(ws: WebSocket, roomName: string): void {
    const socket = this.sockets.get(ws);
    const room = this.rooms.get(roomName);
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

  public dropRoom(roomName: string): void {
    const room = this.rooms.get(roomName);
    if (!room) return;

    room.sockets.forEach((socket) => socket.rooms.delete(room.name));
    room.sockets = new Map();
  }

  private storeSocket(ws: WebSocket): Socket {
    const socket = {
      ws,
      rooms: new Map(),
    };
    this.sockets.set(ws, socket);
    return socket;
  }

  private storeRoom(name: string): Room {
    const room = {
      name,
      sockets: new Map(),
    };
    this.rooms.set(name, {
      name,
      sockets: new Map(),
    });
    return room;
  }
}
