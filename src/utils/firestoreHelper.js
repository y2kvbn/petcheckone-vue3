import { useStoreStore } from '@/stores/storeStore';

/**
 * Gets the dynamic collection path based on the current store.
 * @param {string} collectionName The name of the collection (e.g., 'customers', 'pets').
 * @returns {string} The full Firestore path for the collection.
 */
export function getCollectionPath(collectionName) {
  return collectionName;
}

/**
 * Gets the dynamic document path based on the current store.
 * @param {string} collectionName The name of the collection (e.g., 'customers', 'pets').
 * @param {string} docId The ID of the document.
 * @returns {string} The full Firestore path for the document.
 */
export function getDocPath(collectionName, docId) {
  if (!docId) {
    throw new Error('Document ID is required to create a document path.');
  }
  return `${getCollectionPath(collectionName)}/${docId}`;
}
