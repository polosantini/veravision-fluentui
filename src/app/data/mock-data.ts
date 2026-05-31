import { addDays, subDays, subMonths, format } from "date-fns";

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
  cedula: string;
  telefono: string;
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

// --- Mock Patients ---
export const patients: Patient[] = [
  {
    id: "p1", nombre: "Jorge Hernández", cedula: "1.023.456.789", telefono: "310-555-0101", email: "jorge.h@email.com",
    fechaUltimaCompra: subDays(today, 5), fechaUltimoControl: subDays(today, 5), fechaVencimientoFormula: addDays(today, 360),
    productoComprado: "Lentes progresivos Varilux", asesorAsignado: "a1", estado: "post-venta", valorUltimaCompra: 850000, totalCompras: 3,
    historialContactos: [
      { fecha: subDays(today, 3), tipo: "llamada", motivo: "Seguimiento post-venta", resultado: "exitoso", notas: "Paciente satisfecho con la adaptación", asesor: "Carlos Méndez" },
    ]
  },
  {
    id: "p2", nombre: "Ana María López", cedula: "52.789.123", telefono: "320-555-0202", email: "ana.lopez@email.com",
    fechaUltimaCompra: subMonths(today, 3), fechaUltimoControl: subMonths(today, 3), fechaVencimientoFormula: addDays(today, 270),
    productoComprado: "Lentes CR-39 monofocales", asesorAsignado: "a2", estado: "seguimiento-3m", valorUltimaCompra: 320000, totalCompras: 1,
    historialContactos: []
  },
  {
    id: "p3", nombre: "Roberto Castaño", cedula: "80.456.321", telefono: "300-555-0303", email: "r.castano@email.com",
    fechaUltimaCompra: subMonths(today, 6), fechaUltimoControl: subMonths(today, 6), fechaVencimientoFormula: addDays(today, 180),
    productoComprado: "Montura Ray-Ban + lentes transitions", asesorAsignado: "a1", estado: "control-6m", valorUltimaCompra: 1200000, totalCompras: 5,
    historialContactos: [
      { fecha: subMonths(today, 4), tipo: "whatsapp", motivo: "Recordatorio control 3 meses", resultado: "exitoso", notas: "Confirma que ve bien", asesor: "Carlos Méndez" },
    ]
  },
  {
    id: "p4", nombre: "Claudia Ramírez", cedula: "39.654.987", telefono: "315-555-0404", email: "claudia.r@email.com",
    fechaUltimaCompra: subMonths(today, 11), fechaUltimoControl: subMonths(today, 8), fechaVencimientoFormula: addDays(today, 30),
    productoComprado: "Lentes de contacto mensuales", asesorAsignado: "a3", estado: "renovacion-1a", valorUltimaCompra: 450000, totalCompras: 8,
    historialContactos: [
      { fecha: subMonths(today, 5), tipo: "llamada", motivo: "Control semestral", resultado: "reagendar", notas: "No pudo asistir, reagendar", asesor: "Andrés Ruiz" },
    ]
  },
  {
    id: "p5", nombre: "Fernando Díaz", cedula: "1.098.765.432", telefono: "318-555-0505", email: "f.diaz@email.com",
    fechaUltimaCompra: subMonths(today, 14), fechaUltimoControl: subMonths(today, 14), fechaVencimientoFormula: subMonths(today, 2),
    productoComprado: "Gafas de sol graduadas", asesorAsignado: "a2", estado: "inactivo", valorUltimaCompra: 680000, totalCompras: 2,
    historialContactos: [
      { fecha: subMonths(today, 12), tipo: "llamada", motivo: "Renovación anual", resultado: "no-contesta", notas: "Sin respuesta 3 intentos", asesor: "Laura Gómez" },
    ]
  },
  {
    id: "p6", nombre: "Patricia Vargas", cedula: "41.321.654", telefono: "311-555-0606", email: "p.vargas@email.com",
    fechaUltimaCompra: subDays(today, 2), fechaUltimoControl: subDays(today, 2), fechaVencimientoFormula: addDays(today, 363),
    productoComprado: "Lentes bifocales + montura Oakley", asesorAsignado: "a4", estado: "post-venta", valorUltimaCompra: 950000, totalCompras: 6,
    historialContactos: []
  },
  {
    id: "p7", nombre: "Miguel Ángel Torres", cedula: "79.852.147", telefono: "322-555-0707", email: "m.torres@email.com",
    fechaUltimaCompra: subMonths(today, 5), fechaUltimoControl: subMonths(today, 5), fechaVencimientoFormula: addDays(today, 210),
    productoComprado: "Lentes antirreflejo", asesorAsignado: "a3", estado: "seguimiento-3m", valorUltimaCompra: 280000, totalCompras: 1,
    historialContactos: [
      { fecha: subMonths(today, 3), tipo: "llamada", motivo: "Seguimiento 3 meses", resultado: "no-contesta", notas: "", asesor: "Andrés Ruiz" },
    ]
  },
  {
    id: "p8", nombre: "Sandra Milena Ortiz", cedula: "52.963.741", telefono: "314-555-0808", email: "s.ortiz@email.com",
    fechaUltimaCompra: subMonths(today, 7), fechaUltimoControl: subMonths(today, 4), fechaVencimientoFormula: addDays(today, 150),
    productoComprado: "Lentes progresivos digitales", asesorAsignado: "a1", estado: "control-6m", valorUltimaCompra: 1100000, totalCompras: 4,
    historialContactos: [
      { fecha: subMonths(today, 4), tipo: "presencial", motivo: "Ajuste de montura", resultado: "exitoso", notas: "Se ajustó y quedó bien", asesor: "Carlos Méndez" },
    ]
  },
  {
    id: "p9", nombre: "Diego Alejandro Peña", cedula: "1.045.678.912", telefono: "316-555-0909", email: "d.pena@email.com",
    fechaUltimaCompra: subMonths(today, 10), fechaUltimoControl: subMonths(today, 7), fechaVencimientoFormula: addDays(today, 60),
    productoComprado: "Gafas deportivas graduadas", asesorAsignado: "a2", estado: "renovacion-1a", valorUltimaCompra: 520000, totalCompras: 2,
    historialContactos: []
  },
  {
    id: "p10", nombre: "Lucía Fernanda Castro", cedula: "39.741.852", telefono: "319-555-1010", email: "l.castro@email.com",
    fechaUltimaCompra: subMonths(today, 18), fechaUltimoControl: subMonths(today, 18), fechaVencimientoFormula: subMonths(today, 6),
    productoComprado: "Lentes CR-39 + montura económica", asesorAsignado: "a3", estado: "inactivo", valorUltimaCompra: 180000, totalCompras: 1,
    historialContactos: []
  },
];

// --- Mock Tasks ---
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

// --- Mock Alerts ---
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

// --- Mock Issues ---
export const issues: Issue[] = [
  { id: "i1", titulo: "Sistema Sofix no sincroniza datos", descripcion: "Los datos de pacientes nuevos no están llegando desde Sofix. Llevo 2 días sin ver actualizaciones.", categoria: "sistema", prioridad: "urgente", estado: "pendiente", reportadoPor: "a1", reportadoPorNombre: "Carlos Méndez", fechaReporte: subDays(today, 1) },
  { id: "i2", titulo: "Teléfono de paciente incorrecto", descripcion: "Patricia Vargas (p6) tiene número telefónico desactualizado en el sistema. No se puede contactar.", categoria: "paciente", prioridad: "alta", estado: "en-revision", reportadoPor: "a4", reportadoPorNombre: "María Torres", fechaReporte: subDays(today, 2), notas: "Intenté contactar 3 veces sin éxito" },
  { id: "i3", titulo: "Flujo de renovación no claro", descripcion: "No está claro cuándo iniciar el proceso de renovación. ¿30 días antes? ¿60 días antes?", categoria: "proceso", prioridad: "media", estado: "resuelta", reportadoPor: "a3", reportadoPorNombre: "Andrés Ruiz", fechaReporte: subDays(today, 5), fechaResolucion: subDays(today, 2), resolucion: "Se definió protocolo: iniciar 60 días antes del vencimiento" },
  { id: "i4", titulo: "Error al guardar notas de contacto", descripcion: "A veces las notas no se guardan cuando marco como completada una tarea. Pierdo el registro.", categoria: "tecnico", prioridad: "alta", estado: "pendiente", reportadoPor: "a2", reportadoPorNombre: "Laura Gómez", fechaReporte: today },
];

// --- Chart Data ---
export const weeklyContactData = [
  { dia: "Lun", llamadas: 12, whatsapp: 8, exitosos: 14 },
  { dia: "Mar", llamadas: 15, whatsapp: 10, exitosos: 18 },
  { dia: "Mié", llamadas: 10, whatsapp: 12, exitosos: 15 },
  { dia: "Jue", llamadas: 14, whatsapp: 9, exitosos: 16 },
  { dia: "Vie", llamadas: 18, whatsapp: 11, exitosos: 21 },
  { dia: "Sáb", llamadas: 8, whatsapp: 6, exitosos: 10 },
];

export const patientLifecycleData = [
  { name: "Post-venta", value: 2, color: "#3b82f6" },
  { name: "Seguimiento 3M", value: 2, color: "#8b5cf6" },
  { name: "Control 6M", value: 2, color: "#f59e0b" },
  { name: "Renovación 1A", value: 2, color: "#ef4444" },
  { name: "Inactivos", value: 2, color: "#6b7280" },
];

export const monthlyRevenueRecovery = [
  { mes: "Oct", potencial: 2800000, recuperado: 1200000 },
  { mes: "Nov", potencial: 3100000, recuperado: 1800000 },
  { mes: "Dic", potencial: 3500000, recuperado: 2400000 },
  { mes: "Ene", potencial: 2900000, recuperado: 2100000 },
  { mes: "Feb", potencial: 3200000, recuperado: 2600000 },
  { mes: "Mar", potencial: 3400000, recuperado: 2900000 },
];

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

export function getStatusColor(status: PatientStatus): string {
  const map: Record<PatientStatus, string> = {
    "post-venta": "bg-accent/25 text-accent",
    "seguimiento-3m": "bg-violet-100 text-violet-800",
    "control-6m": "bg-[#F0B429]/25 text-[#F0B429]",
    "renovacion-1a": "bg-destructive/20 text-[#FF6B6B]",
    "inactivo": "bg-muted text-muted-foreground",
  };
  return map[status];
}

export function getPriorityColor(p: TaskPriority): string {
  const map: Record<TaskPriority, string> = {
    urgente: "bg-destructive/20 text-[#FF6B6B] border-destructive/40",
    alta: "bg-[#F58A3D]/25 text-[#F58A3D] border-[#F58A3D]/40",
    media: "bg-[#F0B429]/25 text-[#F0B429] border-[#F0B429]/40",
    baja: "bg-[#3B5E96]/25 text-[#7AA7FF] border-[#7AA7FF]/40",
  };
  return map[p];
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

export function getIssueCategoryColor(c: IssueCategory): string {
  const map: Record<IssueCategory, string> = {
    "tecnico": "bg-purple-100 text-purple-800 border-purple-200",
    "paciente": "bg-accent/25 text-accent border-blue-200",
    "proceso": "bg-[#F0B429]/25 text-[#F0B429] border-[#F0B429]/40",
    "sistema": "bg-destructive/20 text-[#FF6B6B] border-destructive/40",
    "otro": "bg-muted text-foreground border-border",
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

export function getIssueStatusColor(s: IssueStatus): string {
  const map: Record<IssueStatus, string> = {
    "pendiente": "bg-destructive/20 text-[#FF6B6B]",
    "en-revision": "bg-accent/25 text-accent",
    "resuelta": "bg-emerald-100 text-emerald-800",
    "descartada": "bg-muted text-muted-foreground",
  };
  return map[s];
}
