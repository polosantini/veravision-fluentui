import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Card, Button, Input, Label, MessageBar, MessageBarBody, Avatar,
  makeStyles, shorthands, tokens,
} from "@fluentui/react-components";
import { Eye20Regular, HeadsetRegular, ShieldCheckmarkRegular, ErrorCircle20Regular } from "@fluentui/react-icons";

const MANAGER_CODE = "GER2024";
const advisorsList = [
  { id: "a1", nombre: "Carlos Méndez", avatar: "CM", codigo: "CM2024" },
  { id: "a2", nombre: "Laura Gómez", avatar: "LG", codigo: "LG2024" },
  { id: "a3", nombre: "Andrés Ruiz", avatar: "AR", codigo: "AR2024" },
  { id: "a4", nombre: "María Torres", avatar: "MT", codigo: "MT2024" },
];

const useStyles = makeStyles({
  pageContainer: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
    backgroundColor: tokens.colorNeutralBackground1,
  },
  roleSelectionContainer: { maxWidth: "900px", width: "100%" },
  logoContainer: { textAlign: "center", marginBottom: "40px" },
  logoIcon: {
    width: "40px",
    height: "40px",
    borderRadius: "4px",
    backgroundColor: tokens.colorBrandBackground,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 16px",
  },
  title: {
    fontSize: tokens.fontSizeHero700,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    marginBottom: "8px",
    lineHeight: tokens.lineHeightHero700,
  },
  subtitle: {
    fontSize: tokens.fontSizeBase300,
    color: tokens.colorNeutralForeground3,
  },
  roleGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "16px",
  },
  roleCard: {
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: "4px",
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    padding: "24px",
    cursor: "pointer",
    textAlign: "center",
    boxShadow: tokens.shadow2,
    ":hover": { boxShadow: tokens.shadow8 },
  },
  roleIconContainer: {
    width: "48px",
    height: "48px",
    borderRadius: "4px",
    backgroundColor: tokens.colorBrandBackground,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 16px",
  },
  roleTitle: {
    fontSize: tokens.fontSizeBase500,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    marginBottom: "8px",
    lineHeight: tokens.lineHeightBase500,
  },
  roleDescription: {
    fontSize: tokens.fontSizeBase300,
    color: tokens.colorNeutralForeground3,
  },
  loginContainer: { maxWidth: "450px", width: "100%" },
  backButton: { marginBottom: "24px", fontSize: tokens.fontSizeBase200 },
  loginCard: {
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: "4px",
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    padding: "44px",
    boxShadow: tokens.shadow16,
    width: "100%",
    maxWidth: "440px",
  },
  loginHeaderIcon: {
    width: "56px",
    height: "56px",
    borderRadius: "12px",
    backgroundColor: tokens.colorBrandBackground,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 16px",
  },
  loginTitle: { fontSize: "20px", fontWeight: 600, textAlign: "center", marginBottom: "8px" },
  loginSubtitle: { fontSize: "13px", color: tokens.colorNeutralForeground2, textAlign: "center", marginBottom: "24px" },
  formGroup: { display: "flex", flexDirection: "column", gap: "16px" },
  fullWidthInput: { width: "100%", marginTop: "8px" },
  fullWidthButton: { width: "100%", fontWeight: 500 },
  testCodeHint: { fontSize: "11px", color: tokens.colorNeutralForeground3, textAlign: "center", marginTop: "16px" },
  advisorGrid: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" },
  advisorCard: {
    padding: "16px",
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: "4px",
    cursor: "pointer",
    textAlign: "center",
    backgroundColor: tokens.colorNeutralBackground1,
    ":hover": { backgroundColor: tokens.colorSubtleBackgroundHover },
  },
  advisorAvatar: { margin: "0 auto 8px" },
  advisorName: { fontSize: "13px", fontWeight: 500, color: tokens.colorNeutralForeground1 },
});

export function Login() {
  const navigate = useNavigate();
  const styles = useStyles();
  const [role, setRole] = useState<"asesora" | "gerente" | null>(null);
  const [selectedAdvisor, setSelectedAdvisor] = useState<any>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (role === "gerente") {
      if (code === MANAGER_CODE) {
        localStorage.setItem("veravision_user", JSON.stringify({ role: "gerente", id: "manager", nombre: "Gerente VeraVisión" }));
        navigate("/gerente");
      } else setError("Código incorrecto");
    } else if (role === "asesora" && selectedAdvisor) {
      if (code === selectedAdvisor.codigo) {
        localStorage.setItem("veravision_user", JSON.stringify({ role: "asesora", id: selectedAdvisor.id, nombre: selectedAdvisor.nombre }));
        navigate("/asesora");
      } else setError("Código incorrecto");
    }
  };

  if (!role) return (
    <div className={styles.pageContainer}>
      <div className={styles.roleSelectionContainer}>
        <div className={styles.logoContainer}>
          <div className={styles.logoIcon}><Eye20Regular style={{ width: "20px", height: "20px", color: "white" }} /></div>
          <h1 className={styles.title}>VeraVisión CRM</h1>
          <p className={styles.subtitle}>Sistema de gestión de clientes para óptica</p>
        </div>
        <div className={styles.roleGrid}>
          <div className={styles.roleCard} onClick={() => setRole("asesora")}>
            <div className={styles.roleIconContainer}><HeadsetRegular style={{ width: "28px", height: "28px", color: "white" }} /></div>
            <h2 className={styles.roleTitle}>Soy Asesora</h2>
            <p className={styles.roleDescription}>Accede a tu cola de tareas, calendario y pacientes asignados</p>
          </div>
          <div className={styles.roleCard} onClick={() => setRole("gerente")}>
            <div className={styles.roleIconContainer}><ShieldCheckmarkRegular style={{ width: "28px", height: "28px", color: "white" }} /></div>
            <h2 className={styles.roleTitle}>Soy Gerente</h2>
            <p className={styles.roleDescription}>Supervisa el equipo, estadísticas y configura el sistema</p>
          </div>
        </div>
      </div>
    </div>
  );

  if (role === "gerente") return (
    <div className={styles.pageContainer}>
      <div className={styles.loginContainer}>
        <Button appearance="subtle" onClick={() => { setRole(null); setCode(""); setError(""); }} className={styles.backButton}>← Volver</Button>
        <Card className={styles.loginCard}>
          <div className={styles.loginHeaderIcon}><ShieldCheckmarkRegular style={{ width: "28px", height: "28px", color: "white" }} /></div>
          <h2 className={styles.loginTitle}>Acceso Gerencia</h2>
          <p className={styles.loginSubtitle}>Ingresa tu código de gerencia</p>
          <div className={styles.formGroup}>
            <div>
              <Label size="small" weight="semibold">Código de Gerencia</Label>
              <Input
                type="password"
                value={code}
                onChange={(e) => { setCode(e.target.value); setError(""); }}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder="Ingresa tu código"
                size="large"
                className={styles.fullWidthInput}
              />
            </div>
            {error && <MessageBar intent="error" icon={<ErrorCircle20Regular />}><MessageBarBody>{error}</MessageBarBody></MessageBar>}
            <Button appearance="primary" onClick={handleLogin} disabled={!code} size="large" className={styles.fullWidthButton}>Iniciar Sesión</Button>
          </div>
        </Card>
        <div className={styles.testCodeHint}>Código de prueba: GER2024</div>
      </div>
    </div>
  );

  if (role === "asesora" && !selectedAdvisor) return (
    <div className={styles.pageContainer}>
      <div style={{ maxWidth: "600px", width: "100%" }}>
        <Button appearance="subtle" onClick={() => { setRole(null); setCode(""); setError(""); }} className={styles.backButton}>← Volver</Button>
        <Card className={styles.loginCard} style={{ maxWidth: "600px" }}>
          <div className={styles.loginHeaderIcon}><HeadsetRegular style={{ width: "28px", height: "28px", color: "white" }} /></div>
          <h2 className={styles.loginTitle}>Selecciona tu Usuario</h2>
          <p className={styles.loginSubtitle}>Elige tu nombre de la lista</p>
          <div className={styles.advisorGrid}>
            {advisorsList.map(advisor => (
              <div key={advisor.id} className={styles.advisorCard} onClick={() => setSelectedAdvisor(advisor)}>
                <Avatar name={advisor.nombre} initials={advisor.avatar} size={48} className={styles.advisorAvatar} color="brand" />
                <div className={styles.advisorName}>{advisor.nombre}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );

  return (
    <div className={styles.pageContainer}>
      <div className={styles.loginContainer}>
        <Button appearance="subtle" onClick={() => { setSelectedAdvisor(null); setCode(""); setError(""); }} className={styles.backButton}>← Cambiar usuario</Button>
        <Card className={styles.loginCard}>
          <Avatar name={selectedAdvisor.nombre} initials={selectedAdvisor.avatar} size={48} className={styles.advisorAvatar} color="brand" />
          <h2 className={styles.loginTitle}>{selectedAdvisor.nombre}</h2>
          <p className={styles.loginSubtitle}>Ingresa tu código de acceso</p>
          <div className={styles.formGroup}>
            <div>
              <Label size="small" weight="semibold">Código de Acceso</Label>
              <Input
                type="password"
                value={code}
                onChange={(e) => { setCode(e.target.value); setError(""); }}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder="Ingresa tu código"
                size="large"
                className={styles.fullWidthInput}
              />
            </div>
            {error && <MessageBar intent="error" icon={<ErrorCircle20Regular />}><MessageBarBody>{error}</MessageBarBody></MessageBar>}
            <Button appearance="primary" onClick={handleLogin} disabled={!code} size="large" className={styles.fullWidthButton}>Iniciar Sesión</Button>
          </div>
        </Card>
        <div className={styles.testCodeHint}>Código de prueba: {selectedAdvisor.codigo}</div>
      </div>
    </div>
  );
}