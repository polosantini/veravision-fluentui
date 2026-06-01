import { useState, useEffect } from "react";
import {
  makeStyles,
  shorthands,
  tokens,
  Card,
  Button,
  Badge,
  Input,
  Divider,
  Tooltip,
} from "@fluentui/react-components";
import {
  CallRegular,
  ChatRegular,
  CheckmarkCircleRegular,
  ClockRegular,
  WarningRegular,
  PlayRegular,
  ArrowSyncRegular,
  FlashRegular,
  SendRegular,
  DismissRegular,
  ProhibitedRegular,
} from "@fluentui/react-icons";
import { differenceInDays } from "date-fns";
import {
  tasks,
  getTaskTypeLabel,
  type Task,
  type TaskStatus,
} from "../../data/mock-data";
import { persistTask, getPersistedTasks } from "../../hooks/useLocalStorage";

const getLoggedUser = () => {
  try {
    return JSON.parse(localStorage.getItem("veravision_user") || "{}");
  } catch {
    return { id: "a1", nombre: "Carlos Méndez" };
  }
};

const useStyles = makeStyles({
  container: {
    maxWidth: "850px",
    ...shorthands.margin("0", "auto"),
    display: "flex",
    flexDirection: "column",
    ...shorthands.gap("20px"),
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "12px",
  },
  statCard: {
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.border("1px", "solid", tokens.colorNeutralStroke2),
    ...shorthands.borderRadius(tokens.borderRadiusLarge),
    ...shorthands.padding("12px"),
    textAlign: "center",
  },
  statValue: {
    fontSize: "22px",
    fontWeight: 700,
  },
  statLabel: {
    fontSize: "11px",
    color: tokens.colorNeutralForeground2,
    fontWeight: 500,
  },
  taskCard: {
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.border("1px", "solid", tokens.colorNeutralStroke2),
    ...shorthands.borderRadius(tokens.borderRadiusLarge),
    ...shorthands.overflow("hidden"),
    transition: "all 0.2s ease",
  },
  overdueCard: {
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.border("1px", "solid", tokens.colorStatusDangerBorder1),
    ...shorthands.borderRadius(tokens.borderRadiusLarge),
    ...shorthands.overflow("hidden"),
  },
  taskPadding: {
    padding: "16px",
  },
  taskHeader: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
  },
  taskIcon: {
    marginTop: "2px",
    flexShrink: 0,
  },
  taskContent: {
    flex: 1,
    minWidth: 0,
  },
  taskTitleRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexWrap: "wrap",
    marginBottom: "6px",
  },
  patientName: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
  },
  taskDescription: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
    marginTop: "6px",
  },
  taskMeta: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginTop: "8px",
    flexWrap: "wrap",
    fontSize: tokens.fontSizeBase100,
    color: tokens.colorNeutralForeground3,
  },
  deadlineLabel: {
    fontWeight: 500,
  },
  intentIcon: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },
  actionButtons: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginTop: "12px",
  },
  logArea: {
    backgroundColor: tokens.colorNeutralBackground3,
    ...shorthands.padding("12px", "16px", "16px"),
    ...shorthands.borderTop("1px", "solid", tokens.colorNeutralStroke2),
  },
  logHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "10px",
  },
  logTitle: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  logTitleText: {
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
  },
  resultLabel: {
    fontSize: tokens.fontSizeBase100,
    color: tokens.colorNeutralForeground2,
    marginBottom: "8px",
    fontWeight: 500,
  },
  resultButtons: {
    display: "flex",
    flexWrap: "wrap",
    gap: "6px",
    marginBottom: "12px",
  },
  logInputRow: {
    display: "flex",
    gap: "8px",
  },
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "8px",
  },
  sectionTitle: {
    fontSize: tokens.fontSizeBase200,
    fontWeight: 600,
  },
  taskList: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  completedSection: {
    opacity: 0.65,
  },
});

export function AdvisorQueue() {
  const styles = useStyles();
  const [user] = useState(getLoggedUser());
  const [localTasks, setLocalTasks] = useState<Task[]>([]);
  const [activeLogId, setActiveLogId] = useState<string | null>(null);
  const [logResult, setLogResult] = useState("exitoso");
  const [logNotes, setLogNotes] = useState("");
  const [logChannel, setLogChannel] = useState<"llamada" | "whatsapp">("llamada");

  useEffect(() => {
    const persistedTasks = getPersistedTasks();
    const myTasks = tasks
      .filter((t) => t.asesorAsignado === user.id)
      .map((task) => {
        const persisted = persistedTasks.find((pt) => pt.id === task.id);
        return persisted ? { ...task, estado: persisted.estado as TaskStatus } : task;
      });
    setLocalTasks(myTasks);
  }, [user.id]);

  const pending = localTasks.filter((t) => t.estado === "pendiente" || t.estado === "vencida");
  const inProgress = localTasks.filter((t) => t.estado === "en-progreso");
  const completed = localTasks.filter((t) => t.estado === "completada");

  const sortTasks = (arr: Task[]) =>
    [...arr].sort((a, b) => {
      const prioOrder = { urgente: 0, alta: 1, media: 2, baja: 3 };
      if (prioOrder[a.prioridad] !== prioOrder[b.prioridad])
        return prioOrder[a.prioridad] - prioOrder[b.prioridad];
      return a.fechaLimite.getTime() - b.fechaLimite.getTime();
    });

  const getDeadlineLabel = (date: Date) => {
    const days = differenceInDays(date, new Date());
    if (days < 0)
      return { label: `Venció hace ${Math.abs(days)}d`, color: tokens.colorStatusDangerForeground1 };
    if (days === 0)
      return { label: "HOY", color: tokens.colorStatusDangerForeground1 };
    if (days === 1)
      return { label: "Mañana", color: tokens.colorStatusWarningForeground1 };
    if (days <= 3)
      return { label: `${days} días`, color: tokens.colorStatusWarningForeground1 };
    return { label: `${days} días`, color: tokens.colorNeutralForeground3 };
  };

  const priorityBadge = (p: Task["prioridad"]) => {
    const map: Record<string, "danger" | "warning" | "important" | "informative"> = {
      urgente: "danger",
      alta: "warning",
      media: "important",
      baja: "informative",
    };
    return (
      <Badge appearance="tint" color={map[p]} size="small">
        {p.toUpperCase()}
      </Badge>
    );
  };

  const getStatusIcon = (status: TaskStatus | "cancelada") => {
    const common = { width: "18px", height: "18px" };
    switch (status) {
      case "pendiente":
        return <ClockRegular style={{ ...common, color: tokens.colorStatusWarningForeground1 }} />;
      case "en-progreso":
        return <PlayRegular style={{ ...common, color: tokens.colorBrandForeground2 }} />;
      case "completada":
        return <CheckmarkCircleRegular style={{ ...common, color: tokens.colorStatusSuccessForeground1 }} />;
      case "vencida":
        return <WarningRegular style={{ ...common, color: tokens.colorStatusDangerForeground1 }} />;
      case "cancelada":
        return <ProhibitedRegular style={{ ...common, color: tokens.colorNeutralForeground3 }} />;
    }
  };

  const startTask = (id: string) => {
    persistTask({ id, estado: "en-progreso", updatedAt: new Date().toISOString() });
    setLocalTasks((prev) => prev.map((t) => (t.id === id ? { ...t, estado: "en-progreso" } : t)));
  };

  const completeTask = (id: string) => {
    const task = localTasks.find((t) => t.id === id);
    persistTask({
      id,
      estado: "completada",
      updatedAt: new Date().toISOString(),
      notasAsesora: logNotes.trim() || undefined,
      prioridad: task?.prioridad,
      tipoTarea: task?.tipo,
      canalUsado: logChannel,
      resultadoContacto: logResult as any,
    });
    setLocalTasks((prev) => prev.map((t) => (t.id === id ? { ...t, estado: "completada" } : t)));
    setActiveLogId(null);
    setLogNotes("");
  };

  const cancelTask = (id: string) => {
    persistTask({ id, estado: "cancelada", updatedAt: new Date().toISOString() });
    setLocalTasks((prev) => prev.map((t) => (t.id === id ? { ...t, estado: "cancelada" as any } : t)));
  };

  const openLog = (id: string, channel: "llamada" | "whatsapp") => {
    setActiveLogId(id);
    setLogChannel(channel);
    setLogResult("exitoso");
    setLogNotes("");
  };

  const resultOptions = [
    { value: "exitoso", label: "Exitoso", color: tokens.colorStatusSuccessForeground1, bg: tokens.colorStatusSuccessBackground1 },
    { value: "no-contesta", label: "No contesta", color: tokens.colorStatusDangerForeground1, bg: tokens.colorStatusDangerBackground1 },
    { value: "reagendar", label: "Reagendar", color: tokens.colorStatusWarningForeground1, bg: tokens.colorStatusWarningBackground1 },
    { value: "no-interesado", label: "No interesado", color: tokens.colorNeutralForeground3, bg: tokens.colorNeutralBackground3 },
  ];

  const renderTaskCard = (task: Task) => {
    const deadline = getDeadlineLabel(task.fechaLimite);
    const isLogging = activeLogId === task.id;
    const isOverdue = task.estado === "vencida";

    return (
      <div key={task.id} className={isOverdue ? styles.overdueCard : styles.taskCard}>
        <div className={styles.taskPadding}>
          <div className={styles.taskHeader}>
            <div className={styles.taskIcon}>{getStatusIcon(task.estado)}</div>
            <div className={styles.taskContent}>
              <div className={styles.taskTitleRow}>
                <span className={styles.patientName}>{task.pacienteNombre}</span>
                {priorityBadge(task.prioridad)}
                <Badge appearance="outline" size="small">{getTaskTypeLabel(task.tipo)}</Badge>
              </div>
              <div className={styles.taskDescription}>{task.descripcion}</div>
              <div className={styles.taskMeta}>
                <span className={styles.deadlineLabel} style={{ color: deadline.color }}>
                  Límite: {deadline.label}
                </span>
                {task.intentos > 0 && (
                  <span className={styles.intentIcon}>
                    <ArrowSyncRegular style={{ width: "12px", height: "12px" }} />
                    {task.intentos} intento{task.intentos > 1 ? "s" : ""}
                  </span>
                )}
                <span className={styles.intentIcon}>
                  {task.canalSugerido === "llamada" ? (
                    <CallRegular style={{ width: "12px", height: "12px" }} />
                  ) : (
                    <ChatRegular style={{ width: "12px", height: "12px" }} />
                  )}
                  Canal sugerido: {task.canalSugerido === "llamada" ? "Llamada" : "WhatsApp"}
                </span>
              </div>
            </div>
          </div>

          {task.estado !== "completada" && task.estado !== ("cancelada" as any) && !isLogging && (
            <>
              <Divider style={{ margin: "12px 0" }} />
              <div className={styles.actionButtons}>
                {task.estado === "pendiente" && (
                  <Tooltip content="Iniciar esta tarea" relationship="label">
                    <Button size="small" appearance="primary" icon={<PlayRegular />} onClick={() => startTask(task.id)}>
                      Iniciar
                    </Button>
                  </Tooltip>
                )}
                <Tooltip content="Registrar llamada" relationship="label">
                  <Button size="small" appearance="secondary" icon={<CallRegular />} onClick={() => openLog(task.id, "llamada")}>
                    Registrar Llamada
                  </Button>
                </Tooltip>
                <Tooltip content="Enviar WhatsApp" relationship="label">
                  <Button size="small" appearance="secondary" icon={<ChatRegular />} onClick={() => openLog(task.id, "whatsapp")}>
                    WhatsApp
                  </Button>
                </Tooltip>
                <Tooltip content="Cancelar tarea" relationship="label">
                  <Button
                    size="small"
                    appearance="subtle"
                    icon={<ProhibitedRegular />}
                    onClick={() => cancelTask(task.id)}
                    style={{ marginLeft: "auto" }}
                  >
                    Cancelar
                  </Button>
                </Tooltip>
              </div>
            </>
          )}
        </div>

        {isLogging && (
          <div className={styles.logArea}>
            <div className={styles.logHeader}>
              <div className={styles.logTitle}>
                <FlashRegular style={{ width: "16px", height: "16px", color: tokens.colorStatusWarningForeground1 }} />
                <span className={styles.logTitleText}>
                  Registrar {logChannel === "llamada" ? "Llamada" : "WhatsApp"}
                </span>
              </div>
              <Tooltip content="Cancelar registro" relationship="label">
                <Button size="small" appearance="subtle" icon={<DismissRegular />} onClick={() => setActiveLogId(null)} />
              </Tooltip>
            </div>

            <div className={styles.resultLabel}>Resultado del contacto:</div>
            <div className={styles.resultButtons}>
              {resultOptions.map((r) => {
                const selected = logResult === r.value;
                return (
                  <Button
                    key={r.value}
                    size="small"
                    appearance={selected ? "primary" : "secondary"}
                    onClick={() => setLogResult(r.value)}
                    style={{
                      backgroundColor: selected ? r.color : undefined,
                      borderColor: selected ? r.color : undefined,
                    }}
                  >
                    {r.label}
                  </Button>
                );
              })}
            </div>

            <div className={styles.logInputRow}>
              <Input
                value={logNotes}
                onChange={(e) => setLogNotes(e.target.value)}
                placeholder="Nota rápida (opcional)..."
                style={{ flex: 1 }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") completeTask(task.id);
                }}
              />
              <Tooltip content="Guardar y completar tarea" relationship="label">
                <Button appearance="primary" icon={<SendRegular />} onClick={() => completeTask(task.id)}>
                  Guardar
                </Button>
              </Tooltip>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.statsGrid}>
        <Card className={styles.statCard}>
          <div className={styles.statValue} style={{ color: tokens.colorStatusWarningForeground1 }}>
            {pending.length}
          </div>
          <div className={styles.statLabel}>Pendientes</div>
        </Card>
        <Card className={styles.statCard}>
          <div className={styles.statValue} style={{ color: tokens.colorBrandForeground2 }}>
            {inProgress.length}
          </div>
          <div className={styles.statLabel}>En Progreso</div>
        </Card>
        <Card className={styles.statCard}>
          <div className={styles.statValue} style={{ color: tokens.colorStatusSuccessForeground1 }}>
            {completed.length}
          </div>
          <div className={styles.statLabel}>Completadas</div>
        </Card>
      </div>

      {/* Atención inmediata */}
      {sortTasks(pending).filter((t) => t.estado === "vencida" || t.prioridad === "urgente").length > 0 && (
        <div>
          <div className={styles.sectionHeader}>
            <WarningRegular style={{ width: "18px", height: "18px", color: tokens.colorStatusDangerForeground1 }} />
            <h3 className={styles.sectionTitle} style={{ color: tokens.colorStatusDangerForeground1 }}>
              Requiere Atención Inmediata
            </h3>
          </div>
          <div className={styles.taskList}>
            {sortTasks(pending)
              .filter((t) => t.estado === "vencida" || t.prioridad === "urgente")
              .map(renderTaskCard)}
          </div>
        </div>
      )}

      {/* Pendientes regulares */}
      {sortTasks(pending).filter((t) => t.estado !== "vencida" && t.prioridad !== "urgente").length > 0 && (
        <div>
          <div className={styles.sectionHeader}>
            <ClockRegular style={{ width: "18px", height: "18px", color: tokens.colorStatusWarningForeground1 }} />
            <h3 className={styles.sectionTitle} style={{ color: tokens.colorNeutralForeground1 }}>
              Pendientes
            </h3>
          </div>
          <div className={styles.taskList}>
            {sortTasks(pending)
              .filter((t) => t.estado !== "vencida" && t.prioridad !== "urgente")
              .map(renderTaskCard)}
          </div>
        </div>
      )}

      {/* En progreso */}
      {inProgress.length > 0 && (
        <div>
          <div className={styles.sectionHeader}>
            <PlayRegular style={{ width: "18px", height: "18px", color: tokens.colorBrandForeground2 }} />
            <h3 className={styles.sectionTitle} style={{ color: tokens.colorNeutralForeground1 }}>
              En Progreso
            </h3>
          </div>
          <div className={styles.taskList}>{inProgress.map(renderTaskCard)}</div>
        </div>
      )}

      {/* Completadas */}
      {completed.length > 0 && (
        <div>
          <div className={styles.sectionHeader}>
            <CheckmarkCircleRegular style={{ width: "18px", height: "18px", color: tokens.colorStatusSuccessForeground1 }} />
            <h3 className={styles.sectionTitle} style={{ color: tokens.colorNeutralForeground1 }}>
              Completadas Hoy
            </h3>
          </div>
          <div className={`${styles.taskList} ${styles.completedSection}`}>{completed.map(renderTaskCard)}</div>
        </div>
      )}
    </div>
  );
}