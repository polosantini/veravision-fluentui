import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import {
  makeStyles,
  shorthands,
  tokens,
  Card,
  Spinner,
  Tooltip,
  Button,
} from "@fluentui/react-components";
import { ThemeProvider } from "@fluentui/react";
import {
  GroupedVerticalBarChart,
  DonutChart,
  IGroupedVerticalBarChartData,
  IChartProps,
} from "@fluentui/react-charting";
import {
  PeopleRegular,
  WarningRegular,
  ClockRegular,
  ShieldCheckmarkRegular,
  TargetRegular,
  PulseRegular,
} from "@fluentui/react-icons";
import { getPersistedTasks, useLocalStorage } from "../../hooks/useLocalStorage";
import {
  tasks,
  alerts,
  advisors,
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
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
  },
  kpiCard: {
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.border("1px", "solid", tokens.colorNeutralStroke2),
    ...shorthands.borderRadius("8px"),
    ...shorthands.padding("16px"),
    cursor: "pointer",
    textAlign: "center",
    boxShadow: tokens.shadow2,
    transition: "all 0.2s ease",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
    ":hover": {
      boxShadow: tokens.shadow8,
      transform: "translateY(-2px)",
    },
  },
  kpiIconBox: {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  kpiValue: {
    fontSize: tokens.fontSizeBase600,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    lineHeight: tokens.lineHeightBase600,
  },
  kpiLabel: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
    fontWeight: tokens.fontWeightSemibold,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  kpiSub: {
    fontSize: tokens.fontSizeBase100,
    color: tokens.colorNeutralForeground3,
    fontWeight: tokens.fontWeightRegular,
    marginTop: "4px",
  },
  kpiWarningDot: {
    position: "absolute",
    top: "12px",
    right: "12px",
    width: "10px",
    height: "10px",
    backgroundColor: tokens.colorStatusDangerBackground1,
    borderRadius: "50%",
    border: `1px solid ${tokens.colorStatusDangerForeground1}`,
  },
  chartsGrid: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: "16px",
  },
  chartCard: {
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.border("1px", "solid", tokens.colorNeutralStroke2),
    ...shorthands.borderRadius("8px"),
    ...shorthands.padding("20px"),
    boxShadow: tokens.shadow2,
  },
  chartTitle: {
    fontSize: tokens.fontSizeBase400,
    color: tokens.colorNeutralForeground1,
    fontWeight: tokens.fontWeightSemibold,
    marginBottom: "16px",
  },
  barChartContainer: {
    width: "100%",
    height: "380px",
    position: "relative",
  },
  donutContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "550px",
    width: "100%",
    overflow: "visible",
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "400px",
  },
});

export function ManagerDashboard() {
  const styles = useStyles();
  const navigate = useNavigate();
  const [persistedTasks, setPersistedTasks] = useState(getPersistedTasks());
  const [patients] = useLocalStorage<Patient[]>("veravision_patients", mockPatients);
  const [isChartDataReady, setIsChartDataReady] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setPersistedTasks(getPersistedTasks()), 1000);
    const timer = setTimeout(() => setIsChartDataReady(true), 100);
    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
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

  const days = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
  const llamadasData = [8, 10, 7, 12, 15, 4, 2];
  const whatsappData = [5, 6, 4, 8, 10, 3, 1];

  const barChartData: IGroupedVerticalBarChartData[] = [
    {
      name: "Llamadas",
      series: llamadasData.map((y, i) => ({
        key: `llamada-${i}`,
        data: y,
        legend: `Llamadas ${days[i]}`,
        x: days[i],
        y: y,
      })),
    },
    {
      name: "WhatsApp",
      series: whatsappData.map((y, i) => ({
        key: `whatsapp-${i}`,
        data: y,
        legend: `WhatsApp ${days[i]}`,
        x: days[i],
        y: y,
      })),
    },
  ];

  const lifecycleRaw = [
    { legend: "Post-venta", data: patients.filter((p) => p.estado === "post-venta").length, color: tokens.colorStatusSuccessForeground1 },
    { legend: "Seguimiento 3M", data: patients.filter((p) => p.estado === "seguimiento-3m").length, color: tokens.colorBrandForeground2 },
    { legend: "Control 6M", data: patients.filter((p) => p.estado === "control-6m").length, color: tokens.colorStatusWarningForeground1 },
    { legend: "Renovación 1A", data: patients.filter((p) => p.estado === "renovacion-1a").length, color: tokens.colorStatusDangerForeground1 },
    { legend: "Inactivos", data: patients.filter((p) => p.estado === "inactivo").length, color: tokens.colorNeutralForeground3 },
  ];

  const donutChartData: IChartProps = {
    chartTitle: "Ciclo de Vida",
    chartData: lifecycleRaw.map((item, idx) => ({
      legend: item.legend,
      data: item.data,
      color: item.color,
      xAxisCalloutData: item.legend,
      yAxisCalloutData: `${item.data}`,
      ...(idx === 0 && { callOutAccessibleData: item.legend }),
    })),
  };

  const kpis = [
    {
      label: "Cumplimiento",
      value: `${completionRate}%`,
      sub: `${completed} de ${totalTasks} completadas`,
      icon: TargetRegular,
      color: tokens.colorBrandForeground2,
      good: completionRate >= 70,
      onClick: () => navigate("/gerente/equipo"),
    },
    {
      label: "Pacientes en Riesgo",
      value: patientsAtRisk,
      sub: "Fórmulas próximas o vencidas",
      icon: WarningRegular,
      color: tokens.colorStatusDangerForeground1,
      good: patientsAtRisk === 0,
      onClick: () => navigate("/gerente/pacientes?filter=at-risk"),
    },
    {
      label: "Alertas Urgentes",
      value: urgentAlerts,
      sub: `de ${alerts.length} totales`,
      icon: PulseRegular,
      color: tokens.colorStatusWarningForeground1,
      good: urgentAlerts === 0,
      onClick: () => navigate("/gerente/problemas?urgent=true"),
    },
    {
      label: "Tareas Vencidas",
      value: overdue,
      sub: `${pending} pendientes aún`,
      icon: ClockRegular,
      color: tokens.colorPaletteDarkOrangeForeground1,
      good: overdue === 0,
      onClick: () => navigate("/gerente/equipo"),
    },
    {
      label: "Total Pacientes",
      value: patients.length,
      sub: "Base activa",
      icon: PeopleRegular,
      color: tokens.colorBrandForeground2,
      good: true,
      onClick: () => navigate("/gerente/pacientes"),
    },
  ];

  if (!isChartDataReady) {
    return (
      <div className={styles.loadingContainer}>
        <Spinner label="Cargando dashboard..." size="large" />
      </div>
    );
  }

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
          return (
            <Tooltip key={kpi.label} content={kpi.sub} relationship="label" positioning="above">
              <Button appearance="subtle" onClick={kpi.onClick} className={styles.kpiCard}>
                <div style={{ position: "relative", width: "100%" }}>
                  {!kpi.good && <div className={styles.kpiWarningDot} />}
                  <div
                    className={styles.kpiIconBox}
                    style={{ backgroundColor: tokens.colorNeutralBackground3, color: kpi.color }}
                  >
                    <Icon style={{ width: "24px", height: "24px" }} />
                  </div>
                  <div className={styles.kpiValue}>{kpi.value}</div>
                  <div className={styles.kpiLabel}>{kpi.label}</div>
                  <div className={styles.kpiSub}>{kpi.sub}</div>
                </div>
              </Button>
            </Tooltip>
          );
        })}
      </div>

      <div className={styles.chartsGrid}>
        <Card className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Contactos Semanales</h3>
          <div className={styles.barChartContainer}>
            <ThemeProvider>
              <GroupedVerticalBarChart
                data={barChartData}
                width={650}
                height={350}
                barwidth={35}
              />
            </ThemeProvider>
          </div>
        </Card>

        <Card className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Ciclo de Vida</h3>
          <div className={styles.donutContainer}>
            <ThemeProvider>
              <DonutChart
                key={JSON.stringify(donutChartData)}
                data={donutChartData}
                innerRadius={50}
                width={400}
                height={500}
                legendProps={{
                  allowFocusOnLegends: true,
                }}
              />
            </ThemeProvider>
          </div>
        </Card>
      </div>
    </div>
  );
}