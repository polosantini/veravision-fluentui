import { useState } from "react";
import {
  makeStyles,
  shorthands,
  tokens,
  Card,
  Button,
  Badge,
  Input,
  Label,
  Dialog,
  DialogSurface,
  DialogBody,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  MessageBar,
  MessageBarBody,
} from "@fluentui/react-components";
import {
  SearchRegular,
  CallRegular,
  ChatRegular,
  ChevronDownRegular,
  ChevronUpRegular,
  PersonAddRegular,
  EditRegular,
  CheckmarkCircleRegular,
  ErrorCircleRegular,
} from "@fluentui/react-icons";
import { format, differenceInDays, differenceInMonths } from "date-fns";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import {
  patients as mockPatients,
  getStatusLabel,
  type Patient,
} from "../../data/mock-data";

const getLoggedUser = () => {
  try {
    return JSON.parse(localStorage.getItem("veravision_user") || "{}");
  } catch {
    return { id: "a1", nombre: "Carlos Méndez" };
  }
};

const statusBadgeColor = (
  s: Patient["estado"]
): "success" | "important" | "warning" | "danger" | "informative" => {
  const m = {
    "post-venta": "success",
    "seguimiento-3m": "informative",
    "control-6m": "warning",
    "renovacion-1a": "danger",
    inactivo: "important",
  } as const;
  return m[s];
};

const useStyles = makeStyles({
  container: {
    maxWidth: "850px",
    ...shorthands.margin("0", "auto"),
    display: "flex",
    flexDirection: "column",
    ...shorthands.gap("16px"),
  },
  headerRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  patientsCount: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
  },
  patientCard: {
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.border("1px", "solid", tokens.colorNeutralStroke2),
    ...shorthands.borderRadius("4px"),
    ...shorthands.overflow("hidden"),
    boxShadow: tokens.shadow2,
    transition: "box-shadow 0.1s ease, background-color 0.1s ease",
    ":hover": {
      boxShadow: tokens.shadow4,
      backgroundColor: tokens.colorSubtleBackgroundHover,
    },
  },
  personaRow: {
    display: "flex",
    alignItems: "center",
    ...shorthands.gap("12px"),
    ...shorthands.padding("12px", "16px"),
    cursor: "pointer",
  },
  personaPrimary: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    lineHeight: tokens.lineHeightBase300,
  },
  personaSecondary: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
    lineHeight: tokens.lineHeightBase200,
    marginTop: "2px",
  },
  personaTertiary: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
    lineHeight: tokens.lineHeightBase200,
    textAlign: "right",
    whiteSpace: "nowrap",
  },
  expandedContent: {
    padding: "12px 16px 16px",
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  twoColumnGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
  },
  dataSection: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  sectionLabel: {
    fontSize: tokens.fontSizeBase100,
    color: tokens.colorNeutralForeground3,
    fontWeight: tokens.fontWeightSemibold,
    marginBottom: "4px",
  },
  contactHistoryItem: {
    backgroundColor: tokens.colorNeutralBackground3,
    padding: "8px",
    borderRadius: "8px",
    fontSize: tokens.fontSizeBase100,
  },
  contactHeader: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  formulaStatusText: (props: { color: string }) => ({
    color: props.color,
    marginTop: "2px",
  }),
});

export function AdvisorPatients() {
  const styles = useStyles();
  const [user] = useState(getLoggedUser());
  const [patients, setPatients] = useLocalStorage<Patient[]>(
    "veravision_patients",
    mockPatients
  );
  const myPatients = patients.filter((p) => p.asesorAsignado === user.id);

  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Patient | null>(null);

  const [nombre, setNombre] = useState("");
  const [cedula, setCedula] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const filtered = myPatients.filter(
    (p) =>
      p.nombre.toLowerCase().includes(search.toLowerCase()) ||
      p.telefono.includes(search)
  );

  const getDaysLabel = (date: Date) => {
    const days = differenceInDays(new Date(), date);
    if (days === 0) return "Hoy";
    if (days === 1) return "Ayer";
    if (days < 30) return `Hace ${days}d`;
    return `Hace ${differenceInMonths(new Date(), date)}m`;
  };

  const getFormulaStatus = (date: Date) => {
    const days = differenceInDays(date, new Date());
    if (days < 0)
      return {
        label: `Venció hace ${Math.abs(days)}d`,
        color: tokens.colorStatusDangerForeground1,
      };
    if (days <= 30)
      return {
        label: `Vence ${days}d`,
        color: tokens.colorStatusDangerForeground1,
      };
    if (days <= 90)
      return {
        label: `Vence ${days}d`,
        color: tokens.colorStatusWarningForeground1,
      };
    return {
      label: `Vence ${days}d`,
      color: tokens.colorNeutralForeground3,
    };
  };

  const openAdd = () => {
    setEditing(null);
    setShowForm(true);
    setNombre("");
    setCedula("");
    setTelefono("");
    setEmail("");
    setError("");
    setSuccess(false);
  };

  const openEdit = (p: Patient) => {
    setEditing(p);
    setShowForm(true);
    setNombre(p.nombre);
    setCedula(p.cedula);
    setTelefono(p.telefono);
    setEmail(p.email);
    setError("");
    setSuccess(false);
  };

  const close = () => {
    setShowForm(false);
    setEditing(null);
    setError("");
    setSuccess(false);
  };

  const submit = () => {
    setError("");
    setSuccess(false);

    if (!nombre.trim() || !cedula.trim() || !telefono.trim() || !email.trim()) {
      setError("Todos los campos son obligatorios");
      return;
    }
    if (!/^[\d.]+$/.test(cedula)) {
      setError("La cédula debe contener solo números");
      return;
    }
    if (!/^\d{3}-?\d{3}-?\d{4}$/.test(telefono)) {
      setError("El teléfono debe tener formato válido (ej: 310-555-0101)");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("El correo electrónico no es válido");
      return;
    }

    if (editing) {
      const dup = patients.find(
        (p) =>
          p.id !== editing.id && (p.cedula === cedula || p.email === email)
      );
      if (dup) {
        setError(
          "Ya existe otro paciente con esta cédula o correo electrónico"
        );
        return;
      }
      setPatients(
        patients.map((p) =>
          p.id === editing.id ? { ...p, nombre, cedula, telefono, email } : p
        )
      );
    } else {
      const dup = patients.find(
        (p) => p.cedula === cedula || p.email === email
      );
      if (dup) {
        setError(
          "Ya existe un paciente con esta cédula o correo electrónico"
        );
        return;
      }
      const newP: Patient = {
        id: `p${Date.now()}`,
        nombre,
        cedula,
        telefono,
        email,
        fechaUltimaCompra: new Date(),
        fechaUltimoControl: new Date(),
        fechaVencimientoFormula: new Date(
          Date.now() + 365 * 24 * 60 * 60 * 1000
        ),
        productoComprado: "Pendiente de registro",
        asesorAsignado: user.id || "a1",
        estado: "post-venta",
        valorUltimaCompra: 0,
        totalCompras: 1,
        historialContactos: [],
      };
      setPatients([...patients, newP]);
    }
    setSuccess(true);
    setTimeout(close, 1500);
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <div className={styles.patientsCount}>
          {myPatients.length} pacientes asignados
        </div>
        <Button appearance="primary" icon={<PersonAddRegular />} onClick={openAdd}>
          Agregar Paciente
        </Button>
      </div>

      <Input
        contentBefore={<SearchRegular />}
        placeholder="Buscar por nombre o teléfono..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        size="large"
      />

      <Dialog open={showForm} onOpenChange={(_, d) => !d.open && close()}>
        <DialogSurface>
          <DialogBody>
            <DialogTitle>
              {editing ? "Editar Paciente" : "Registrar Nuevo Paciente"}
            </DialogTitle>
            <DialogContent>
              <div
                style={{ display: "flex", flexDirection: "column", gap: "12px" }}
              >
                {success && (
                  <MessageBar intent="success">
                    <MessageBarBody>
                      <CheckmarkCircleRegular />{" "}
                      {editing
                        ? "¡Paciente actualizado!"
                        : "¡Paciente registrado!"}
                    </MessageBarBody>
                  </MessageBar>
                )}
                {error && (
                  <MessageBar intent="error">
                    <MessageBarBody>
                      <ErrorCircleRegular /> {error}
                    </MessageBarBody>
                  </MessageBar>
                )}

                <div>
                  <Label size="small" weight="semibold">
                    Nombre Completo *
                  </Label>
                  <Input
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ej: Jorge Hernández Pérez"
                    style={{ width: "100%", marginTop: "4px" }}
                  />
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "12px",
                  }}
                >
                  <div>
                    <Label size="small" weight="semibold">
                      Cédula *
                    </Label>
                    <Input
                      value={cedula}
                      onChange={(e) => setCedula(e.target.value)}
                      placeholder="1.023.456.789"
                      style={{ width: "100%", marginTop: "4px" }}
                    />
                  </div>
                  <div>
                    <Label size="small" weight="semibold">
                      Celular *
                    </Label>
                    <Input
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                      placeholder="310-555-0101"
                      style={{ width: "100%", marginTop: "4px" }}
                    />
                  </div>
                </div>
                <div>
                  <Label size="small" weight="semibold">
                    Correo *
                  </Label>
                  <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="email@ejemplo.com"
                    style={{ width: "100%", marginTop: "4px" }}
                  />
                </div>
              </div>
            </DialogContent>
            <DialogActions>
              <Button appearance="secondary" onClick={close}>
                Cancelar
              </Button>
              <Button appearance="primary" onClick={submit}>
                {editing ? "Guardar Cambios" : "Registrar"}
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {filtered.map((p) => {
          const expanded = expandedId === p.id;
          const formula = getFormulaStatus(p.fechaVencimientoFormula);
          return (
            <div key={p.id} className={styles.patientCard}>
              <div
                className={styles.personaRow}
                onClick={() => setExpandedId(expanded ? null : p.id)}
              >
                <Avatar name={p.nombre} size={40} color="brand" />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      flexWrap: "wrap",
                    }}
                  >
                    <span className={styles.personaPrimary}>{p.nombre}</span>
                    <Badge
                      appearance="tint"
                      color={statusBadgeColor(p.estado)}
                      size="small"
                    >
                      {getStatusLabel(p.estado)}
                    </Badge>
                  </div>
                  <div className={styles.personaSecondary}>
                    {p.productoComprado}
                  </div>
                </div>
                <div className={styles.personaTertiary}>
                  <div>{getDaysLabel(p.fechaUltimaCompra)}</div>
                  <div style={{ color: formula.color, marginTop: "2px" }}>
                    {formula.label}
                  </div>
                </div>
                <Button
                  size="small"
                  appearance="subtle"
                  icon={<EditRegular />}
                  onClick={(e) => {
                    e.stopPropagation();
                    openEdit(p);
                  }}
                />
                {expanded ? <ChevronUpRegular /> : <ChevronDownRegular />}
              </div>

              {expanded && (
                <div className={styles.expandedContent}>
                  <div className={styles.twoColumnGrid}>
                    <div className={styles.dataSection}>
                      <div className={styles.sectionLabel}>DATOS</div>
                      <p>Tel: {p.telefono}</p>
                      <p>Email: {p.email}</p>
                      <p>CC: {p.cedula}</p>
                      <p>Producto: {p.productoComprado}</p>
                      <p>Valor: ${p.valorUltimaCompra.toLocaleString()}</p>
                      <p>Compras: {p.totalCompras}</p>
                    </div>
                    <div>
                      <div className={styles.sectionLabel}>HISTORIAL</div>
                      {p.historialContactos.length === 0 ? (
                        <div
                          style={{
                            fontSize: tokens.fontSizeBase100,
                            color: tokens.colorNeutralForeground3,
                            fontStyle: "italic",
                          }}
                        >
                          Sin contactos previos
                        </div>
                      ) : (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "6px",
                          }}
                        >
                          {p.historialContactos.map((c, i) => (
                            <div key={i} className={styles.contactHistoryItem}>
                              <div className={styles.contactHeader}>
                                <span style={{ color: tokens.colorNeutralForeground2 }}>
                                  {format(c.fecha, "dd/MM/yy")}
                                </span>
                                <span style={{ color: tokens.colorNeutralForeground2 }}>
                                  {c.tipo}
                                </span>
                                <Badge
                                  appearance="tint"
                                  size="small"
                                  color={
                                    c.resultado === "exitoso"
                                      ? "success"
                                      : c.resultado === "no-contesta"
                                      ? "danger"
                                      : "warning"
                                  }
                                >
                                  {c.resultado}
                                </Badge>
                              </div>
                              {c.notas && (
                                <p
                                  style={{
                                    color: tokens.colorNeutralForeground2,
                                    marginTop: "4px",
                                  }}
                                >
                                  {c.notas}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}