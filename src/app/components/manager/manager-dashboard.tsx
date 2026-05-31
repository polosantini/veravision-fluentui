import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import {
  makeStyles,
  shorthands,
  tokens,
  Card,
} from "@fluentui/react-components";
import {
  PeopleRegular,
  WarningRegular,
  ClockRegular,
  ShieldCheckmarkRegular,
  TargetRegular,
  PulseRegular,
} from "@fluentui/react-icons";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { getPersistedTasks, useLocalStorage } from "../../hooks/useLocalStorage";
import {
  tasks, alerts, advisors,
  patients as mockPatients,
  type Patient,
} from "../../data/mock-data";

const useStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    ...shorthands.gap("24px"),
    maxWidth: "1400px",
    ...shorthands.margin("0", "auto"),
  },
  hero: {
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.border("1px", "solid", tokens.colorNeutralStroke2),
    ...shorthands.borderRadius("4px"),
    ...shorthands.padding("20px", "24px"),
    boxShadow: tokens.shadow2,
  },
  heroContent: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "24px",
  },
  heroLeft: {
    flex: 1,
  },
  heroBadge: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "8px",
  },
  heroBadgeIcon: {
    width: "16px",
    height: "16px",
    color: tokens.colorBrandForeground1,
  },
  heroBadgeText: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
    fontWeight: tokens.fontWeightSemibold,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  heroTitle: {
    fontSize: tokens.fontSizeBase600,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    lineHeight: tokens.lineHeightBase600,
  },
  heroRight: {
    textAlign: "right",
  },
  heroRightLabel: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
    fontWeight: tokens.fontWeightRegular,
  },
  heroRightValue: {
    fontSize: tokens.fontSizeHero700,
    color: tokens.colorBrandForeground1,
    fontWeight: tokens.fontWeightSemibold,
    lineHeight: tokens.lineHeightHero700,
  },
  kpiGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "12px",
  },
  kpiCard: {
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.border("1px", "solid", tokens.colorNeutralStroke2),
    ...shorthands.borderRadius("4px"),
    ...shorthands.padding("16px"),
    cursor: "pointer",
    textAlign: "left",
    boxShadow: tokens.shadow2,
    transition: "box-shadow 0.1s ease",
    ":hover": {
      boxShadow: tokens.shadow8,
    },
  },
  kpiHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "12px",
  },
  kpiIconBox: {
    width: "32px",
    height: "32px",
    borderRadius: "4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  kpiWarningDot: {
    width: "8px",
    height: "8px",
    backgroundColor: tokens.colorStatusDangerBackground,
    borderRadius: "50%",
  },
  kpiValue: {
    fontSize: tokens.fontSizeBase600,
    color: tokens.colorNeutralForeground1,
    fontWeight: tokens.fontWeightSemibold,
    lineHeight: tokens.lineHeightBase600,
  },
  kpiLabel: {
    fontSize: tokens.fontSizeBase300,
    color: tokens.colorNeutralForeground1,
    marginTop: "4px",
    fontWeight: tokens.fontWeightSemibold,
  },
  kpiSub: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
    marginTop: "2px",
  },
  chartsGrid: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: "16px",
  },
  chartCard: {
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.border("1px", "solid", tokens.colorNeutralStroke2),
    ...shorthands.borderRadius("4px"),
    ...shorthands.padding("20px"),
    boxShadow: tokens.shadow2,
  },
  chartTitle: {
    fontSize: tokens.fontSizeBase400,
    color: tokens.colorNeutralForeground1,
    fontWeight: tokens.fontWeightSemibold,
    marginBottom: "16px",
  },
  pieChartLegend: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    marginTop: "8px",
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: tokens.fontSizeBase100,
  },
  legendColorBox: {
    width: "10px",
    height: "10px",
    borderRadius: "2px",
    flexShrink: 0,
  },
  legendLabel: {
    color: tokens.colorNeutralForeground2,
    flex: 1,
  },
  legendValue: {
    color: tokens.colorNeutralForeground1,
    fontWeight: tokens.fontWeightSemibold,
  },
});

// Colores para gráficos (recharts permite colores fijos; los dejamos pero ahora son tokens convertidos a string)
const barColors = {
  llamadas: "#2E3033",
  whatsapp: "#3B5E96",
  exitosos: "#005EF5",
};

export function ManagerDashboard() {
  const styles = useStyles();
  const navigate = useNavigate();
  const [persistedTasks, setPersistedTasks] = useState(getPersistedTasks());
  const [patients] = useLocalStorage<Patient[]>("veravision_patients", mockPatients);

  useEffect(() => {
    const interval = setInterval(() => setPersistedTasks(getPersistedTasks()), 1000);
    return () => clearInterval(interval);
  }, []);

  const allTasks = tasks.map((task) => {
    const persisted = persistedTasks.find((pt) => pt.id === task.id);
    return persisted ? { ...task, estado: persisted.estado as any } : task;
  });

  const completed = allTasks.filter((t) => t.estado === "completada").length;
  const overdue = allTasks.filter((t) => t.estado === "vencida").length;
  const pending = allTasks.filter((t) => t.estado === "pendiente" || t.estado === "en-progreso").length;
  const totalTasks = allTasks.length;
  const urgentAlerts = alerts.filter((a) => a.prioridad === "urgente" && !a.leida).length;

  const today = new Date();
  const patientsAtRisk = patients.filter((p) => {
    const days = Math.floor((p.fechaVencimientoFormula.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return days <= 90;
  }).length;

  const completionRate = totalTasks > 0 ? Math.round((completed / totalTasks) * 100) : 0;

  const weeklyContactData = (() => {
    const days = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
    return days.map((dia, index) => {
      const completedTasksForDay = allTasks.filter((t) => {
        if (t.estado !== "completada") return false;
        const ts = persistedTasks.find((pt) => pt.id === t.id);
        return ts && parseInt(t.id.slice(1)) % 7 === index;
      });
      const llamadas = completedTasksForDay.filter((t) => persistedTasks.find((pt) => pt.id === t.id)?.canalUsado === "llamada").length;
      const whatsapp = completedTasksForDay.filter((t) => persistedTasks.find((pt) => pt.id === t.id)?.canalUsado === "whatsapp").length;
      const exitosos = completedTasksForDay.filter((t) => persistedTasks.find((pt) => pt.id === t.id)?.resultadoContacto === "exitoso").length;
      return { dia, llamadas, whatsapp, exitosos };
    });
  })();

  const lifecycleData = [
    { name: "Post-venta", value: patients.filter((p) => p.estado === "post-venta").length, color: tokens.colorStatusSuccessForeground1 },
    { name: "Seguimiento 3M", value: patients.filter((p) => p.estado === "seguimiento-3m").length, color: "#8B5CF6" }, // este no tiene token directo, se deja
    { name: "Control 6M", value: patients.filter((p) => p.estado === "control-6m").length, color: tokens.colorStatusWarningForeground1 },
    { name: "Renovación 1A", value: patients.filter((p) => p.estado === "renovacion-1a").length, color: tokens.colorStatusDangerForeground1 },
    { name: "Inactivos", value: patients.filter((p) => p.estado === "inactivo").length, color: tokens.colorBrandForeground2 },
  ];

  const kpis = [
    { label: "Tasa de Cumplimiento", value: `${completionRate}%`, sub: `${completed} de ${totalTasks} completadas`, icon: TargetRegular, color: tokens.colorBrandForeground2, good: completionRate >= 70, onClick: () => navigate("/gerente/equipo") },
    { label: "Pacientes en Riesgo", value: patientsAtRisk, sub: "Fórmulas próximas o vencidas", icon: WarningRegular, color: tokens.colorStatusDangerForeground1, good: patientsAtRisk === 0, onClick: () => navigate("/gerente/pacientes?filter=at-risk") },
    { label: "Alertas Urgentes", value: urgentAlerts, sub: `de ${alerts.length} totales`, icon: PulseRegular, color: tokens.colorStatusWarningForeground1, good: urgentAlerts === 0, onClick: () => navigate("/gerente/problemas?urgent=true") },
    { label: "Tareas Vencidas", value: overdue, sub: `${pending} pendientes aún`, icon: ClockRegular, color: tokens.colorPaletteDarkOrangeForeground1, good: overdue === 0, onClick: () => navigate("/gerente/equipo") },
    { label: "Total Pacientes", value: patients.length, sub: "Base activa", icon: PeopleRegular, color: tokens.colorBrandForeground2, good: true, onClick: () => navigate("/gerente/pacientes") },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroLeft}>
            <div className={styles.heroBadge}>
              <ShieldCheckmarkRegular className={styles.heroBadgeIcon} />
              <span className={styles.heroBadgeText}>Supervisión en tiempo real</span>
            </div>
            <div className={styles.heroTitle}>Cumplimiento del equipo: {completionRate}%</div>
          </div>
          <div className={styles.heroRight}>
            <div className={styles.heroRightLabel}>Asesores activos</div>
            <div className={styles.heroRightValue}>
              {advisors.filter((a) => a.activo).length}/{advisors.length}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.kpiGrid}>
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          const iconBg = `${kpi.color}1F`;
          return (
            <button key={kpi.label} onClick={kpi.onClick} className={styles.kpiCard}>
              <div className={styles.kpiHeader}>
                <div className={styles.kpiIconBox} style={{ backgroundColor: iconBg, color: kpi.color }}>
                  <Icon style={{ width: "18px", height: "18px" }} />
                </div>
                {!kpi.good && <div className={styles.kpiWarningDot} />}
              </div>
              <div className={styles.kpiValue}>{kpi.value}</div>
              <div className={styles.kpiLabel}>{kpi.label}</div>
              <div className={styles.kpiSub}>{kpi.sub}</div>
            </button>
          );
        })}
      </div>

      <div className={styles.chartsGrid}>
        <Card className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Distribución Semanal de Tareas</h3>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={weeklyContactData} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke={tokens.colorNeutralStroke2} />
              <XAxis dataKey="dia" tick={{ fontSize: 11, fill: tokens.colorNeutralForeground2 }} />
              <YAxis tick={{ fontSize: 11, fill: tokens.colorNeutralForeground2 }} />
              <Tooltip
                contentStyle={{
                  fontSize: 12,
                  borderRadius: 8,
                  backgroundColor: tokens.colorNeutralBackground3,
                  border: `1px solid ${tokens.colorNeutralStroke1}`,
                }}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="llamadas" fill={barColors.llamadas} radius={[4, 4, 0, 0]} name="Llamadas" />
              <Bar dataKey="whatsapp" fill={barColors.whatsapp} radius={[4, 4, 0, 0]} name="WhatsApp" />
              <Bar dataKey="exitosos" fill={barColors.exitosos} radius={[4, 4, 0, 0]} name="Exitosos" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Ciclo de Vida</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={lifecycleData}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                paddingAngle={3}
                dataKey="value"
              >
                {lifecycleData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  fontSize: 12,
                  borderRadius: 8,
                  backgroundColor: tokens.colorNeutralBackground3,
                  border: `1px solid ${tokens.colorNeutralStroke1}`,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className={styles.pieChartLegend}>
            {lifecycleData.map((d, i) => (
              <div key={i} className={styles.legendItem}>
                <div className={styles.legendColorBox} style={{ backgroundColor: d.color }} />
                <span className={styles.legendLabel}>{d.name}</span>
                <span className={styles.legendValue}>{d.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}