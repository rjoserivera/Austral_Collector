import { useState, useEffect } from 'react';
import { getOfflinePosts } from '../utils/offlineSync';

export function useSyncStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingCount, setPendingCount] = useState(0);
  const [hasError, setHasError] = useState(false);

  const checkQueue = async () => {
    try {
      const posts = await getOfflinePosts();
      setPendingCount(posts.length);
      // Si la cola cambia, podríamos o no limpiar el error, depende de la lógica.
      // Si la cola llegó a cero es porque el error se solucionó o se eliminaron manualmente.
      if (posts.length === 0) setHasError(false);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    // Initial check
    checkQueue();

    const handleOnline = () => {
      setIsOnline(true);
      setHasError(false); // asume que podría arreglarse el error
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    const handleQueueChange = () => {
      checkQueue();
      // Si la cola cambia, asumimos progreso y limpiamos bandera de error temporaria
      setHasError(false);
    };

    const handleError = () => {
      setHasError(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('SYNC_QUEUE_CHANGED', handleQueueChange);
    window.addEventListener('SYNC_ERROR', handleError);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('SYNC_QUEUE_CHANGED', handleQueueChange);
      window.removeEventListener('SYNC_ERROR', handleError);
    };
  }, []);

  let status = 'online';
  if (hasError) {
    status = 'error';
  } else if (pendingCount > 0) {
    status = 'pending';
  } else if (!isOnline) {
    status = 'offline';
  }

  return { status, isOnline, pendingCount };
}
