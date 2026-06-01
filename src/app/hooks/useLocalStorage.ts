import { useState } from "react";

// ------------------------------------------------------------
// Helper: reviveDates convierte strings ISO 8601 a objetos Date
// ------------------------------------------------------------
function reviveDates(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === "string") {
    // Patrón para fechas ISO: 2025-01-15T03:00:00.000Z
    const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z?$/;
    if (isoDateRegex.test(obj)) {
      const date = new Date(obj);
      if (!isNaN(date.getTime())) return date;
    }
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => reviveDates(item));
  }
  if (typeof obj === "object") {
    const newObj: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        newObj[key] = reviveDates(obj[key]);
      }
    }
    return newObj;
  }
  return obj;
}

// ------------------------------------------------------------
// Hook principal: useLocalStorage
// ------------------------------------------------------------
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        const parsed = JSON.parse(item);
        // Convertir fechas automáticamente
        return reviveDates(parsed);
      }
      return initialValue;
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  };

  return [storedValue, setValue] as const;
}

// ------------------------------------------------------------
// Tipos y funciones específicas para tareas (PersistedTaskState)
// ------------------------------------------------------------
export interface PersistedTaskState {
  id: string;
  estado: "pendiente" | "en-progreso" | "completada" | "vencida" | "cancelada";
  updatedAt: string;
  prioridad?: "urgente" | "alta" | "media" | "baja";
  notaPrioridad?: string;
  notasAsesora?: string;
  tipoTarea?: "post-venta" | "control-3m" | "control-6m" | "renovacion" | "entrega" | "reclamo";
  canalUsado?: "llamada" | "whatsapp";
  resultadoContacto?: "exitoso" | "no-contesta" | "reagendar" | "no-interesado";
}

export function getPersistedTasks(): PersistedTaskState[] {
  try {
    const item = window.localStorage.getItem("veravision_tasks");
    return item ? JSON.parse(item) : [];
  } catch {
    return [];
  }
}

export function persistTask(taskState: PersistedTaskState) {
  try {
    const tasks = getPersistedTasks();
    const index = tasks.findIndex((t) => t.id === taskState.id);
    if (index >= 0) {
      tasks[index] = taskState;
    } else {
      tasks.push(taskState);
    }
    window.localStorage.setItem("veravision_tasks", JSON.stringify(tasks));
  } catch (error) {
    console.error("Error persisting task:", error);
  }
}

export function getTaskState(taskId: string): PersistedTaskState | undefined {
  const tasks = getPersistedTasks();
  return tasks.find((t) => t.id === taskId);
}