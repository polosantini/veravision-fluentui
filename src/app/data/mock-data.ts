import { addDays, subDays, subMonths } from "date-fns";

const today = new Date();

export type PatientStatus =
  | "post-venta"
  | "seguimiento-3m"
  | "control-6m"
  | "renovacion-1a"
  | "inactivo";

export type TaskPriority = "urgente" | "alta" | "media" | "baja";
export type TaskStatus = "pendiente" | "en-progreso" | "completada" | "vencida";

export interface Patient {
  id: string;
  nombre: string;
  tipoDocumento: "CC" | "CE" | "NIT" | "Pasaporte";
  numeroDocumento: string; // solo dígitos, sin puntos ni comas
  telefono: string; // formateado como "321 6549870"
  email: string;
  fechaUltimaCompra: Date;
  fechaUltimoControl: Date;
  fechaVencimientoFormula: Date;
  productoComprado: string;
  asesorAsignado: string;
  estado: PatientStatus;
  valorUltimaCompra: number;
  totalCompras: number;
  historialContactos: ContactRecord[];
}

export interface ContactRecord {
  fecha: Date;
  tipo: "llamada" | "whatsapp" | "presencial" | "email";
  motivo: string;
  resultado: "exitoso" | "no-contesta" | "reagendar" | "no-interesado";
  notas: string;
  asesor: string;
}

export interface Task {
  id: string;
  pacienteId: string;
  pacienteNombre: string;
  tipo: "post-venta" | "control-3m" | "control-6m" | "renovacion" | "entrega" | "reclamo";
  prioridad: TaskPriority;
  estado: TaskStatus;
  fechaCreacion: Date;
  fechaLimite: Date;
  asesorAsignado: string;
  descripcion: string;
  canalSugerido: "llamada" | "whatsapp";
  intentos: number;
}

export interface Advisor {
  id: string;
  nombre: string;
  avatar: string;
  tareasCompletadasHoy: number;
  tareasAsignadas: number;
  tasaContacto: number;
  activo: boolean;
}

export interface Alert {
  id: string;
  pacienteId: string;
  pacienteNombre: string;
  tipo: "formula-vencida" | "control-pendiente" | "sin-contacto" | "recompra" | "cumpleanos";
  mensaje: string;
  fecha: Date;
  leida: boolean;
  prioridad: TaskPriority;
}

export type IssueStatus = "pendiente" | "en-revision" | "resuelta" | "descartada";
export type IssueCategory = "tecnico" | "paciente" | "proceso" | "sistema" | "otro";

export interface Issue {
  id: string;
  titulo: string;
  descripcion: string;
  categoria: IssueCategory;
  prioridad: TaskPriority;
  estado: IssueStatus;
  reportadoPor: string;
  reportadoPorNombre: string;
  fechaReporte: Date;
  fechaResolucion?: Date;
  notas?: string;
  resolucion?: string;
}

// --- Mock Advisors ---
export const advisors: Advisor[] = [
  { id: "a1", nombre: "Carlos Méndez", avatar: "CM", tareasCompletadasHoy: 8, tareasAsignadas: 12, tasaContacto: 78, activo: true },
  { id: "a2", nombre: "Laura Gómez", avatar: "LG", tareasCompletadasHoy: 6, tareasAsignadas: 10, tasaContacto: 85, activo: true },
  { id: "a3", nombre: "Andrés Ruiz", avatar: "AR", tareasCompletadasHoy: 3, tareasAsignadas: 9, tasaContacto: 62, activo: true },
  { id: "a4", nombre: "María Torres", avatar: "MT", tareasCompletadasHoy: 5, tareasAsignadas: 8, tasaContacto: 91, activo: false },
];

// --- Mock Patients (con tipoDocumento y numeroDocumento) ---
export const patients: Patient[] = [
  {
    id: "p1", nombre: "Jorge Hernández", tipoDocumento: "CC", numeroDocumento: "1023456789", telefono: "310 5550101", email: "jorge.h@email.com",
    fechaUltimaCompra: subDays(today, 5), fechaUltimoControl: subDays(today, 5), fechaVencimientoFormula: addDays(today, 360),
    productoComprado: "Lentes progresivos Varilux", asesorAsignado: "a1", estado: "post-venta", valorUltimaCompra: 850000, totalCompras: 3,
    historialContactos: [
      { fecha: subDays(today, 3), tipo: "llamada", motivo: "Seguimiento post-venta", resultado: "exitoso", notas: "Paciente satisfecho con la adaptación", asesor: "Carlos Méndez" },
    ]
  },
  {
    id: "p2", nombre: "Ana María López", tipoDocumento: "CC", numeroDocumento: "52789123", telefono: "320 5550202", email: "ana.lopez@email.com",
    fechaUltimaCompra: subMonths(today, 3), fechaUltimoControl: subMonths(today, 3), fechaVencimientoFormula: addDays(today, 270),
    productoComprado: "Lentes CR-39 monofocales", asesorAsignado: "a2", estado: "seguimiento-3m", valorUltimaCompra: 320000, totalCompras: 1,
    historialContactos: []
  },
  {
    id: "p3", nombre: "Roberto Castaño", tipoDocumento: "CC", numeroDocumento: "80456321", telefono: "300 5550303", email: "r.castano@email.com",
    fechaUltimaCompra: subMonths(today, 6), fechaUltimoControl: subMonths(today, 6), fechaVencimientoFormula: addDays(today, 180),
    productoComprado: "Montura Ray-Ban + lentes transitions", asesorAsignado: "a1", estado: "control-6m", valorUltimaCompra: 1200000, totalCompras: 5,
    historialContactos: [
      { fecha: subMonths(today, 4), tipo: "whatsapp", motivo: "Recordatorio control 3 meses", resultado: "exitoso", notas: "Confirma que ve bien", asesor: "Carlos Méndez" },
    ]
  },
  {
    id: "p4", nombre: "Claudia Ramírez", tipoDocumento: "CE", numeroDocumento: "39654987", telefono: "315 5550404", email: "claudia.r@email.com",
    fechaUltimaCompra: subMonths(today, 11), fechaUltimoControl: subMonths(today, 8), fechaVencimientoFormula: addDays(today, 30),
    productoComprado: "Lentes de contacto mensuales", asesorAsignado: "a3", estado: "renovacion-1a", valorUltimaCompra: 450000, totalCompras: 8,
    historialContactos: [
      { fecha: subMonths(today, 5), tipo: "llamada", motivo: "Control semestral", resultado: "reagendar", notas: "No pudo asistir, reagendar", asesor: "Andrés Ruiz" },
    ]
  },
  {
    id: "p5", nombre: "Fernando Díaz", tipoDocumento: "CC", numeroDocumento: "1098765432", telefono: "318 5550505", email: "f.diaz@email.com",
    fechaUltimaCompra: subMonths(today, 14), fechaUltimoControl: subMonths(today, 14), fechaVencimientoFormula: subMonths(today, 2),
    productoComprado: "Gafas de sol graduadas", asesorAsignado: "a2", estado: "inactivo", valorUltimaCompra: 680000, totalCompras: 2,
    historialContactos: [
      { fecha: subMonths(today, 12), tipo: "llamada", motivo: "Renovación anual", resultado: "no-contesta", notas: "Sin respuesta 3 intentos", asesor: "Laura Gómez" },
    ]
  },
  {
    id: "p6", nombre: "Patricia Vargas", tipoDocumento: "CC", numeroDocumento: "41321654", telefono: "311 5550606", email: "p.vargas@email.com",
    fechaUltimaCompra: subDays(today, 2), fechaUltimoControl: subDays(today, 2), fechaVencimientoFormula: addDays(today, 363),
    productoComprado: "Lentes bifocales + montura Oakley", asesorAsignado: "a4", estado: "post-venta", valorUltimaCompra: 950000, totalCompras: 6,
    historialContactos: []
  },
  {
    id: "p7", nombre: "Miguel Ángel Torres", tipoDocumento: "CC", numeroDocumento: "79852147", telefono: "322 5550707", email: "m.torres@email.com",
    fechaUltimaCompra: subMonths(today, 5), fechaUltimoControl: subMonths(today, 5), fechaVencimientoFormula: addDays(today, 210),
    productoComprado: "Lentes antirreflejo", asesorAsignado: "a3", estado: "seguimiento-3m", valorUltimaCompra: 280000, totalCompras: 1,
    historialContactos: [
      { fecha: subMonths(today, 3), tipo: "llamada", motivo: "Seguimiento 3 meses", resultado: "no-contesta", notas: "", asesor: "Andrés Ruiz" },
    ]
  },
  {
    id: "p8", nombre: "Sandra Milena Ortiz", tipoDocumento: "CC", numeroDocumento: "52963741", telefono: "314 5550808", email: "s.ortiz@email.com",
    fechaUltimaCompra: subMonths(today, 7), fechaUltimoControl: subMonths(today, 4), fechaVencimientoFormula: addDays(today, 150),
    productoComprado: "Lentes progresivos digitales", asesorAsignado: "a1", estado: "control-6m", valorUltimaCompra: 1100000, totalCompras: 4,
    historialContactos: [
      { fecha: subMonths(today, 4), tipo: "presencial", motivo: "Ajuste de montura", resultado: "exitoso", notas: "Se ajustó y quedó bien", asesor: "Carlos Méndez" },
    ]
  },
  {
    id: "p9", nombre: "Diego Alejandro Peña", tipoDocumento: "CC", numeroDocumento: "1045678912", telefono: "316 5550909", email: "d.pena@email.com",
    fechaUltimaCompra: subMonths(today, 10), fechaUltimoControl: subMonths(today, 7), fechaVencimientoFormula: addDays(today, 60),
    productoComprado: "Gafas deportivas graduadas", asesorAsignado: "a2", estado: "renovacion-1a", valorUltimaCompra: 520000, totalCompras: 2,
    historialContactos: []
  },
  {
    id: "p10", nombre: "Lucía Fernanda Castro", tipoDocumento: "CE", numeroDocumento: "39741852", telefono: "319 5551010", email: "l.castro@email.com",
    fechaUltimaCompra: subMonths(today, 18), fechaUltimoControl: subMonths(today, 18), fechaVencimientoFormula: subMonths(today, 6),
    productoComprado: "Lentes CR-39 + montura económica", asesorAsignado: "a3", estado: "inactivo", valorUltimaCompra: 180000, totalCompras: 1,
    historialContactos: []
  },
];

// --- Mock Tasks (sin cambios) ---
export const tasks: Task[] = [
  { id: "t1", pacienteId: "p6", pacienteNombre: "Patricia Vargas", tipo: "post-venta", prioridad: "alta", estado: "pendiente", fechaCreacion: subDays(today, 1), fechaLimite: addDays(today, 2), asesorAsignado: "a4", descripcion: "Llamar para confirmar adaptación a bifocales", canalSugerido: "llamada", intentos: 0 },
  { id: "t2", pacienteId: "p1", pacienteNombre: "Jorge Hernández", tipo: "post-venta", prioridad: "media", estado: "completada", fechaCreacion: subDays(today, 5), fechaLimite: subDays(today, 2), asesorAsignado: "a1", descripcion: "Seguimiento adaptación progresivos", canalSugerido: "llamada", intentos: 1 },
  { id: "t3", pacienteId: "p2", pacienteNombre: "Ana María López", tipo: "control-3m", prioridad: "alta", estado: "pendiente", fechaCreacion: subDays(today, 2), fechaLimite: addDays(today, 5), asesorAsignado: "a2", descripcion: "Control de 3 meses - verificar satisfacción", canalSugerido: "whatsapp", intentos: 0 },
  { id: "t4", pacienteId: "p3", pacienteNombre: "Roberto Castaño", tipo: "control-6m", prioridad: "urgente", estado: "pendiente", fechaCreacion: subDays(today, 3), fechaLimite: today, asesorAsignado: "a1", descripcion: "Control semestral - agendar cita de revisión", canalSugerido: "llamada", intentos: 0 },
  { id: "t5", pacienteId: "p4", pacienteNombre: "Claudia Ramírez", tipo: "renovacion", prioridad: "urgente", estado: "pendiente", fechaCreacion: subDays(today, 7), fechaLimite: subDays(today, 1), asesorAsignado: "a3", descripcion: "Fórmula próxima a vencer - agendar renovación", canalSugerido: "llamada", intentos: 2 },
  { id: "t6", pacienteId: "p5", pacienteNombre: "Fernando Díaz", tipo: "renovacion", prioridad: "alta", estado: "vencida", fechaCreacion: subMonths(today, 1), fechaLimite: subDays(today, 14), asesorAsignado: "a2", descripcion: "Fórmula vencida - contactar para renovar", canalSugerido: "llamada", intentos: 3 },
  { id: "t7", pacienteId: "p7", pacienteNombre: "Miguel Ángel Torres", tipo: "control-3m", prioridad: "alta", estado: "en-progreso", fechaCreacion: subDays(today, 4), fechaLimite: addDays(today, 3), asesorAsignado: "a3", descripcion: "Seguimiento 3 meses - no contestó antes", canalSugerido: "whatsapp", intentos: 1 },
  { id: "t8", pacienteId: "p8", pacienteNombre: "Sandra Milena Ortiz", tipo: "control-6m", prioridad: "media", estado: "pendiente", fechaCreacion: subDays(today, 1), fechaLimite: addDays(today, 7), asesorAsignado: "a1", descripcion: "Agendar control semestral", canalSugerido: "whatsapp", intentos: 0 },
  { id: "t9", pacienteId: "p9", pacienteNombre: "Diego Alejandro Peña", tipo: "renovacion", prioridad: "alta", estado: "pendiente", fechaCreacion: subDays(today, 3), fechaLimite: addDays(today, 10), asesorAsignado: "a2", descripcion: "Fórmula vence en 60 días - iniciar proceso de renovación", canalSugerido: "llamada", intentos: 0 },
  { id: "t10", pacienteId: "p10", pacienteNombre: "Lucía Fernanda Castro", tipo: "renovacion", prioridad: "media", estado: "vencida", fechaCreacion: subMonths(today, 2), fechaLimite: subMonths(today, 1), asesorAsignado: "a3", descripcion: "Paciente inactiva - intentar reactivación", canalSugerido: "llamada", intentos: 0 },
];

// --- Mock Alerts (sin cambios) ---
export const alerts: Alert[] = [
  { id: "al1", pacienteId: "p4", pacienteNombre: "Claudia Ramírez", tipo: "formula-vencida", mensaje: "Fórmula vence en 30 días. Agendar renovación urgente.", fecha: today, leida: false, prioridad: "urgente" },
  { id: "al2", pacienteId: "p5", pacienteNombre: "Fernando Díaz", tipo: "formula-vencida", mensaje: "Fórmula venció hace 2 meses. Cliente en riesgo de pérdida.", fecha: subDays(today, 1), leida: false, prioridad: "urgente" },
  { id: "al3", pacienteId: "p3", pacienteNombre: "Roberto Castaño", tipo: "control-pendiente", mensaje: "Control semestral pendiente. Último contacto hace 2 meses.", fecha: today, leida: false, prioridad: "alta" },
  { id: "al4", pacienteId: "p9", pacienteNombre: "Diego Alejandro Peña", tipo: "recompra", mensaje: "Fórmula vence en 60 días. Oportunidad de renovación.", fecha: subDays(today, 2), leida: true, prioridad: "alta" },
  { id: "al5", pacienteId: "p10", pacienteNombre: "Lucía Fernanda Castro", tipo: "sin-contacto", mensaje: "Sin contacto hace 18 meses. Riesgo alto de pérdida.", fecha: subDays(today, 3), leida: true, prioridad: "alta" },
  { id: "al6", pacienteId: "p7", pacienteNombre: "Miguel Ángel Torres", tipo: "sin-contacto", mensaje: "No contestó seguimiento de 3 meses. Reintentar.", fecha: subDays(today, 1), leida: false, prioridad: "media" },
  { id: "al7", pacienteId: "p2", pacienteNombre: "Ana María López", tipo: "control-pendiente", mensaje: "Control de 3 meses programado. Primera compra.", fecha: today, leida: false, prioridad: "media" },
  { id: "al8", pacienteId: "p8", pacienteNombre: "Sandra Milena Ortiz", tipo: "control-pendiente", mensaje: "Próximo control semestral. Buena clienta recurrente.", fecha: subDays(today, 1), leida: false, prioridad: "media" },
];

// --- Mock Issues (sin cambios) ---
export const issues: Issue[] = [
  { id: "i1", titulo: "Sistema Sofix no sincroniza datos", descripcion: "Los datos de pacientes nuevos no están llegando desde Sofix. Llevo 2 días sin ver actualizaciones.", categoria: "sistema", prioridad: "urgente", estado: "pendiente", reportadoPor: "a1", reportadoPorNombre: "Carlos Méndez", fechaReporte: subDays(today, 1) },
  { id: "i2", titulo: "Teléfono de paciente incorrecto", descripcion: "Patricia Vargas (p6) tiene número telefónico desactualizado en el sistema. No se puede contactar.", categoria: "paciente", prioridad: "alta", estado: "en-revision", reportadoPor: "a4", reportadoPorNombre: "María Torres", fechaReporte: subDays(today, 2), notas: "Intenté contactar 3 veces sin éxito" },
  { id: "i3", titulo: "Flujo de renovación no claro", descripcion: "No está claro cuándo iniciar el proceso de renovación. ¿30 días antes? ¿60 días antes?", categoria: "proceso", prioridad: "media", estado: "resuelta", reportadoPor: "a3", reportadoPorNombre: "Andrés Ruiz", fechaReporte: subDays(today, 5), fechaResolucion: subDays(today, 2), resolucion: "Se definió protocolo: iniciar 60 días antes del vencimiento" },
  { id: "i4", titulo: "Error al guardar notas de contacto", descripcion: "A veces las notas no se guardan cuando marco como completada una tarea. Pierdo el registro.", categoria: "tecnico", prioridad: "alta", estado: "pendiente", reportadoPor: "a2", reportadoPorNombre: "Laura Gómez", fechaReporte: today },
];

// --- Helper functions (sin cambios, pero actualizo getStatusLabel y demás) ---
export function getStatusLabel(status: PatientStatus): string {
  const map: Record<PatientStatus, string> = {
    "post-venta": "Post-Venta",
    "seguimiento-3m": "Seguimiento 3M",
    "control-6m": "Control 6M",
    "renovacion-1a": "Renovación 1A",
    "inactivo": "Inactivo",
  };
  return map[status];
}

export function getTaskTypeLabel(t: Task["tipo"]): string {
  const map: Record<Task["tipo"], string> = {
    "post-venta": "Post-Venta",
    "control-3m": "Control 3M",
    "control-6m": "Control 6M",
    "renovacion": "Renovación",
    "entrega": "Entrega",
    "reclamo": "Reclamo",
  };
  return map[t];
}

export function getIssueCategoryLabel(c: IssueCategory): string {
  const map: Record<IssueCategory, string> = {
    "tecnico": "Técnico",
    "paciente": "Paciente",
    "proceso": "Proceso",
    "sistema": "Sistema",
    "otro": "Otro",
  };
  return map[c];
}

export function getIssueStatusLabel(s: IssueStatus): string {
  const map: Record<IssueStatus, string> = {
    "pendiente": "Pendiente",
    "en-revision": "En Revisión",
    "resuelta": "Resuelta",
    "descartada": "Descartada",
  };
  return map[s];
}