import { useState, useMemo } from "react";
import {
  makeStyles,
  shorthands,
  tokens,
  Card,
  Button,
  Badge,
  Tooltip,
} from "@fluentui/react-components";
import {
  CalendarRegular,
  ChevronLeftRegular,
  ChevronRightRegular,
  ClockRegular,
  CallRegular,
  ChatRegular,
} from "@fluentui/react-icons";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, addMonths, subMonths, isSameMonth, startOfWeek, endOfWeek } from "date-fns";
import { es } from "date-fns/locale";
import { tasks, getTaskTypeLabel, type Task } from "../../data/mock-data";
import { getPersistedTasks } from "../../hooks/useLocalStorage";

const getLoggedUser = () => {
  try { return JSON.parse(localStorage.getItem("veravision_user") || "{}"); }
  catch { return { id: "a1", nombre: "Carlos Méndez" }; }
};

const priorityColor = (p: Task["prioridad"]): "danger" | "warning" | "important" | "informative" => {
  const m = { urgente: "danger", alta: "warning", media: "important", baja: "informative" } as const;
  return m[p];
};

const priorityTokenColor = (p: Task["prioridad"]): string => {
  const m = {
    urgente: tokens.colorStatusDangerForeground1,
    alta: tokens.colorPaletteDarkOrangeForeground1,
    media: tokens.colorStatusWarningForeground1,
    baja: tokens.colorBrandForeground2,
  };
  return m[p];
};

const priorityBgToken = (p: Task["prioridad"]): string => {
  const m = {
    urgente: tokens.colorStatusDangerBackground1,
    alta: tokens.colorPaletteDarkOrangeBackground1,
    media: tokens.colorStatusWarningBackground1,
    baja: tokens.colorBrandBackground2,
  };
  return m[p];
};

const useStyles = makeStyles({
  container: {
    maxWidth: "1200px",
    ...shorthands.margin("0", "auto"),
  },
  gridLayout: {
    display: "grid",
    gridTemplateColumns: "1fr 350px",
    gap: "16px",
  },
  panel: {
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.border("1px", "solid", tokens.colorNeutralStroke2),
    ...shorthands.borderRadius(tokens.borderRadiusLarge),
    ...shorthands.padding("20px"),
  },
  calendarHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "20px",
  },
  monthTitle: {
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
  },
  navButtons: {
    display: "flex",
    gap: "8px",
  },
  weekDays: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: "4px",
    marginBottom: "4px",
  },
  weekdayCell: {
    textAlign: "center",
    padding: "8px 0",
    fontSize: tokens.fontSizeBase100,
    color: tokens.colorNeutralForeground3,
    fontWeight: tokens.fontWeightSemibold,
  },
  daysGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: "4px",
  },
  dayButton: {
    minHeight: "92px",
    ...shorthands.padding("8px"),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ...shorthands.border("1px", "solid", tokens.colorNeutralStroke2),
    backgroundColor: tokens.colorNeutralBackground2,
    cursor: "pointer",
    textAlign: "left",
    transition: "all 0.15s ease",
    width: "100%",
    ":hover": {
      borderColor: tokens.colorBrandStroke2,
      backgroundColor: tokens.colorNeutralBackground3,
    },
  },
  daySelected: {
    borderColor: tokens.colorBrandStroke2,
    backgroundColor: tokens.colorBrandBackground2,
  },
  dayNumberContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "4px",
  },
  dayNumber: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "24px",
    height: "24px",
    borderRadius: tokens.borderRadiusCircular,
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightMedium,
  },
  todayNumber: {
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundInverted,
  },
  otherMonthNumber: {
    color: tokens.colorNeutralForeground3,
  },
  taskList: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
    marginTop: "4px",
  },
  taskPill: {
    fontSize: "9px",
    padding: "2px 6px",
    borderRadius: tokens.borderRadiusSmall,
    fontWeight: tokens.fontWeightSemibold,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  moreTasks: {
    fontSize: "9px",
    color: tokens.colorNeutralForeground3,
    padding: "0 4px",
    fontWeight: tokens.fontWeightMedium,
  },
  rightPanelHeader: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "16px",
  },
  rightPanelTitle: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
  },
  taskDetailCard: {
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
    padding: "12px",
  },
  taskDetailBadges: {
    display: "flex",
    gap: "6px",
    flexWrap: "wrap",
    marginBottom: "8px",
  },
  taskDetailName: {
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    marginBottom: "4px",
  },
  taskDetailDesc: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
    marginBottom: "8px",
  },
  taskDetailFooter: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: tokens.fontSizeBase100,
    color: tokens.colorNeutralForeground3,
  },
  emptyState: {
    textAlign: "center",
    padding: "32px 0",
  },
  emptyIcon: {
    width: "32px",
    height: "32px",
    color: tokens.colorNeutralForeground3,
    margin: "0 auto 8px",
  },
  emptyText: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
  },
});

export function AdvisorCalendar() {
  const styles = useStyles();
  const [user] = useState(getLoggedUser());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const persistedTasks = getPersistedTasks();
  const myTasks = useMemo(() => {
    return tasks
      .filter((t) => t.asesorAsignado === user.id)
      .map((task) => {
        const persisted = persistedTasks.find((pt) => pt.id === task.id);
        return persisted ? { ...task, estado: persisted.estado as Task["estado"] } : task;
      })
      .filter((t) => t.estado !== "completada" && t.estado !== ("cancelada" as any));
  }, [persistedTasks, user.id]);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getTasksForDay = (day: Date) => myTasks.filter((t) => isSameDay(t.fechaLimite, day));
  const selectedDayTasks = selectedDate ? getTasksForDay(selectedDate) : [];

  return (
    <div className={styles.container}>
      <div className={styles.gridLayout}>
        <Card className={styles.panel}>
          <div className={styles.calendarHeader}>
            <h2 className={styles.monthTitle}>
              {format(currentMonth, "MMMM yyyy", { locale: es })}
            </h2>
            <div className={styles.navButtons}>
              <Tooltip content="Mes anterior" relationship="label">
                <Button
                  size="small"
                  appearance="subtle"
                  icon={<ChevronLeftRegular />}
                  onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                />
              </Tooltip>
              <Tooltip content="Volver al mes actual" relationship="label">
                <Button size="small" appearance="secondary" onClick={() => setCurrentMonth(new Date())}>
                  Hoy
                </Button>
              </Tooltip>
              <Tooltip content="Mes siguiente" relationship="label">
                <Button
                  size="small"
                  appearance="subtle"
                  icon={<ChevronRightRegular />}
                  onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                />
              </Tooltip>
            </div>
          </div>

          <div className={styles.weekDays}>
            {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((d) => (
              <div key={d} className={styles.weekdayCell}>{d}</div>
            ))}
          </div>

          <div className={styles.daysGrid}>
            {calendarDays.map((day) => {
              const dayTasks = getTasksForDay(day);
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              const isTodayDay = isToday(day);

              return (
                <Button
                  key={day.toISOString()}
                  onClick={() => setSelectedDate(day)}
                  className={`${styles.dayButton} ${isSelected ? styles.daySelected : ""}`}
                  style={{ opacity: isCurrentMonth ? 1 : 0.4 }}
                  appearance="subtle"
                >
                  <div className={styles.dayNumberContainer}>
                    <div
                      className={`${styles.dayNumber} ${
                        isTodayDay ? styles.todayNumber : ""
                      } ${
                        !isCurrentMonth && !isTodayDay ? styles.otherMonthNumber : ""
                      }`}
                    >
                      {format(day, "d")}
                    </div>
                    {dayTasks.length > 0 && (
                      <Badge appearance="filled" color="brand" size="small">
                        {dayTasks.length}
                      </Badge>
                    )}
                  </div>
                  <div className={styles.taskList}>
                    {dayTasks.slice(0, 2).map((task) => (
                      <div
                        key={task.id}
                        title={task.pacienteNombre}
                        className={styles.taskPill}
                        style={{
                          color: priorityTokenColor(task.prioridad),
                          backgroundColor: priorityBgToken(task.prioridad),
                        }}
                      >
                        {task.pacienteNombre}
                      </div>
                    ))}
                    {dayTasks.length > 2 && (
                      <div className={styles.moreTasks}>+{dayTasks.length - 2} más</div>
                    )}
                  </div>
                </Button>
              );
            })}
          </div>
        </Card>

        <Card className={styles.panel}>
          <div className={styles.rightPanelHeader}>
            <CalendarRegular style={{ width: "20px", height: "20px", color: tokens.colorBrandForeground2 }} />
            <h3 className={styles.rightPanelTitle}>
              {selectedDate
                ? format(selectedDate, "d 'de' MMMM", { locale: es })
                : "Selecciona una fecha"}
            </h3>
          </div>

          {selectedDate ? (
            selectedDayTasks.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {selectedDayTasks.map((task) => (
                  <div key={task.id} className={styles.taskDetailCard}>
                    <div className={styles.taskDetailBadges}>
                      <Badge appearance="tint" color={priorityColor(task.prioridad)} size="small">
                        {task.prioridad.toUpperCase()}
                      </Badge>
                      <Badge appearance="outline" size="small">{getTaskTypeLabel(task.tipo)}</Badge>
                    </div>
                    <div className={styles.taskDetailName}>{task.pacienteNombre}</div>
                    <div className={styles.taskDetailDesc}>{task.descripcion}</div>
                    <div className={styles.taskDetailFooter}>
                      {task.canalSugerido === "llamada" ? (
                        <CallRegular style={{ width: "12px", height: "12px" }} />
                      ) : (
                        <ChatRegular style={{ width: "12px", height: "12px" }} />
                      )}
                      <span>{task.canalSugerido === "llamada" ? "Llamada" : "WhatsApp"}</span>
                      <ClockRegular style={{ width: "12px", height: "12px", marginLeft: "8px" }} />
                      <span
                        style={{
                          color: task.estado === "vencida"
                            ? tokens.colorStatusDangerForeground1
                            : tokens.colorNeutralForeground3,
                        }}
                      >
                        {task.estado === "vencida"
                          ? "Vencida"
                          : task.estado === "en-progreso"
                          ? "En progreso"
                          : "Pendiente"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <ClockRegular className={styles.emptyIcon} />
                <div className={styles.emptyText}>No hay tareas para este día</div>
              </div>
            )
          ) : (
            <div className={styles.emptyState}>
              <CalendarRegular className={styles.emptyIcon} />
              <div className={styles.emptyText}>Selecciona un día en el calendario</div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}