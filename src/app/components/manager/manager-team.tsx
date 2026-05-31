import { useState, useEffect } from "react";
import {
  makeStyles,
  shorthands,
  tokens,
  Card,
  Button,
  Badge,
  Avatar,
  Dialog,
  DialogSurface,
  DialogBody,
  DialogTitle,
  DialogContent,
  DialogActions,
  Textarea,
  Label,
} from "@fluentui/react-components";
import {
  CheckmarkCircleRegular,
  ClockRegular,
  WarningRegular,
  EditRegular,
  ChevronRightRegular,
  ProhibitedRegular,
} from "@fluentui/react-icons";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  advisors,
  tasks,
  getTaskTypeLabel,
  type Task,
  type TaskPriority,
} from "../../data/mock-data";
import { getPersistedTasks, persistTask } from "../../hooks/useLocalStorage";

const priorityBadge = (p: TaskPriority): "danger" | "warning" | "important" | "informative" => {
  const m = { urgente: "danger", alta: "warning", media: "important", baja: "informative" } as const;
  return m[p];
};

const useStyles = makeStyles({
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "12px",
  },
  statBox: {
    backgroundColor: tokens.colorNeutralBackground2,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: "12px",
    padding: "16px",
    textAlign: "center",
  },
  statValue: {
    fontSize: "22px",
    fontWeight: 700,
  },
  statLabel: {
    fontSize: "12px",
    color: tokens.colorNeutralForeground2,
    fontWeight: 500,
  },
  advisorGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
    gap: "16px",
  },
  advisorCard: {
    width: "100%",
    backgroundColor: tokens.colorNeutralBackground2,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: "12px",
    padding: "20px",
    cursor: "pointer",
    textAlign: "left",
    transition: "all 0.2s ease",
    ":hover": {
      borderColor: tokens.colorBrandStroke2,
      boxShadow: `0 4px 16px ${tokens.colorBrandShadowAmbient}`,
    },
  },
  advisorHeader: {
    display: "flex",
    alignItems: "flex-start",
    gap: "16px",
  },
  advisorInfo: {
    flex: 1,
    minWidth: 0,
  },
  advisorNameRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "8px",
  },
  advisorName: {
    fontSize: "14px",
    color: tokens.colorNeutralForeground1,
    fontWeight: 600,
  },
  advisorStatus: {
    fontSize: "11px",
    color: tokens.colorNeutralForeground3,
  },
  miniStats: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "8px",
    marginTop: "12px",
  },
  miniStatBox: {
    padding: "8px",
    borderRadius: "8px",
    textAlign: "center",
  },
  miniStatValue: {
    fontSize: "16px",
    fontWeight: 600,
  },
  miniStatLabel: {
    fontSize: "9px",
    color: tokens.colorNeutralForeground3,
    fontWeight: 500,
  },
  detailView: {
    maxWidth: "1000px",
    margin: "0 auto",
  },
  backButton: {
    marginBottom: "16px",
  },
  advisorDetailCard: {
    marginBottom: "16px",
  },
  advisorDetailHeader: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  advisorStatsRow: {
    display: "flex",
    gap: "16px",
  },
  statItem: {
    textAlign: "center",
  },
  statNumber: {
    fontSize: "20px",
    fontWeight: 700,
  },
  taskSection: {
    marginTop: "16px",
  },
  sectionTitle: {
    fontSize: "14px",
    fontWeight: 600,
    marginBottom: "8px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  taskList: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  taskItem: {
    backgroundColor: tokens.colorNeutralBackground2,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: "12px",
    padding: "16px",
  },
  overdueTask: {
    borderColor: tokens.colorStatusDangerBorder1,
  },
  taskContent: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
  },
  taskDetails: {
    flex: 1,
  },
  taskHeader: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexWrap: "wrap",
    marginBottom: "6px",
  },
  taskPatient: {
    fontSize: "13px",
    fontWeight: 600,
    color: tokens.colorNeutralForeground1,
  },
  taskDescription: {
    fontSize: "12px",
    color: tokens.colorNeutralForeground2,
    marginBottom: "8px",
  },
  taskMeta: {
    fontSize: "11px",
    color: tokens.colorNeutralForeground3,
  },
  noteBox: {
    marginTop: "8px",
    padding: "8px",
    borderRadius: "6px",
  },
  asesoraNote: {
    backgroundColor: tokens.colorBrandBackground2,
  },
  priorityNote: {
    backgroundColor: tokens.colorStatusWarningBackground1,
  },
  noteTitle: {
    fontSize: "10px",
    fontWeight: 600,
  },
  noteText: {
    fontSize: "11px",
    marginTop: "4px",
  },
});

export function ManagerTeam() {
  const styles = useStyles();
  const [selectedAdvisor, setSelectedAdvisor] = useState<string | null>(null);
  const [advisorTasks, setAdvisorTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [newPriority, setNewPriority] = useState<TaskPriority>("media");
  const [priorityNote, setPriorityNote] = useState("");

  useEffect(() => {
    if (selectedAdvisor) {
      const persistedTasks = getPersistedTasks();
      const advTasks = tasks
        .filter((t) => t.asesorAsignado === selectedAdvisor)
        .map((task) => {
          const persisted = persistedTasks.find((pt) => pt.id === task.id);
          if (persisted) {
            return { ...task, estado: persisted.estado as Task["estado"], prioridad: persisted.prioridad || task.prioridad };
          }
          return task;
        });
      setAdvisorTasks(advTasks);
    }
  }, [selectedAdvisor]);

  const advisorStats = advisors.map((adv) => {
    const persistedTasks = getPersistedTasks();
    const advTasks = tasks
      .filter((t) => t.asesorAsignado === adv.id)
      .map((task) => {
        const persisted = persistedTasks.find((pt) => pt.id === task.id);
        return persisted ? { ...task, estado: persisted.estado as Task["estado"] } : task;
      });
    const completedTasks = advTasks.filter((t) => t.estado === "completada").length;
    const overdueTasks = advTasks.filter((t) => t.estado === "vencida").length;
    const pendingTasks = advTasks.filter((t) => t.estado === "pendiente" || t.estado === "en-progreso").length;
    return { ...adv, completedTasks, overdueTasks, pendingTasks };
  });

  const handleChangePriority = () => {
    if (!selectedTask || !priorityNote.trim()) return;
    persistTask({
      id: selectedTask.id,
      estado: selectedTask.estado,
      updatedAt: new Date().toISOString(),
      prioridad: newPriority,
      notaPrioridad: priorityNote,
    });
    setAdvisorTasks((prev) => prev.map((t) => (t.id === selectedTask.id ? { ...t, prioridad: newPriority } : t)));
    setSelectedTask(null);
    setPriorityNote("");
  };

  const getStatusIcon = (status: Task["estado"] | "cancelada") => {
    const common = { width: "18px", height: "18px" };
    switch (status) {
      case "pendiente":
        return <ClockRegular style={{ ...common, color: tokens.colorStatusWarningForeground1 }} />;
      case "en-progreso":
        return <ClockRegular style={{ ...common, color: tokens.colorBrandForeground2 }} />;
      case "completada":
        return <CheckmarkCircleRegular style={{ ...common, color: tokens.colorStatusSuccessForeground1 }} />;
      case "vencida":
        return <WarningRegular style={{ ...common, color: tokens.colorStatusDangerForeground1 }} />;
      case "cancelada":
        return <ProhibitedRegular style={{ ...common, color: tokens.colorNeutralForeground3 }} />;
    }
  };

  const getPersistedNotes = (taskId: string) => {
    const t = getPersistedTasks().find((x) => x.id === taskId);
    return { notasAsesora: t?.notasAsesora, notaPrioridad: t?.notaPrioridad };
  };

  const renderTaskItem = (task: Task, isOverdue = false) => {
    const notes = getPersistedNotes(task.id);
    return (
      <div key={task.id} className={`${styles.taskItem} ${isOverdue ? styles.overdueTask : ""}`}>
        <div className={styles.taskContent}>
          {getStatusIcon(task.estado)}
          <div className={styles.taskDetails}>
            <div className={styles.taskHeader}>
              <span className={styles.taskPatient}>{task.pacienteNombre}</span>
              <Badge appearance="tint" color={priorityBadge(task.prioridad)} size="small">
                {task.prioridad.toUpperCase()}
              </Badge>
              <Badge appearance="outline" size="small">{getTaskTypeLabel(task.tipo)}</Badge>
            </div>
            <div className={styles.taskDescription}>{task.descripcion}</div>
            <div className={styles.taskMeta}>
              {task.estado === "vencida" ? "Venció" : "Límite"}: {format(task.fechaLimite, "d 'de' MMM", { locale: es })}
            </div>
            {notes.notasAsesora && (
              <div className={`${styles.noteBox} ${styles.asesoraNote}`}>
                <div className={styles.noteTitle} style={{ color: tokens.colorBrandForeground2 }}>Nota de asesora:</div>
                <div className={styles.noteText} style={{ color: tokens.colorBrandForeground2 }}>{notes.notasAsesora}</div>
              </div>
            )}
            {notes.notaPrioridad && (
              <div className={`${styles.noteBox} ${styles.priorityNote}`}>
                <div className={styles.noteTitle} style={{ color: tokens.colorStatusWarningForeground1 }}>Cambio de prioridad:</div>
                <div className={styles.noteText} style={{ color: tokens.colorStatusWarningForeground1 }}>{notes.notaPrioridad}</div>
              </div>
            )}
          </div>
          <Button size="small" appearance="subtle" icon={<EditRegular />} onClick={() => { setSelectedTask(task); setNewPriority(task.prioridad); }} />
        </div>
      </div>
    );
  };

  if (selectedAdvisor) {
    const advisor = advisors.find((a) => a.id === selectedAdvisor);
    if (!advisor) return null;
    const completadas = advisorTasks.filter((t) => t.estado === "completada");
    const pendientes = advisorTasks.filter((t) => t.estado === "pendiente" || t.estado === "en-progreso");
    const vencidas = advisorTasks.filter((t) => t.estado === "vencida");

    return (
      <div className={styles.detailView}>
        <Button appearance="subtle" onClick={() => { setSelectedAdvisor(null); setAdvisorTasks([]); }} className={styles.backButton}>
          ← Volver al equipo
        </Button>

        <Card className={styles.advisorDetailCard}>
          <div className={styles.advisorDetailHeader}>
            <Avatar name={advisor.nombre} size={56} color="brand" />
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: "18px", color: tokens.colorNeutralForeground1, fontWeight: 600 }}>{advisor.nombre}</h2>
              <div style={{ fontSize: "12px", color: tokens.colorNeutralForeground3 }}>{advisor.activo ? "En línea" : "Desconectada"}</div>
            </div>
            <div className={styles.advisorStatsRow}>
              <div className={styles.statItem}>
                <div className={styles.statNumber} style={{ color: tokens.colorStatusSuccessForeground1 }}>{completadas.length}</div>
                <div style={{ fontSize: "11px", color: tokens.colorNeutralForeground3 }}>Completadas</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNumber} style={{ color: tokens.colorStatusWarningForeground1 }}>{pendientes.length}</div>
                <div style={{ fontSize: "11px", color: tokens.colorNeutralForeground3 }}>Pendientes</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNumber} style={{ color: tokens.colorStatusDangerForeground1 }}>{vencidas.length}</div>
                <div style={{ fontSize: "11px", color: tokens.colorNeutralForeground3 }}>Vencidas</div>
              </div>
            </div>
          </div>
        </Card>

        <div className={styles.taskSection}>
          {vencidas.length > 0 && (
            <>
              <h3 className={styles.sectionTitle} style={{ color: tokens.colorStatusDangerForeground1 }}>
                <WarningRegular /> Vencidas ({vencidas.length})
              </h3>
              <div className={styles.taskList}>
                {vencidas.map((t) => renderTaskItem(t, true))}
              </div>
            </>
          )}
          {pendientes.length > 0 && (
            <>
              <h3 className={styles.sectionTitle} style={{ color: tokens.colorStatusWarningForeground1 }}>
                <ClockRegular /> Pendientes ({pendientes.length})
              </h3>
              <div className={styles.taskList}>
                {pendientes.map((t) => renderTaskItem(t, false))}
              </div>
            </>
          )}
          {completadas.length > 0 && (
            <>
              <h3 className={styles.sectionTitle} style={{ color: tokens.colorStatusSuccessForeground1 }}>
                <CheckmarkCircleRegular /> Completadas ({completadas.length})
              </h3>
              <div className={styles.taskList} style={{ opacity: 0.7 }}>
                {completadas.map((t) => renderTaskItem(t, false))}
              </div>
            </>
          )}
        </div>

        <Dialog open={!!selectedTask} onOpenChange={(_, d) => !d.open && setSelectedTask(null)}>
          <DialogSurface>
            <DialogBody>
              <DialogTitle>Modificar Prioridad</DialogTitle>
              <DialogContent>
                {selectedTask && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <div style={{ padding: "12px", backgroundColor: tokens.colorNeutralBackground3, borderRadius: "8px" }}>
                      <div style={{ fontSize: "13px", fontWeight: 600, color: tokens.colorNeutralForeground1 }}>{selectedTask.pacienteNombre}</div>
                      <div style={{ fontSize: "12px", color: tokens.colorNeutralForeground2 }}>{selectedTask.descripcion}</div>
                    </div>
                    <div>
                      <Label size="small" weight="semibold">Nueva Prioridad</Label>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px", marginTop: "8px" }}>
                        {(["baja", "media", "alta", "urgente"] as TaskPriority[]).map((p) => (
                          <Button
                            key={p}
                            size="small"
                            appearance={newPriority === p ? "primary" : "secondary"}
                            onClick={() => setNewPriority(p)}
                          >
                            {p.toUpperCase()}
                          </Button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label size="small" weight="semibold">Razón del cambio *</Label>
                      <Textarea
                        value={priorityNote}
                        onChange={(e) => setPriorityNote(e.target.value)}
                        placeholder="Explica por qué cambias la prioridad..."
                        rows={3}
                        style={{ width: "100%", marginTop: "4px" }}
                      />
                    </div>
                  </div>
                )}
              </DialogContent>
              <DialogActions>
                <Button appearance="secondary" onClick={() => setSelectedTask(null)}>Cancelar</Button>
                <Button appearance="primary" onClick={handleChangePriority} disabled={!priorityNote.trim()}>Guardar</Button>
              </DialogActions>
            </DialogBody>
          </DialogSurface>
        </Dialog>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.statsGrid}>
        <Card className={styles.statBox}>
          <div className={styles.statValue} style={{ color: tokens.colorBrandForeground2 }}>{advisors.filter((a) => a.activo).length}</div>
          <div className={styles.statLabel}>Activos Hoy</div>
        </Card>
        <Card className={styles.statBox}>
          <div className={styles.statValue} style={{ color: tokens.colorStatusSuccessForeground1 }}>{advisorStats.reduce((a, b) => a + b.completedTasks, 0)}</div>
          <div className={styles.statLabel}>Completadas</div>
        </Card>
        <Card className={styles.statBox}>
          <div className={styles.statValue} style={{ color: tokens.colorStatusWarningForeground1 }}>{advisorStats.reduce((a, b) => a + b.pendingTasks, 0)}</div>
          <div className={styles.statLabel}>Pendientes</div>
        </Card>
        <Card className={styles.statBox}>
          <div className={styles.statValue} style={{ color: tokens.colorStatusDangerForeground1 }}>{advisorStats.reduce((a, b) => a + b.overdueTasks, 0)}</div>
          <div className={styles.statLabel}>Vencidas</div>
        </Card>
      </div>

      <div className={styles.advisorGrid}>
        {advisorStats.map((adv) => (
          <button key={adv.id} onClick={() => setSelectedAdvisor(adv.id)} className={styles.advisorCard}>
            <div className={styles.advisorHeader}>
              <Avatar name={adv.nombre} size={48} color={adv.activo ? "brand" : "neutral"} />
              <div className={styles.advisorInfo}>
                <div className={styles.advisorNameRow}>
                  <div>
                    <div className={styles.advisorName}>{adv.nombre}</div>
                    <div className={styles.advisorStatus}>{adv.activo ? "En línea" : "Desconectada"}</div>
                  </div>
                  <ChevronRightRegular style={{ color: tokens.colorNeutralForeground3 }} />
                </div>
                <div className={styles.miniStats}>
                  <div className={styles.miniStatBox} style={{ backgroundColor: tokens.colorStatusSuccessBackground1 }}>
                    <div className={styles.miniStatValue} style={{ color: tokens.colorStatusSuccessForeground1 }}>{adv.completedTasks}</div>
                    <div className={styles.miniStatLabel}>Completadas</div>
                  </div>
                  <div className={styles.miniStatBox} style={{ backgroundColor: tokens.colorStatusWarningBackground1 }}>
                    <div className={styles.miniStatValue} style={{ color: tokens.colorStatusWarningForeground1 }}>{adv.pendingTasks}</div>
                    <div className={styles.miniStatLabel}>Pendientes</div>
                  </div>
                  <div className={styles.miniStatBox} style={{ backgroundColor: tokens.colorStatusDangerBackground1 }}>
                    <div className={styles.miniStatValue} style={{ color: tokens.colorStatusDangerForeground1 }}>{adv.overdueTasks}</div>
                    <div className={styles.miniStatLabel}>Vencidas</div>
                  </div>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}