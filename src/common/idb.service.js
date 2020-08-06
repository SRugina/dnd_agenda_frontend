import { openDB } from "idb";

// eslint-disable-next-line no-unused-vars
const dbPromise = _ => {
  if (!("indexedDB" in window)) {
    throw new Error("Browser does not support IndexedDB");
  }
  return openDB("dndearallDB", 1, {
    upgrade(db) {
      console.log(db);
      if (!db.objectStoreNames.contains("auth")) {
        db.createObjectStore("auth");
      }
      if (!db.objectStoreNames.contains("group")) {
        db.createObjectStore("group");
      }
      if (!db.objectStoreNames.contains("groupInvites")) {
        db.createObjectStore("groupInvites");
      }
      if (!db.objectStoreNames.contains("groupRequests")) {
        db.createObjectStore("groupRequests");
      }
      if (!db.objectStoreNames.contains("home")) {
        db.createObjectStore("home");
      }
      if (!db.objectStoreNames.contains("profile")) {
        db.createObjectStore("profile");
      }
      if (!db.objectStoreNames.contains("searchGroups")) {
        db.createObjectStore("searchGroups");
      }
      if (!db.objectStoreNames.contains("searchProfiles")) {
        db.createObjectStore("searchProfiles");
      }
      if (!db.objectStoreNames.contains("session")) {
        db.createObjectStore("session");
      }
      if (!db.objectStoreNames.contains("sessionInvites")) {
        db.createObjectStore("sessionInvites");
      }
      if (!db.objectStoreNames.contains("sessionRequests")) {
        db.createObjectStore("sessionRequests");
      }
    }
    //etc. for each state we want to keep
  });
};

const saveToStorage = async (storeName, tasks) => {
  try {
    const db = await dbPromise();
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);
    store.put(tasks, storeName);
    return tx.complete;
  } catch (error) {
    return error;
  }
};

const checkStorage = async storeName => {
  try {
    const db = await dbPromise();
    const tx = db.transaction(storeName, "readonly");
    const store = tx.objectStore(storeName);
    return store.get(storeName);
  } catch (error) {
    return error;
  }
};

export default {
  checkStorage,
  saveToStorage
};
