import { insertOne, getByKey, update, executeAQL } from '../utils/arangodb';
import {
  RoomOutput,
  RoomDocument,
  CreateRoomInput,
  Action,
} from './room-interfaces';
import { arangoConfig } from '../config/arangodb';
import { NotAuthorizedError } from '../errors/not-authorized-error';
import { BadRequestError } from '../errors/bad-request-error';

const { rooms } = arangoConfig;

export class Room {
  constructor() {}

  async createRoom(createRoomInput: CreateRoomInput): Promise<RoomOutput> {
    const result = await insertOne(rooms, {
      ...createRoomInput,
      participants: [],
    });
    return this.formatDocument(result);
  }

  async changeHost(
    guid: string,
    currentUser: string,
    newHost: string,
  ): Promise<RoomOutput> {
    const room = await getByKey(rooms, guid);
    if (room.host !== currentUser) {
      throw new NotAuthorizedError();
    }
    const result = await update(rooms, guid, { host: newHost });
    return this.formatDocument(result);
  }

  async getRoomInfo(guid: string): Promise<RoomOutput> {
    const result = await getByKey(rooms, guid);
    return this.formatDocument(result);
  }

  async addRemoveParticipant(
    guid: string,
    username: string,
    action: Action,
  ): Promise<RoomOutput> {
    const room = await getByKey(rooms, guid);
    if (action === Action.Add && room.participants.length >= room.capacity) {
      throw new BadRequestError('Room is at maximum capacity.');
    }
    const newValue =
      action === Action.Add
        ? `{ participants: UNION_DISTINCT(r.participants, ["${username}"]) }`
        : `{ participants: REMOVE_VALUES(r.participants, ["${username}"]) }`;
    const aql = `FOR r IN rooms FILTER r._key == "${guid}" 
      UPDATE r WITH ${newValue} IN rooms RETURN NEW`;
    const result = await executeAQL(aql);
    return this.formatDocument(result[0]);
  }

  private formatDocument(roomDocument: RoomDocument): RoomOutput {
    const { _key: guid, name, capacity, host, participants } = roomDocument;
    return {
      guid,
      name,
      capacity,
      host,
      participants,
    };
  }
}
