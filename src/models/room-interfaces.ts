// Interfaces are governing the definition of data entering and exiting the user and room classes. 
// middleware ->
// classes -> 
export interface RoomOutput {
  guid: string;
  name: string;
  host: string;
  capacity: number;
  participants: string[];
}

export interface CreateRoomInput {
  name: string;
  host: string;
  capacity?: number;
}

export interface RoomDocument {
  _key: string;
  name: string;
  host: string;
  capacity: number;
  participants: string[];
}

export enum Action {
  Add = 'add',
  Remove = 'remove',
}
