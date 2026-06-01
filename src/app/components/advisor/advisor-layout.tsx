import { Outlet, NavLink, useLocation, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import {
  makeStyles,
  shorthands,
  tokens,
  Button,
  Avatar,
  Badge,
} from "@fluentui/react-components";
import {
  ClipboardTaskRegular,
  AlertRegular,
  EyeRegular,
  HeadsetRegular,
  NavigationRegular,
  SignOutRegular,
  PersonRegular,
  CalendarRegular,
  WarningRegular,
} from "@fluentui/react-icons";
import { tasks as staticTasks } from "../../data/mock-data";
import { useTasksSync } from "../../hooks/useTasksSync";
import { useAlertsSync } from "../../hooks/useAlertsSync";

const getLoggedUser = () => {
  try {
    return JSON.parse(localStorage.getItem("veravision_user") || "{}");
  } catch {
    return { id: "a1", nombre: "Carlos Méndez" };
  }
};

const navItems = [
  { to: "/asesora", icon: ClipboardTaskRegular, label: "Mi Cola" },
  { to: "/asesora/calendario", icon: CalendarRegular, label: "Calendario" },
  { to: "/asesora/alertas", icon: AlertRegular, label: "Mis Alertas" },
  { to: "/asesora/pacientes", icon: PersonRegular, label: "Mis Pacientes" },
  { to: "/asesora/problemas", icon: WarningRegular, label: "Reportar Problema" },
];

const useStyles = makeStyles({
  container: {
    display: "flex",
    height: "100vh",
    backgroundColor: tokens.colorNeutralBackground3,
    fontFamily: tokens.fontFamilyBase,
  },
  sidebar: {
    width: "240px",
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.borderRight("1px", "solid", tokens.colorNeutralStroke2),
    display: "flex",
    flexDirection: "column",
    flexShrink: 0,
  },
  sidebarHidden: {
    display: "none",
  },
  sidebarVisible: {
    display: "flex",
  },
  sidebarHeader: {
    display: "flex",
    alignItems: "center",
    ...shorthands.gap("12px"),
    ...shorthands.padding("16px"),
    height: "48px",
    ...shorthands.borderBottom("1px", "solid", tokens.colorNeutralStroke2),
  },
  logoContainer: {
    width: "24px",
    height: "24px",
    ...shorthands.borderRadius("2px"),
    backgroundColor: tokens.colorBrandBackground,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  userInfo: {
    ...shorthands.padding("12px", "16px"),
    ...shorthands.borderBottom("1px", "solid", tokens.colorNeutralStroke2),
    display: "flex",
    alignItems: "center",
    ...shorthands.gap("12px"),
  },
  userText: {
    minWidth: 0,
  },
  userName: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    lineHeight: tokens.lineHeightBase300,
  },
  userTasks: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
    lineHeight: tokens.lineHeightBase200,
  },
  nav: {
    flex: 1,
    ...shorthands.padding("8px", "0"),
    display: "flex",
    flexDirection: "column",
    ...shorthands.gap("2px"),
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    ...shorthands.gap("12px"),
    ...shorthands.padding("8px", "16px"),
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightRegular,
    color: tokens.colorNeutralForeground1,
    textDecoration: "none",
    cursor: "pointer",
    ...shorthands.borderLeft("3px", "solid", "transparent"),
    ":hover": {
      backgroundColor: tokens.colorSubtleBackgroundHover,
    },
  },
  navItemActive: {
    backgroundColor: tokens.colorSubtleBackgroundHover,
    color: tokens.colorBrandForeground1,
    fontWeight: tokens.fontWeightSemibold,
    ...shorthands.borderLeft("3px", "solid", tokens.colorBrandBackground),
  },
  navItemText: {
    flex: 1,
  },
  footer: {
    padding: "12px",
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  fullWidthButton: {
    width: "100%",
    justifyContent: "flex-start",
  },
  mainContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
  },
  header: {
    height: "48px",
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.borderBottom("1px", "solid", tokens.colorNeutralStroke2),
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    ...shorthands.padding("0", "16px"),
    flexShrink: 0,
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  headerTitle: {
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
  },
  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  alertButton: {
    position: "relative",
  },
  alertDot: {
    position: "absolute",
    top: "4px",
    right: "4px",
    width: "8px",
    height: "8px",
    backgroundColor: tokens.colorStatusDangerBackground1,
    borderRadius: "50%",
  },
  main: {
    flex: 1,
    overflow: "auto",
    ...shorthands.padding("24px"),
    backgroundColor: tokens.colorNeutralBackground3,
  },
  menuButton: {
    "@media (min-width: 1024px)": {
      display: "none",
    },
  },
});

export function AdvisorLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(getLoggedUser());
  const location = useLocation();
  const navigate = useNavigate();
  const styles = useStyles();

  const { unreadCount: myAlerts } = useAlertsSync();
  const { tasks: syncedTasks, loading: tasksLoading } = useTasksSync();

  useEffect(() => {
    const loggedUser = getLoggedUser();
    setUser(loggedUser);
  }, []);

  // Calcular tareas pendientes y vencidas del usuario actual
  const myPendingTasks = (() => {
    if (tasksLoading) return 0;
    // Combinar tareas estáticas con estado persistido
    const combinedTasks = staticTasks.map((task) => {
      const persisted = syncedTasks.find((pt) => pt.id === task.id);
      return persisted ? { ...task, estado: persisted.estado } : task;
    });
    const userTasks = combinedTasks.filter(
      (t) => t.asesorAsignado === user.id && (t.estado === "pendiente" || t.estado === "vencida")
    );
    return userTasks.length;
  })();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/asesora") return "Mi Cola de Tareas";
    if (path.includes("/calendario")) return "Calendario";
    if (path.includes("/alertas")) return "Mis Alertas";
    if (path.includes("/pacientes")) return "Mis Pacientes";
    if (path.includes("/problemas")) return "Reportar Problema";
    return "VeraVisión";
  };

  const sidebarClasses = `${styles.sidebar} ${
    window.innerWidth < 1024 && !sidebarOpen ? styles.sidebarHidden : styles.sidebarVisible
  }`;

  return (
    <div className={styles.container}>
      <aside className={sidebarClasses}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logoContainer}>
            <HeadsetRegular style={{ width: "14px", height: "14px", color: "white" }} />
          </div>
          <h1 className={styles.userName}>VeraVisión</h1>
        </div>

        <div className={styles.userInfo}>
          <Avatar
            name={user.nombre}
            size={36}
            color="brand"
            initials={user.nombre?.split(" ").map((n: string) => n[0]).slice(0, 2).join("") || "??"}
          />
          <div className={styles.userText}>
            <div className={styles.userName}>{user.nombre || "Usuario"}</div>
            <div className={styles.userTasks}>{myPendingTasks} tareas pendientes</div>
          </div>
        </div>

        <nav className={styles.nav}>
          {navItems.map((item) => {
            const isActive = item.to === "/asesora"
              ? location.pathname === "/asesora"
              : location.pathname.includes(item.to);
            const IconComponent = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/asesora"}
                className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`}
                onClick={() => setSidebarOpen(false)}
              >
                <IconComponent style={{ width: "18px", height: "18px" }} />
                <span className={styles.navItemText}>{item.label}</span>
                {item.to === "/asesora/alertas" && myAlerts > 0 && (
                  <Badge appearance="filled" color="danger" size="small">{myAlerts}</Badge>
                )}
                {item.to === "/asesora" && myPendingTasks > 0 && (
                  <Badge appearance="filled" color="brand" size="small">{myPendingTasks}</Badge>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className={styles.footer}>
          <Button
            appearance="subtle"
            icon={<SignOutRegular />}
            onClick={() => navigate("/")}
            className={styles.fullWidthButton}
          >
            Cambiar Rol
          </Button>
        </div>
      </aside>

      <div className={styles.mainContent}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <Button
              appearance="subtle"
              icon={<NavigationRegular />}
              onClick={() => setSidebarOpen(true)}
              className={styles.menuButton}
            />
            <h2 className={styles.headerTitle}>{getPageTitle()}</h2>
          </div>
          <div className={styles.headerRight}>
            <Button
              appearance="subtle"
              icon={<AlertRegular />}
              onClick={() => navigate("/asesora/alertas")}
              className={styles.alertButton}
            >
              {myAlerts > 0 && <div className={styles.alertDot} />}
            </Button>
            <Avatar
              name={user.nombre}
              size={32}
              color="colorful"
              initials={user.nombre?.split(" ").map((n: string) => n[0]).slice(0, 2).join("") || "??"}
            />
          </div>
        </header>

        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}