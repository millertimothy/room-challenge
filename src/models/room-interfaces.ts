export interface RoomInput {
  guid?: string;
  name: string;
  host: string;
  capacity: number;
  participants?: string[];
}

export interface UpdateRoomInput {
  name?: string;
  host?: string;
  capacity?: number;
  participants?: string[];
}

export interface RoomDbInput {
  _key?: string;
  name: string;
  host: string;
  capacity: number;
  participants: string[];
}

export interface RoomOutput {
  guid: string;
  name: string;
  host: string;
  capacity: number;
  participants: string[];
}

export enum Type {
  Add = 'add',
  Remove = 'remove',
}
