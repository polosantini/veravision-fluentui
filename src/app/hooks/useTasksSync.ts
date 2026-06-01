import { useState, useEffect } from 'react';
import { getPersistedTasks, persistTask, type PersistedTaskState } from './useLocalStorage';

export function useTasksSync() {
  const [tasks, setTasks] = useState<PersistedTaskState[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = () => {
    setTasks(getPersistedTasks());
    setLoading(false);
  };

  useEffect(() => {
    refresh();
    const handler = () => refresh();
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  return { tasks, loading, refresh };
}

// Re-exportar persistTask para que los componentes puedan usarlo
export { persistTask };