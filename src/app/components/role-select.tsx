import { useNavigate } from "react-router";
import {
  makeStyles,
  shorthands,
  tokens,
  Card,
} from "@fluentui/react-components";
import {
  EyeRegular,
  ShieldCheckmarkRegular,
  HeadsetRegular,
  ChevronRight20Regular,
} from "@fluentui/react-icons";

const useStyles = makeStyles({
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    ...shorthands.padding("16px"),
    backgroundColor: tokens.colorNeutralBackground1,
    background: `radial-gradient(ellipse at top, rgba(0,94,245,0.08), transparent 60%)`,
  },
  logo: {
    width: "64px",
    height: "64px",
    ...shorthands.borderRadius("16px"),
    backgroundColor: "#005EF5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 0 24px rgba(0,94,245,0.35)",
    ...shorthands.margin("0", "auto"),
  },
  roleCard: {
    width: "100%",
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.border("1px", "solid", tokens.colorNeutralStroke2),
    ...shorthands.borderRadius("16px"),
    ...shorthands.padding("20px"),
    cursor: "pointer",
    transition: "all 0.2s ease",
    ":hover": {
      ...shorthands.borderColor("#005EF5"),
      boxShadow: "0 0 24px rgba(0,94,245,0.15)",
    },
  },
  iconBox: {
    width: "48px",
    height: "48px",
    ...shorthands.borderRadius("12px"),
    backgroundColor: "#3B5E96",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
});

export function RoleSelect() {
  const navigate = useNavigate();
  const styles = useStyles();

  return (
    <div className={styles.page}>
      <div style={{ width: "100%", maxWidth: "440px", display: "flex", flexDirection: "column", gap: "32px" }}>
        <div style={{ textAlign: "center" }}>
          <div className={styles.logo}>
            <EyeRegular style={{ width: "32px", height: "32px", color: "white" }} />
          </div>
          <h1 style={{ marginTop: "20px", fontSize: "24px", fontWeight: 700, color: tokens.colorNeutralForeground1 }}>
            VeraVisión
          </h1>
          <p style={{ fontSize: "13px", color: tokens.colorNeutralForeground2, marginTop: "4px" }}>
            Sistema de Trazabilidad y Seguimiento
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {[
            { path: "/gerente", icon: ShieldCheckmarkRegular, title: "Gerencia", desc: "Estadísticas, rendimiento del equipo, administración y configuración" },
            { path: "/asesora", icon: HeadsetRegular, title: "Asesora", desc: "Cola de tareas, registro rápido, alertas y seguimiento de pacientes" },
          ].map((r) => {
            const Icon = r.icon;
            return (
              <Card key={r.path} className={styles.roleCard} onClick={() => navigate(r.path)}>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <div className={styles.iconBox}>
                    <Icon style={{ width: "24px", height: "24px", color: "white" }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: "15px", fontWeight: 600, color: tokens.colorNeutralForeground1 }}>{r.title}</p>
                    <p style={{ fontSize: "12px", color: tokens.colorNeutralForeground2, marginTop: "2px" }}>{r.desc}</p>
                  </div>
                  <ChevronRight20Regular style={{ color: tokens.colorNeutralForeground3, flexShrink: 0 }} />
                </div>
              </Card>
            );
          })}
        </div>

        <p style={{ textAlign: "center", fontSize: "11px", color: tokens.colorNeutralForeground3 }}>
          VeraVisión CRM · Óptica — Ciclo de vida del paciente
        </p>
      </div>
    </div>
  );
}
