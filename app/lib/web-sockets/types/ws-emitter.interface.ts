import { WebSocket } from 'ws';

export interface IWsEmitter {
  emit(event: string, data: Record<any, any>, roomName: string | string[]): Promise<void>;
  emit(event: string, data: Record<any, any>, ws: WebSocket | WebSocket[]): Promise<void>;
  subscribe(ws: WebSocket, roomName: string | string[]): void;
  unsubscribe(ws: WebSocket, roomName?: string | string[]): void;
  unsubscribeRoom(roomName: string | string[]): void;
}

export type Message = {
  event: string;
  data: Record<any, any>;
  meta: {
    timestamp: number;
  };
};
