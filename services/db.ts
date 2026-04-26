import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Recording } from '../types';

interface HueDB extends DBSchema {
  recordings: {
    key: string;
    value: Recording;
    indexes: { 'by-date': string };
  };
}

const DB_NAME = 'hue-db';
const STORE_NAME = 'recordings';

let dbPromise: Promise<IDBPDatabase<HueDB>>;

export const initDB = () => {
  if (!dbPromise) {
    dbPromise = openDB<HueDB>(DB_NAME, 1, {
      upgrade(db) {
        const store = db.createObjectStore(STORE_NAME, {
          keyPath: 'id',
        });
        store.createIndex('by-date', 'date');
      },
    });
  }
  return dbPromise;
};

export const saveRecordingToDB = async (recording: Recording) => {
  const db = await initDB();
  return db.put(STORE_NAME, recording);
};

export const getRecordingsFromDB = async (): Promise<Recording[]> => {
  const db = await initDB();
  return db.getAll(STORE_NAME);
};

export const deleteRecordingFromDB = async (id: string) => {
    const db = await initDB();
    return db.delete(STORE_NAME, id);
}

export const clearAllRecordingsFromDB = async () => {
  const db = await initDB();
  return db.clear(STORE_NAME);
};
