import { openDB } from 'idb';

const DB_NAME = 'AustralCollectorDB';
const DB_VERSION = 1;
const STORE_NAME = 'offline-posts';

// Initialize IndexedDB database
export const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    },
  });
};

// Save a post locally when offline
export const savePostOffline = async (postData) => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  await tx.store.add({
    ...postData,
    timestamp: Date.now()
  });
  await tx.done;
  console.log('Post saved offline successfully.');
  window.dispatchEvent(new CustomEvent('SYNC_QUEUE_CHANGED'));
};

// Get all offline posts
export const getOfflinePosts = async () => {
  const db = await initDB();
  return db.getAll(STORE_NAME);
};

// Remove a synced post from offline storage
export const removeOfflinePost = async (id) => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  await tx.store.delete(id);
  await tx.done;
  window.dispatchEvent(new CustomEvent('SYNC_QUEUE_CHANGED'));
};

// Sync all offline posts with the server
export const syncOfflinePosts = async (apiUrl) => {
  if (!navigator.onLine) return; // Prevent sync if still offline

  const posts = await getOfflinePosts();
  if (posts.length === 0) return; // Nothing to sync

  console.log(`☁️ Syncing ${posts.length} offline posts to server...`);

  for (const post of posts) {
    try {
      const formData = new FormData();
      formData.append('tipo', post.tipo);
      formData.append('nombre', post.nombre);
      formData.append('descripcion', post.descripcion || '');
      if (post.hashtags) formData.append('hashtags', JSON.stringify(post.hashtags));
      if (post.anio) formData.append('anio', post.anio);
      
      let url = '';
      
      if (post.isEditing) {
        formData.append('id', post.id_original);
        formData.append('tipo_original', post.tipo_original);
        url = `${apiUrl}/auth/editar_post.php`;
        
        const order = [];
        let newImageIndex = 0;
        
        post.imagesBase64.forEach((imgObj) => {
          if (imgObj.isKept) {
            order.push(imgObj.originalUrl);
          } else {
            order.push(`new_${newImageIndex}`);
            // Convert base64 back to file
            const file = base64ToFile(imgObj.base64, imgObj.name);
            formData.append('images[]', file);
            newImageIndex++;
          }
        });
        formData.append('media_order', JSON.stringify(order));
        
      } else {
        formData.append('user_id', post.user_id);
        url = `${apiUrl}/auth/publicar_post.php`;
        
        post.imagesBase64.forEach((imgObj) => {
          const file = base64ToFile(imgObj.base64, imgObj.name);
          formData.append('images[]', file);
        });
      }

      const response = await fetch(url, { method: 'POST', body: formData });
      const data = await response.json();
      
      if (data.success) {
        console.log(`✅ Synced post ID: ${post.id}`);
        await removeOfflinePost(post.id);
      } else {
        console.error(`❌ Failed to sync post ID: ${post.id}`, data.error);
        window.dispatchEvent(new CustomEvent('SYNC_ERROR', { detail: data.error }));
      }
    } catch (e) {
      console.error(`🔌 Sync interrupted for post ID: ${post.id}`, e);
      window.dispatchEvent(new CustomEvent('SYNC_ERROR', { detail: e.message }));
    }
  }
};

// Convert File/Blob to Base64 (needed to store images in IndexedDB safely across browsers)
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

// Convert Base64 back to File/Blob for FormData upload
export const base64ToFile = (base64String, filename) => {
  const arr = base64String.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};
