import { pick } from 'ramda';

import { insertOne, getByKey, update, executeAQL } from '../services/arangodb';
import {
  RoomInput,
  RoomDbInput,
  RoomOutput,
  UpdateRoomInput,
  Type,
} from './room-interfaces';

export class Room {
  async save(roomInput: RoomInput): Promise<RoomOutput> {
    const result = await insertOne('rooms', this.formatDbInput(roomInput));
    return this.formatDbOutput(result);
  }

  async changeHost(guid: string, host: string): Promise<RoomOutput> {
    const result = await update('rooms', guid, { host });
    return this.formatDbOutput(result);
  }

  async updateRoom(
    _key: string,
    newValue: UpdateRoomInput,
  ): Promise<RoomOutput> {
    const user = await update('rooms', _key, newValue);
    return this.formatDbOutput(user);
  }

  async getRoom(guid: string): Promise<RoomOutput> {
    const result = await getByKey('rooms', guid);
    return this.formatDbOutput(result);
  }

  async addRemoveParticipant(
    _key: string,
    username: string,
    type: Type,
  ): Promise<RoomOutput> {
    console.log('types', type, Type.Add);
    const document =
      type === Type.Add
        ? `{ participants: UNION_DISTINCT(r.participants, ["${username}"]) }`
        : type === Type.Remove
        ? `{ participants: REMOVE_VALUES(r.participants, ["${username}"]) }`
        : '{}';
    const aql =
      `FOR r IN rooms FILTER r._key == "${_key}" UPDATE r WITH ` +
      document +
      ` IN rooms RETURN NEW`;
    const result = await executeAQL(aql);
    return this.formatDbOutput(result[0]);
  }

  async getUserRooms(username: string): Promise<Array<RoomOutput>> {
    const aql = `FOR r IN rooms 
    FILTER POSITION(r.participants[*], "${username}")
    RETURN r`;
    const result = await executeAQL(aql);
    return result.map(this.formatDbOutput);
  }

  private formatDbInput(roomInput: RoomInput): RoomDbInput {
    const { guid: _key, participants = [], ...others } = roomInput;
    return { ...others, _key, participants };
  }

  private formatDbOutput(roomDbOutput: any): RoomOutput {
    const { _key: guid } = roomDbOutput;
    return pick<
      RoomOutput,
      'guid' | 'capacity' | 'name' | 'host' | 'participants'
    >(['guid', 'capacity', 'name', 'host', 'participants'], {
      guid,
      ...roomDbOutput,
    });
  }
}
