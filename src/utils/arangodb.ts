import { Database } from 'arangojs';
import { ConflictingKeyError } from '../errors/conflicting-key';
import { DocumentNotFoundError } from '../errors/document-not-found';
import { arangoConfig } from '../config/arangodb';

const { url, username, password, users, rooms, dbName } = arangoConfig;

let db: Database;

export const setupArango = async () => {
  db = new Database(url);
  db.useBasicAuth(username, password);
  const dbs = await db.listDatabases();
  if (!dbs.includes(dbName)) {
    await db.createDatabase(dbName);
  }
  db.useDatabase(dbName);

  const verticeNames = [users, rooms];
  const collections = await db.listCollections();
  const collectionNames = collections.map((collection: any) => collection.name);
  const promises = verticeNames.map(async (verticeName) => {
    if (!collectionNames.includes(verticeName)) {
      const vertice = db.collection(verticeName);
      await vertice.create({ waitForSync: true });
    }
  });
  await Promise.all(promises);
};

export const insertOne = async (collectionName: string, body: any) => {
  try {
    const collection = db.collection(collectionName);
    const result = await collection.save(body, {
      returnNew: true,
    });
    return result.new;
  } catch (err) {
    if (err.errorNum === 1210) {
      throw new ConflictingKeyError();
    } else {
      throw err;
    }
  }
};

export const getByKey = async (collectionName: string, _key: string) => {
  const collection = db.collection(collectionName);
  const result: any[] = await collection.lookupByKeys([_key]);
  if (!result[0]) {
    throw new DocumentNotFoundError();
  }
  return result[0];
};

export const getAll = async (collectionName: string) => {
  const collection = db.collection(collectionName);
  const result: any = await collection.all();
  return result._result;
};

export const update = async (
  collectionName: string,
  documentHandle: string,
  newValue: object,
) => {
  try {
    const collection = db.collection(collectionName);
    const result = await collection.update(documentHandle, newValue, {
      returnNew: true,
    });
    return result.new;
  } catch (err) {
    if (err.errorNum === 1202) {
      throw new DocumentNotFoundError();
    } else {
      throw err;
    }
  }
};

export const deleteOne = async (collectionName: string, _key: string) => {
  const collection = db.collection(collectionName);
  const result = await collection.remove(_key, { returnOld: true });
  return result.old;
};

export const executeAQL = async (aql: string) => {
  const cursor = await db.query(aql);
  return await cursor.all();
};
