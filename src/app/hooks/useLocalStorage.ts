import { useState } from "react";
import type { Alert } from "../data/mock-data";
import { patients as mockPatients, type Patient, type ContactRecord, type Task } from "../data/mock-data";

// ---------- Helper para revivir fechas ----------
function reviveDates(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === "string") {
    const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z?$/;
    if (isoDateRegex.test(obj)) {
      const date = new Date(obj);
      if (!isNaN(date.getTime())) return date;
    }
    return obj;
  }
  if (Array.isArray(obj)) return obj.map(reviveDates);
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

// ---------- Hook genérico ----------
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) return reviveDates(JSON.parse(item));
      return initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      const serialized = JSON.stringify(valueToStore);
      window.localStorage.setItem(key, serialized);
      window.dispatchEvent(new StorageEvent("storage", { key, newValue: serialized }));
    } catch (error) {
      console.error(`Error saving ${key}:`, error);
    }
  };

  return [storedValue, setValue] as const;
}

// ---------- Pacientes ----------
export function getPersistedPatients(): Patient[] {
  try {
    const item = window.localStorage.getItem("veravision_patients");
    return item ? reviveDates(JSON.parse(item)) : [];
  } catch {
    return [];
  }
}

export function setPersistedPatients(patients: Patient[]) {
  const serialized = JSON.stringify(patients);
  window.localStorage.setItem("veravision_patients", serialized);
  window.dispatchEvent(new StorageEvent("storage", { key: "veravision_patients", newValue: serialized }));
}

// Actualiza un paciente a partir de una tarea completada con éxito
export function updatePatientFromCompletedTask(
  task: Task,
  contactResult: string,
  notes: string,
  canalUsado: string
) {
  let patients = getPersistedPatients();
  if (patients.length === 0) patients = [...mockPatients];

  const patientIndex = patients.findIndex((p) => p.id === task.pacienteId);
  if (patientIndex === -1) return;

  const patient = patients[patientIndex];

  // 1. Registrar nuevo contacto en historial
  const newContact: ContactRecord = {
    fecha: new Date(),
    tipo: canalUsado === "llamada" ? "llamada" : "whatsapp",
    motivo: task.tipo,
    resultado: contactResult as ContactRecord["resultado"],
    notas: notes,
    asesor: task.asesorAsignado,
  };
  const updatedHistory = [newContact, ...(patient.historialContactos || [])].slice(0, 10);

  // 2. Actualizar fecha de último control
  const updatedLastControl = new Date();

  // 3. Según el tipo de tarea, actualizar estado del paciente y fecha de vencimiento de fórmula
  let updatedEstado = patient.estado;
  let updatedFormulaDate = patient.fechaVencimientoFormula;

  switch (task.tipo) {
    case "post-venta":
      if (patient.estado === "post-venta") updatedEstado = "seguimiento-3m";
      break;
    case "control-3m":
      if (patient.estado === "seguimiento-3m") updatedEstado = "control-6m";
      break;
    case "control-6m":
      if (patient.estado === "control-6m") updatedEstado = "renovacion-1a";
      break;
    case "renovacion":
      if (patient.estado === "renovacion-1a") updatedEstado = "post-venta";
      // Renovar fórmula: sumar 1 año
      updatedFormulaDate = new Date();
      updatedFormulaDate.setFullYear(updatedFormulaDate.getFullYear() + 1);
      break;
    // otros tipos (entrega, reclamo) no cambian estado
  }

  const updatedPatient: Patient = {
    ...patient,
    historialContactos: updatedHistory,
    fechaUltimoControl: updatedLastControl,
    estado: updatedEstado,
    fechaVencimientoFormula: updatedFormulaDate,
  };

  patients[patientIndex] = updatedPatient;
  setPersistedPatients(patients);
}

// ---------- Tareas ----------
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
    if (index >= 0) tasks[index] = taskState;
    else tasks.push(taskState);
    const serialized = JSON.stringify(tasks);
    window.localStorage.setItem("veravision_tasks", serialized);
    window.dispatchEvent(new StorageEvent("storage", { key: "veravision_tasks", newValue: serialized }));
  } catch (error) {
    console.error("Error persisting task:", error);
  }
}

export function getTaskState(taskId: string): PersistedTaskState | undefined {
  return getPersistedTasks().find((t) => t.id === taskId);
}

// ---------- Alertas ----------
export function getPersistedAlerts(): Alert[] {
  try {
    const item = window.localStorage.getItem("veravision_alerts");
    return item ? reviveDates(JSON.parse(item)) : [];
  } catch {
    return [];
  }
}

export function persistAlert(id: string, leida: boolean) {
  try {
    let alerts = getPersistedAlerts();
    if (alerts.length === 0) {
      import("../data/mock-data").then(({ alerts: mockAlerts }) => {
        alerts = mockAlerts.map((a) => ({ ...a }));
        const index = alerts.findIndex((a) => a.id === id);
        if (index !== -1) alerts[index].leida = leida;
        const serialized = JSON.stringify(alerts);
        window.localStorage.setItem("veravision_alerts", serialized);
        window.dispatchEvent(new StorageEvent("storage", { key: "veravision_alerts", newValue: serialized }));
      });
      return;
    }
    const index = alerts.findIndex((a) => a.id === id);
    if (index !== -1) alerts[index].leida = leida;
    const serialized = JSON.stringify(alerts);
    window.localStorage.setItem("veravision_alerts", serialized);
    window.dispatchEvent(new StorageEvent("storage", { key: "veravision_alerts", newValue: serialized }));
  } catch (error) {
    console.error("Error persisting alert:", error);
  }
}