// IndexedDB storage utility for large media files (video blobs)
// This avoids exceeding Firestore's 1MB document limit while ensuring persistent offline-ready storage across reloads.

const DB_NAME = 'PlacementOS_MediaDB';
const DB_VERSION = 1;
const STORE_NAME = 'videoAnswers';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = (event) => {
      resolve((event.target as IDBOpenDBRequest).result);
    };

    request.onerror = (event) => {
      reject((event.target as IDBOpenDBRequest).error);
    };
  });
}

export async function saveVideoBlob(id: string, blob: Blob, duration: number): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const record = {
      id,
      blob,
      duration,
      mimeType: blob.type || 'video/webm',
      createdAt: new Date().toISOString(),
    };
    const req = store.put(record);

    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function getVideoBlob(id: string): Promise<{ blob: Blob; duration: number } | null> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const req = store.get(id);

      req.onsuccess = () => {
        if (req.result && req.result.blob) {
          resolve({ blob: req.result.blob, duration: req.result.duration || 0 });
        } else {
          resolve(null);
        }
      };
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error('Error fetching video from IndexedDB:', err);
    return null;
  }
}

export async function deleteVideoBlob(id: string): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const req = store.delete(id);

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error('Error deleting video from IndexedDB:', err);
  }
}

export async function hasVideoBlob(id: string): Promise<boolean> {
  try {
    const data = await getVideoBlob(id);
    return !!data;
  } catch {
    return false;
  }
}
