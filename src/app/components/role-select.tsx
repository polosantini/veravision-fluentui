import { useNavigate } from "react-router";
import { makeStyles, shorthands, tokens, Button } from "@fluentui/react-components";
import { EyeRegular, ShieldCheckmarkRegular, HeadsetRegular, ChevronRight20Regular } from "@fluentui/react-icons";

const useStyles = makeStyles({
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "16px",
    backgroundColor: tokens.colorNeutralBackground1,
    background: `radial-gradient(ellipse at top, rgba(0,94,245,0.08), transparent 60%)`,
  },
  container: { width: "100%", maxWidth: "440px", display: "flex", flexDirection: "column", gap: "32px" },
  logoArea: { textAlign: "center" },
  logo: {
    width: "64px", height: "64px", borderRadius: "16px", backgroundColor: "#005EF5",
    display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto",
    boxShadow: "0 0 24px rgba(0,94,245,0.35)",
  },
  title: { marginTop: "20px", fontSize: "24px", fontWeight: 700, color: tokens.colorNeutralForeground1 },
  subtitle: { fontSize: "13px", color: tokens.colorNeutralForeground2, marginTop: "4px" },
  roleCard: {
    backgroundColor: tokens.colorNeutralBackground2,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: "16px",
    padding: "20px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    width: "100%",
    textAlign: "left",
    ":hover": {
      ...shorthands.borderColor("#005EF5"),
      boxShadow: "0 0 24px rgba(0,94,245,0.15)",
    },
  },
  roleContent: { display: "flex", alignItems: "center", gap: "16px" },
  iconBox: {
    width: "48px", height: "48px", borderRadius: "12px", backgroundColor: "#3B5E96",
    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  roleText: { flex: 1, minWidth: 0 },
  roleTitle: { fontSize: "15px", fontWeight: 600, color: tokens.colorNeutralForeground1 },
  roleDescription: { fontSize: "12px", color: tokens.colorNeutralForeground2, marginTop: "2px" },
  footer: { textAlign: "center", fontSize: "11px", color: tokens.colorNeutralForeground3 },
});

export function RoleSelect() {
  const navigate = useNavigate();
  const styles = useStyles();
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.logoArea}>
          <div className={styles.logo}><EyeRegular style={{ width: "32px", height: "32px", color: "white" }} /></div>
          <div className={styles.title}>VeraVisión</div>
          <div className={styles.subtitle}>Sistema de Trazabilidad y Seguimiento</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <Button appearance="subtle" className={styles.roleCard} onClick={() => navigate("/gerente")}>
            <div className={styles.roleContent}>
              <div className={styles.iconBox}><ShieldCheckmarkRegular style={{ width: "24px", height: "24px", color: "white" }} /></div>
              <div className={styles.roleText}><div className={styles.roleTitle}>Gerencia</div><div className={styles.roleDescription}>Estadísticas, rendimiento del equipo, administración y configuración</div></div>
              <ChevronRight20Regular style={{ color: tokens.colorNeutralForeground3, flexShrink: 0 }} />
            </div>
          </Button>
          <Button appearance="subtle" className={styles.roleCard} onClick={() => navigate("/asesora")}>
            <div className={styles.roleContent}>
              <div className={styles.iconBox}><HeadsetRegular style={{ width: "24px", height: "24px", color: "white" }} /></div>
              <div className={styles.roleText}><div className={styles.roleTitle}>Asesora</div><div className={styles.roleDescription}>Cola de tareas, registro rápido, alertas y seguimiento de pacientes</div></div>
              <ChevronRight20Regular style={{ color: tokens.colorNeutralForeground3, flexShrink: 0 }} />
            </div>
          </Button>
        </div>
        <div className={styles.footer}>VeraVisión CRM · Óptica — Ciclo de vida del paciente</div>
      </div>
    </div>
  );
}