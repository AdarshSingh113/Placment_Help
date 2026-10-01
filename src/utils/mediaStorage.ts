// Resilient Media Storage Utility with In-Memory Fast Cache + IndexedDB ArrayBuffer Persistence
// Uses ArrayBuffer storage in IndexedDB to prevent Safari/WebKit DataCloneError on Blobs.

const DB_NAME = 'PlacementOS_MediaDB';
const DB_VERSION = 2; // Incremented for ArrayBuffer schema compatibility
const STORE_NAME = 'videoAnswers';

interface MemoryCacheEntry {
  blob: Blob;
  url: string;
  duration: number;
}

// In-memory cache for zero-latency playback and iframe sandbox fallback
const memoryCache = new Map<string, MemoryCacheEntry>();

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      return reject(new Error('IndexedDB is not supported in this environment'));
    }

    try {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.error || new Error('Failed to open IndexedDB'));
      };

      request.onblocked = () => {
        console.warn('IndexedDB database open blocked');
      };
    } catch (err) {
      reject(err);
    }
  });
}

export async function saveVideoBlob(id: string, blob: Blob, duration: number): Promise<string> {
  // 1. Immediately cache in memory for instantaneous zero-delay access
  let currentUrl = memoryCache.get(id)?.url;
  if (currentUrl) {
    try { URL.revokeObjectURL(currentUrl); } catch (_) {}
  }
  const objectUrl = URL.createObjectURL(blob);
  memoryCache.set(id, { blob, url: objectUrl, duration });

  // 2. Persist to IndexedDB as ArrayBuffer (avoids Safari DataCloneError with Blobs)
  try {
    const arrayBuffer = await blob.arrayBuffer();
    const db = await openDB();

    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const record = {
        id,
        buffer: arrayBuffer,
        duration,
        mimeType: blob.type || 'video/webm',
        createdAt: new Date().toISOString(),
      };
      const req = store.put(record);

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
      transaction.onerror = () => reject(transaction.error);
    });
  } catch (err) {
    console.warn('IndexedDB persistence skipped or failed, using memory cache:', err);
  }

  return objectUrl;
}

export async function getVideoBlob(id: string): Promise<{ blob: Blob; url: string; duration: number } | null> {
  // 1. Return from fast memory cache if available
  const inMemory = memoryCache.get(id);
  if (inMemory) {
    return inMemory;
  }

  // 2. Read from IndexedDB
  try {
    const db = await openDB();
    return await new Promise((resolve) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const req = store.get(id);

      req.onsuccess = () => {
        const result = req.result;
        if (!result) {
          return resolve(null);
        }

        let blob: Blob;
        if (result.buffer instanceof ArrayBuffer) {
          blob = new Blob([result.buffer], { type: result.mimeType || 'video/webm' });
        } else if (result.blob instanceof Blob) {
          blob = result.blob;
        } else {
          return resolve(null);
        }

        const url = URL.createObjectURL(blob);
        const duration = result.duration || 0;
        const entry: MemoryCacheEntry = { blob, url, duration };
        memoryCache.set(id, entry);
        resolve(entry);
      };

      req.onerror = () => {
        resolve(null);
      };
    });
  } catch (err) {
    console.warn('Error reading from IndexedDB:', err);
    return null;
  }
}

export async function deleteVideoBlob(id: string): Promise<void> {
  // 1. Revoke and remove from memory cache
  const inMemory = memoryCache.get(id);
  if (inMemory?.url) {
    try { URL.revokeObjectURL(inMemory.url); } catch (_) {}
  }
  memoryCache.delete(id);

  // 2. Remove from IndexedDB
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const req = store.delete(id);

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Error deleting from IndexedDB:', err);
  }
}

export async function hasVideoBlob(id: string): Promise<boolean> {
  if (memoryCache.has(id)) return true;
  try {
    const data = await getVideoBlob(id);
    return !!data;
  } catch {
    return false;
  }
}
