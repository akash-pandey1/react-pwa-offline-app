import { openDB } from 'idb';

const DB_NAME = 'offlineRequestsDB';
const STORE_NAME = 'requests';

export async function initDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    },
  });
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

export async function saveRequest(request) {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  await tx.objectStore(STORE_NAME).add(request);
  await tx.done;
}

export async function getAllRequests() {
  const db = await initDB();
  return db.transaction(STORE_NAME).objectStore(STORE_NAME).getAll();
}

export async function clearRequest(id) {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  await tx.objectStore(STORE_NAME).delete(id);
  await tx.done;
}


/////users /////////////////

export async function saveUsersToDB(users) {
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    users.forEach((user) => store.put(user));
    await tx.done;
  }
  
  export async function getUsersFromDB() {
    const db = await initDB();
    return await db.getAll(STORE_NAME);
  }
  
  export async function clearUsersFromDB() {
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    await tx.objectStore(STORE_NAME).clear();
    await tx.done;
  }