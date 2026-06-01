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
  GridRegular,
  PeopleRegular,
  PeopleTeamRegular,
  SettingsRegular,
  EyeRegular,
  ShieldCheckmarkRegular,
  NavigationRegular,
  SignOutRegular,
  AlertRegular,
  WarningRegular,
} from "@fluentui/react-icons";
import { useAlertsSync } from "../../hooks/useAlertsSync";
import { getPersistedIssuesCount } from "../../hooks/useLocalStorage"; // si tienes esta función

function getIssuesCount() {
  try {
    const stored = window.localStorage.getItem("veravision_issues");
    if (!stored) return 0;
    const issues = JSON.parse(stored);
    return issues.filter((i: any) => i.estado === "pendiente").length;
  } catch {
    return 0;
  }
}

const navItems = [
  { to: "/gerente", icon: GridRegular, label: "Estadísticas" },
  { to: "/gerente/equipo", icon: PeopleTeamRegular, label: "Mi Equipo" },
  { to: "/gerente/pacientes", icon: PeopleRegular, label: "Base de Pacientes" },
  { to: "/gerente/problemas", icon: WarningRegular, label: "Problemas Reportados" },
  { to: "/gerente/configuracion", icon: SettingsRegular, label: "Configuración" },
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
  userRole: {
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
    backgroundColor: tokens.colorStatusDangerBackground,
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

export function ManagerLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const styles = useStyles();
  const { unreadCount: pendingIssues } = useAlertsSync(); // reutilizamos el mismo hook (aunque aquí las alertas son los problemas reportados, pero el contador de no leídas no aplica; mejor usar otro estado)
  // En realidad, para gerente, el contador de problemas pendientes viene de issues, no de alerts.
  // Debes mantener la lógica anterior para issues. Pero para que el contador de alertas (problemas) se actualice, puedes crear un hook similar para issues.
  // Por simplicidad, mantendremos el getIssuesCount con evento storage.

  const [pendingIssuesCount, setPendingIssuesCount] = useState(getIssuesCount());

  useEffect(() => {
    const handleStorage = () => setPendingIssuesCount(getIssuesCount());
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/gerente") return "Estadísticas Generales";
    if (path.includes("/equipo")) return "Rendimiento del Equipo";
    if (path.includes("/pacientes")) return "Base de Pacientes";
    if (path.includes("/problemas")) return "Problemas Reportados";
    if (path.includes("/configuracion")) return "Configuración";
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
            <EyeRegular style={{ width: "14px", height: "14px", color: "white" }} />
          </div>
          <h1 className={styles.userName}>VeraVisión</h1>
        </div>

        <div className={styles.userInfo}>
          <Avatar name="Gerente VeraVisión" size={32} color="brand" initials="GV" />
          <div className={styles.userText}>
            <div className={styles.userName}>Gerente VeraVisión</div>
            <div className={styles.userRole}>Panel de Gerencia</div>
          </div>
        </div>

        <nav className={styles.nav}>
          {navItems.map((item) => {
            const isActive = item.to === "/gerente"
              ? location.pathname === "/gerente"
              : location.pathname.includes(item.to);
            const IconComponent = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/gerente"}
                className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`}
                onClick={() => setSidebarOpen(false)}
              >
                <IconComponent style={{ width: "18px", height: "18px" }} />
                <span className={styles.navItemText}>{item.label}</span>
                {item.to === "/gerente/problemas" && pendingIssuesCount > 0 && (
                  <Badge appearance="filled" color="danger" size="small">{pendingIssuesCount}</Badge>
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
              onClick={() => navigate("/gerente/problemas")}
              className={styles.alertButton}
            >
              {pendingIssuesCount > 0 && <div className={styles.alertDot} />}
            </Button>
            <Avatar name="Gerente VeraVisión" size={32} color="colorful" initials="GV" />
          </div>
        </header>

        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}