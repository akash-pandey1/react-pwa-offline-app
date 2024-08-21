import { openDB } from 'idb';

const DB_NAME = 'offlineDB';
const STORE_NAME = 'posts';

export async function initDB() {
  const db = await openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    },
  });
  return db;
}

export async function savePostsToDB(posts) {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  posts.forEach((post) => store.put(post));
  await tx.done;
}

export async function getPostsFromDB() {
  const db = await initDB();
  return await db.getAll(STORE_NAME);
}

export async function clearPostsFromDB() {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  await tx.objectStore(STORE_NAME).clear();
  await tx.done;
}
