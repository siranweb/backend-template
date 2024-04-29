import { WebSocket } from 'ws';
import { RoomsStorage } from './storage/rooms-storage';
import { IRoomsStorage } from '../types/rooms-storage.interface';
import { IWsEmitter, Message } from '../types/ws-emitter.interface';

export class WsEmitter implements IWsEmitter {
  private readonly roomsStorage: IRoomsStorage = new RoomsStorage();

  public async emit(
    event: string,
    data: Record<any, any>,
    roomNameOrWs: string | string[] | WebSocket | WebSocket[],
  ): Promise<void> {
    const messageObj: Message = {
      event,
      data,
      meta: {
        timestamp: Date.now(),
      },
    };
    const message = JSON.stringify(messageObj);

    const roomNameOrWsArr = Array.isArray(roomNameOrWs) ? roomNameOrWs : [roomNameOrWs];
    if (roomNameOrWsArr.length === 0) return;

    const areWebSockets = roomNameOrWsArr[0] instanceof WebSocket;
    const areRoomNames = typeof roomNameOrWsArr[0] === 'string';

    if (areWebSockets) {
      const webSockets = roomNameOrWsArr as WebSocket[];
      const promises = webSockets.map((ws) => this.sendMessageToWs(ws, message));

      await Promise.all(promises);
      return;
    }

    if (areRoomNames) {
      const roomNames = roomNameOrWsArr as string[];
      const promises: Promise<void>[] = [];
      roomNames.forEach((roomName) => {
        const webSockets = this.roomsStorage.getWebSockets(roomName);
        webSockets.forEach((ws) => promises.push(this.sendMessageToWs(ws, message)));
      });

      await Promise.all(promises);
      return;
    }
  }

  public subscribe(ws: WebSocket, roomName: string | string[]): void {
    const roomNames = Array.isArray(roomName) ? roomName : [roomName];
    roomNames.forEach((roomName) => this.roomsStorage.addSocketToRoom(ws, roomName));
  }

  public unsubscribe(ws: WebSocket, roomName?: string | string[]): void {
    if (!roomName) {
      this.roomsStorage.dropSocket(ws);
      return;
    }

    const roomNames = Array.isArray(roomName) ? roomName : [roomName];
    roomNames.forEach((roomName) => this.roomsStorage.removeSocketFromRoom(ws, roomName));
  }

  public unsubscribeRoom(roomName: string | string[]): void {
    const roomNames = Array.isArray(roomName) ? roomName : [roomName];
    roomNames.forEach((roomName) => this.roomsStorage.dropRoom(roomName));
  }

  private async sendMessageToWs(ws: WebSocket, message: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      try {
        ws.send(message, (error?: any) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
      } catch (e) {
        reject(e);
      }
    });
  }
}
