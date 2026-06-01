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
  Dropdown,
  Option,
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
import { formatPhoneNumber, isValidPhoneNumber, isValidDocumentNumber } from "../../utils/format";

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
  fullWidth: {
    width: "100%",
    marginTop: "4px",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
  },
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
  const [tipoDocumento, setTipoDocumento] = useState<"CC" | "CE" | "NIT" | "Pasaporte">("CC");
  const [numeroDocumento, setNumeroDocumento] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const filtered = myPatients.filter(
    (p) =>
      p.nombre.toLowerCase().includes(search.toLowerCase()) ||
      p.numeroDocumento.includes(search) ||
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
    setTipoDocumento("CC");
    setNumeroDocumento("");
    setTelefono("");
    setEmail("");
    setError("");
    setSuccess(false);
  };

  const openEdit = (p: Patient) => {
    setEditing(p);
    setShowForm(true);
    setNombre(p.nombre);
    setTipoDocumento(p.tipoDocumento);
    setNumeroDocumento(p.numeroDocumento);
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

    if (!nombre.trim()) { setError("El nombre es obligatorio"); return; }
    if (!numeroDocumento.trim()) { setError("El número de documento es obligatorio"); return; }
    if (!isValidDocumentNumber(numeroDocumento)) { setError("El número de documento debe contener solo dígitos (máx 15)"); return; }
    if (!telefono.trim()) { setError("El celular es obligatorio"); return; }
    if (!isValidPhoneNumber(telefono)) { setError("El celular debe tener 10 dígitos y empezar con 3 (formato: 321 6549870)"); return; }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("El correo electrónico no es válido"); return; }

    const telefonoNormalizado = formatPhoneNumber(telefono);
    const documentoRepetido = patients.some(p => p.numeroDocumento === numeroDocumento && p.id !== editing?.id);
    if (documentoRepetido) { setError("Ya existe un paciente con este número de documento"); return; }

    if (editing) {
      setPatients(
        patients.map((p) =>
          p.id === editing.id
            ? { ...p, nombre, tipoDocumento, numeroDocumento, telefono: telefonoNormalizado, email }
            : p
        )
      );
    } else {
      const newPatient: Patient = {
        id: `p${Date.now()}`,
        nombre,
        tipoDocumento,
        numeroDocumento,
        telefono: telefonoNormalizado,
        email,
        fechaUltimaCompra: new Date(),
        fechaUltimoControl: new Date(),
        fechaVencimientoFormula: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        productoComprado: "Pendiente de registro",
        asesorAsignado: user.id || "a1",
        estado: "post-venta",
        valorUltimaCompra: 0,
        totalCompras: 1,
        historialContactos: [],
      };
      setPatients([...patients, newPatient]);
    }
    setSuccess(true);
    setTimeout(close, 1500);
  };

  const getTipoDocumentoLabel = (tipo: typeof tipoDocumento) => {
    switch (tipo) {
      case "CC": return "Cédula de Ciudadanía (CC)";
      case "CE": return "Cédula de Extranjería (CE)";
      case "NIT": return "NIT";
      case "Pasaporte": return "Pasaporte";
      default: return "Cédula de Ciudadanía (CC)";
    }
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
        placeholder="Buscar por nombre, documento o teléfono..."
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
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {success && (
                  <MessageBar intent="success">
                    <MessageBarBody>
                      <CheckmarkCircleRegular />{" "}
                      {editing ? "¡Paciente actualizado!" : "¡Paciente registrado!"}
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
                    className={styles.fullWidth}
                  />
                </div>

                <div className={styles.formGrid}>
                  <div>
                    <Label size="small" weight="semibold">
                      Tipo de Documento *
                    </Label>
                    <Dropdown
                      value={getTipoDocumentoLabel(tipoDocumento)}
                      selectedOptions={[tipoDocumento]}
                      onOptionSelect={(_, data) => setTipoDocumento(data.optionValue as any)}
                      className={styles.fullWidth}
                      positioning="below"
                    >
                      <Option value="CC">Cédula de Ciudadanía (CC)</Option>
                      <Option value="CE">Cédula de Extranjería (CE)</Option>
                      <Option value="NIT">NIT</Option>
                      <Option value="Pasaporte">Pasaporte</Option>
                    </Dropdown>
                  </div>
                  <div>
                    <Label size="small" weight="semibold">
                      Número de Documento *
                    </Label>
                    <Input
                      value={numeroDocumento}
                      onChange={(e) => setNumeroDocumento(e.target.value.replace(/\D/g, ''))}
                      placeholder="1234567890"
                      className={styles.fullWidth}
                    />
                  </div>
                </div>

                <div className={styles.formGrid}>
                  <div>
                    <Label size="small" weight="semibold">
                      Celular *
                    </Label>
                    <Input
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                      placeholder="321 6549870"
                      className={styles.fullWidth}
                      onBlur={() => { if (telefono) setTelefono(formatPhoneNumber(telefono)); }}
                    />
                  </div>
                  <div>
                    <Label size="small" weight="semibold">
                      Correo *
                    </Label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@ejemplo.com"
                      className={styles.fullWidth}
                    />
                  </div>
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
                      <p>Documento: {p.tipoDocumento} {p.numeroDocumento}</p>
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