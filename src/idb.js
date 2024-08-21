import { openDB } from 'idb';

const DB_NAME = 'offlineRequestsDB';
const DB_VERSION = 1;

const STORE_NAME = 'requests';

export async function initDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
        if (!db.objectStoreNames.contains('posts')) {
            db.createObjectStore('posts', { keyPath: 'id', autoIncrement: true });
          }
          
          // Create another object store for comments
          if (!db.objectStoreNames.contains('users')) {
            db.createObjectStore('users', { keyPath: 'id', autoIncrement: true });
          }
    },
  });
}

export async function savePostsToDB(posts) {
    const db = await initDB();
    const tx = db.transaction('posts', 'readwrite');
    const store = tx.objectStore('posts');
    posts.forEach((post) => store.put(post));
    await tx.done;
  }
  
  export async function getPostsFromDB() {
    const db = await initDB();
    return await db.getAll('posts');
  }
  
  export async function clearPostsFromDB() {
    const db = await initDB();
    const tx = db.transaction('posts', 'readwrite');
    await tx.objectStore('posts').clear();
    await tx.done;
  }

export async function saveRequest(post) {
  const db = await initDB();
  const tx = db.transaction('requests', 'readwrite');
  await tx.objectStore('requests').add(post);
  await tx.done;
}

export async function getAllRequests() {
  const db = await initDB();
  return db.transaction('requests').objectStore('requests').getAll();
}

export async function clearRequest(id) {
  const db = await initDB();
  const tx = db.transaction('requests', 'readwrite');
  await tx.objectStore('requests').delete(id);
  await tx.done;
}


/////users /////////////////

export async function saveUsersToDB(users) {
    const db = await initDB();
    const tx = db.transaction('users', 'readwrite');
    const store = tx.objectStore('users');
    users.forEach((user) => store.put(user));
    await tx.done;
  }
  
  export async function getUsersFromDB() {
    const db = await initDB();
    return await db.getAll('users');
  }
  
  export async function clearUsersFromDB() {
    const db = await initDB();
    const tx = db.transaction('users', 'readwrite');
    await tx.objectStore('users').clear();
    await tx.done;
  }