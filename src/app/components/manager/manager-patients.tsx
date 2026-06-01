import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import {
  makeStyles,
  shorthands,
  tokens,
  Card,
  Button,
  Badge,
  Input,
  Avatar,
  Dialog,
  DialogSurface,
  DialogBody,
  DialogTitle,
  DialogContent,
  DialogActions,
  Dropdown,
  Option,
  Label,
  MessageBar,
  MessageBarBody,
} from "@fluentui/react-components";
import {
  SearchRegular,
  ChevronDownRegular,
  ChevronUpRegular,
  CalendarRegular,
  PersonRegular,
  CallRegular,
  DocumentRegular,
  WarningRegular,
  DeleteRegular,
  CheckmarkCircleRegular,
  ErrorCircleRegular,
} from "@fluentui/react-icons";
import { format, differenceInDays } from "date-fns";
import { es } from "date-fns/locale";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import {
  patients as mockPatients,
  advisors,
  getStatusLabel,
  type PatientStatus,
  type Patient,
} from "../../data/mock-data";
import { formatPhoneNumber, isValidPhoneNumber, isValidDocumentNumber } from "../../utils/format";

const statusFilters: { value: PatientStatus | "todos" | "en-riesgo"; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "en-riesgo", label: "En Riesgo" },
  { value: "post-venta", label: "Post-Venta" },
  { value: "seguimiento-3m", label: "3 Meses" },
  { value: "control-6m", label: "6 Meses" },
  { value: "renovacion-1a", label: "Renovación" },
  { value: "inactivo", label: "Inactivos" },
];

const statusBadgeColor = (s: PatientStatus): "success" | "important" | "warning" | "danger" | "informative" => {
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
    maxWidth: "1200px",
    ...shorthands.margin("0", "auto"),
    display: "flex",
    flexDirection: "column",
    ...shorthands.gap("16px"),
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))",
    gap: "8px",
  },
  statCard: {
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.border("1px", "solid", tokens.colorNeutralStroke2),
    ...shorthands.borderRadius("4px"),
    ...shorthands.padding("12px"),
    textAlign: "center",
    boxShadow: tokens.shadow2,
  },
  statValue: {
    fontSize: "18px",
    color: tokens.colorNeutralForeground1,
    fontWeight: 700,
  },
  statLabel: {
    fontSize: "10px",
    color: tokens.colorNeutralForeground2,
    fontWeight: 500,
  },
  filterBar: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    minWidth: "240px",
  },
  filterButtons: {
    display: "flex",
    gap: "6px",
    flexWrap: "wrap",
  },
  patientCountBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  patientCountText: {
    fontSize: "12px",
    color: tokens.colorNeutralForeground2,
  },
  portfolioValue: {
    fontSize: "11px",
    color: tokens.colorNeutralForeground2,
  },
  portfolioValueHighlight: {
    color: tokens.colorNeutralForeground1,
    fontWeight: 600,
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
  patientRow: {
    display: "flex",
    alignItems: "center",
    ...shorthands.gap("12px"),
    ...shorthands.padding("12px", "16px"),
    cursor: "pointer",
  },
  patientInfo: {
    flex: 1,
    minWidth: 0,
  },
  patientNameRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexWrap: "wrap",
  },
  patientName: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    lineHeight: tokens.lineHeightBase300,
  },
  patientDetails: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
    lineHeight: tokens.lineHeightBase200,
    marginTop: "2px",
  },
  patientValue: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    textAlign: "right",
    whiteSpace: "nowrap",
  },
  patientMeta: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
    textAlign: "right",
    whiteSpace: "nowrap",
    marginTop: "2px",
  },
  expandedContent: {
    padding: "12px 16px 16px",
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  expandedActions: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: "12px",
  },
  expandedGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
  },
  dataSection: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    fontSize: "12px",
    color: tokens.colorNeutralForeground2,
  },
  sectionLabel: {
    fontSize: "11px",
    color: tokens.colorNeutralForeground3,
    fontWeight: 600,
  },
  contactHistoryEmpty: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "11px",
    color: tokens.colorStatusWarningForeground1,
    backgroundColor: tokens.colorStatusWarningBackground1,
    padding: "8px",
    borderRadius: "8px",
  },
  contactHistoryItem: {
    backgroundColor: tokens.colorNeutralBackground3,
    padding: "8px",
    borderRadius: "8px",
    fontSize: "11px",
  },
  contactHeader: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexWrap: "wrap",
  },
  deleteDialogIcon: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    backgroundColor: tokens.colorStatusDangerBackground1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  deleteDialogTitle: {
    fontSize: "15px",
    fontWeight: 600,
  },
  deleteDialogSub: {
    fontSize: "12px",
    color: tokens.colorNeutralForeground2,
    fontWeight: 400,
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
  },
  fullWidth: {
    width: "100%",
    marginTop: "4px",
  },
});

export function ManagerPatients() {
  const styles = useStyles();
  const [searchParams] = useSearchParams();
  const [patients, setPatients] = useLocalStorage<Patient[]>("veravision_patients", mockPatients);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<PatientStatus | "todos" | "en-riesgo">("todos");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [editing, setEditing] = useState<Patient | null>(null);
  const [editNombre, setEditNombre] = useState("");
  const [editTipoDocumento, setEditTipoDocumento] = useState<"CC" | "CE" | "NIT" | "Pasaporte">("CC");
  const [editNumeroDocumento, setEditNumeroDocumento] = useState("");
  const [editTelefono, setEditTelefono] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editError, setEditError] = useState("");
  const [editSuccess, setEditSuccess] = useState(false);

  useEffect(() => {
    const filter = searchParams.get("filter");
    if (filter === "at-risk") setStatusFilter("en-riesgo");
  }, [searchParams]);

  const filtered = patients.filter((p) => {
    const matchSearch =
      p.nombre.toLowerCase().includes(search.toLowerCase()) ||
      p.numeroDocumento.includes(search) ||
      p.telefono.includes(search);
    let matchStatus = true;
    if (statusFilter === "todos") matchStatus = true;
    else if (statusFilter === "en-riesgo") {
      const today = new Date();
      const days = Math.floor((p.fechaVencimientoFormula.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      matchStatus = days <= 90;
    } else matchStatus = p.estado === statusFilter;
    return matchSearch && matchStatus;
  });

  const getAdvisorName = (id: string) => advisors.find((a) => a.id === id)?.nombre || "Sin asignar";

  const getFormulaStatus = (date: Date) => {
    const days = differenceInDays(date, new Date());
    if (days < 0) return { label: `Venció hace ${Math.abs(days)}d`, color: tokens.colorStatusDangerForeground1 };
    if (days <= 30) return { label: `Vence ${days}d`, color: tokens.colorStatusDangerForeground1 };
    if (days <= 90) return { label: `Vence ${days}d`, color: tokens.colorStatusWarningForeground1 };
    return { label: `Vence ${days}d`, color: tokens.colorNeutralForeground3 };
  };

  const statsByStatus = statusFilters.slice(1).map((s) => ({
    ...s,
    count: s.value === "en-riesgo"
      ? patients.filter((p) => differenceInDays(p.fechaVencimientoFormula, new Date()) <= 90).length
      : patients.filter((p) => p.estado === s.value).length,
  }));

  const totalValue = patients.reduce((a, b) => a + b.valorUltimaCompra, 0);

  const handleDelete = (id: string) => {
    setPatients(patients.filter((p) => p.id !== id));
    setDeleteConfirm(null);
    setExpandedId(null);
  };

  const openEdit = (p: Patient) => {
    setEditing(p);
    setEditNombre(p.nombre);
    setEditTipoDocumento(p.tipoDocumento);
    setEditNumeroDocumento(p.numeroDocumento);
    setEditTelefono(p.telefono);
    setEditEmail(p.email);
    setEditError("");
    setEditSuccess(false);
  };

  const closeEdit = () => {
    setEditing(null);
    setEditError("");
    setEditSuccess(false);
  };

  const saveEdit = () => {
    setEditError("");
    if (!editNombre.trim()) { setEditError("El nombre es obligatorio"); return; }
    if (!editNumeroDocumento.trim()) { setEditError("El número de documento es obligatorio"); return; }
    if (!isValidDocumentNumber(editNumeroDocumento)) { setEditError("El número de documento debe contener solo dígitos (máx 15)"); return; }
    if (!editTelefono.trim()) { setEditError("El celular es obligatorio"); return; }
    if (!isValidPhoneNumber(editTelefono)) { setEditError("El celular debe tener 10 dígitos y empezar con 3 (formato: 321 6549870)"); return; }
    if (!editEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editEmail)) { setEditError("El correo electrónico no es válido"); return; }

    const telefonoNormalizado = formatPhoneNumber(editTelefono);
    const documentoRepetido = patients.some(p => p.numeroDocumento === editNumeroDocumento && p.id !== editing?.id);
    if (documentoRepetido) { setEditError("Ya existe un paciente con este número de documento"); return; }

    setPatients(patients.map(p =>
      p.id === editing?.id
        ? { ...p, nombre: editNombre, tipoDocumento: editTipoDocumento, numeroDocumento: editNumeroDocumento, telefono: telefonoNormalizado, email: editEmail }
        : p
    ));
    setEditSuccess(true);
    setTimeout(closeEdit, 1500);
  };

  const patientToDelete = deleteConfirm ? patients.find((p) => p.id === deleteConfirm) : null;

  return (
    <div className={styles.container}>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{patients.length}</div>
          <div className={styles.statLabel}>Total</div>
        </div>
        {statsByStatus.map((s) => (
          <div key={s.value} className={styles.statCard}>
            <div className={styles.statValue}>{s.count}</div>
            <div className={styles.statLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className={styles.filterBar}>
        <div className={styles.searchInput}>
          <Input
            contentBefore={<SearchRegular />}
            placeholder="Buscar por nombre, documento o teléfono..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: "100%" }}
          />
        </div>
        <div className={styles.filterButtons}>
          {statusFilters.map((f) => (
            <Button
              key={f.value}
              appearance={statusFilter === f.value ? "primary" : "secondary"}
              size="small"
              onClick={() => setStatusFilter(f.value)}
              style={{
                backgroundColor: statusFilter === f.value ? tokens.colorStatusSuccessBackground1 : undefined,
                borderColor: statusFilter === f.value ? tokens.colorStatusSuccessBorder1 : undefined,
              }}
            >
              {f.label}
            </Button>
          ))}
        </div>
      </div>

      <div className={styles.patientCountBar}>
        <div className={styles.patientCountText}>{filtered.length} pacientes</div>
        <div className={styles.portfolioValue}>
          Valor total cartera:{" "}
          <span className={styles.portfolioValueHighlight}>
            ${totalValue.toLocaleString()}
          </span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {filtered.map((p) => {
          const isExpanded = expandedId === p.id;
          const formula = getFormulaStatus(p.fechaVencimientoFormula);
          return (
            <div key={p.id} className={styles.patientCard}>
              <div className={styles.patientRow} onClick={() => setExpandedId(isExpanded ? null : p.id)}>
                <Avatar name={p.nombre} size={40} color="brand" />
                <div className={styles.patientInfo}>
                  <div className={styles.patientNameRow}>
                    <span className={styles.patientName}>{p.nombre}</span>
                    <Badge appearance="tint" color={statusBadgeColor(p.estado)} size="small">
                      {getStatusLabel(p.estado)}
                    </Badge>
                  </div>
                  <div className={styles.patientDetails}>
                    {p.tipoDocumento}: {p.numeroDocumento} · {getAdvisorName(p.asesorAsignado)} ·{" "}
                    <span style={{ color: formula.color }}>{formula.label}</span>
                  </div>
                </div>
                <div>
                  <div className={styles.patientValue}>${p.valorUltimaCompra.toLocaleString()}</div>
                  <div className={styles.patientMeta}>{p.totalCompras} compras</div>
                </div>
                {isExpanded ? <ChevronUpRegular /> : <ChevronDownRegular />}
              </div>

              {isExpanded && (
                <div className={styles.expandedContent}>
                  <div className={styles.expandedActions}>
                    <Button
                      size="small"
                      appearance="subtle"
                      icon={<DeleteRegular />}
                      onClick={() => setDeleteConfirm(p.id)}
                      style={{ color: tokens.colorStatusDangerForeground1 }}
                    >
                      Eliminar Paciente
                    </Button>
                    <Button
                      size="small"
                      appearance="primary"
                      icon={<PersonRegular />}
                      onClick={() => openEdit(p)}
                      style={{ marginLeft: "8px" }}
                    >
                      Editar Datos
                    </Button>
                  </div>
                  <div className={styles.expandedGrid}>
                    <div className={styles.dataSection}>
                      <div className={styles.sectionLabel}>DATOS</div>
                      <p><PersonRegular style={{ width: "12px", height: "12px", marginRight: "4px", verticalAlign: "middle" }} />
                        Documento: {p.tipoDocumento} {p.numeroDocumento}
                      </p>
                      <p><CallRegular style={{ width: "12px", height: "12px", marginRight: "4px", verticalAlign: "middle" }} />
                        {p.telefono}
                      </p>
                      <p><CalendarRegular style={{ width: "12px", height: "12px", marginRight: "4px", verticalAlign: "middle" }} />
                        Última compra: {format(p.fechaUltimaCompra, "dd MMM yyyy", { locale: es })}
                      </p>
                      <p style={{ color: formula.color }}>
                        <DocumentRegular style={{ width: "12px", height: "12px", marginRight: "4px", verticalAlign: "middle" }} />
                        {formula.label}
                      </p>
                    </div>
                    <div className={styles.dataSection}>
                      <div className={styles.sectionLabel}>VALOR DEL CLIENTE</div>
                      <p>Última compra: <span style={{ color: tokens.colorNeutralForeground1, fontWeight: 600 }}>${p.valorUltimaCompra.toLocaleString()}</span></p>
                      <p>Total compras: <span style={{ color: tokens.colorNeutralForeground1, fontWeight: 600 }}>{p.totalCompras}</span></p>
                      <p>Asesor: <span style={{ color: tokens.colorNeutralForeground1, fontWeight: 500 }}>{getAdvisorName(p.asesorAsignado)}</span></p>
                    </div>
                    <div>
                      <div className={styles.sectionLabel}>HISTORIAL ({p.historialContactos.length})</div>
                      {p.historialContactos.length === 0 ? (
                        <div className={styles.contactHistoryEmpty}>
                          <WarningRegular style={{ width: "12px", height: "12px" }} />
                          Sin contactos registrados
                        </div>
                      ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                          {p.historialContactos.map((c, i) => (
                            <div key={i} className={styles.contactHistoryItem}>
                              <div className={styles.contactHeader}>
                                <span style={{ color: tokens.colorNeutralForeground2 }}>{format(c.fecha, "dd/MM/yy")}</span>
                                <span style={{ color: tokens.colorNeutralForeground2 }}>{c.tipo} — {c.asesor}</span>
                                <Badge appearance="tint" size="small" color={c.resultado === "exitoso" ? "success" : c.resultado === "no-contesta" ? "danger" : "warning"}>{c.resultado}</Badge>
                              </div>
                              {c.notas && <p style={{ color: tokens.colorNeutralForeground2, marginTop: "4px" }}>{c.notas}</p>}
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

      {/* Diálogo de edición */}
      <Dialog open={!!editing} onOpenChange={(_, d) => !d.open && closeEdit()}>
        <DialogSurface>
          <DialogBody>
            <DialogTitle>Editar Paciente</DialogTitle>
            <DialogContent>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {editSuccess && (
                  <MessageBar intent="success">
                    <MessageBarBody>
                      <CheckmarkCircleRegular /> ¡Paciente actualizado!
                    </MessageBarBody>
                  </MessageBar>
                )}
                {editError && (
                  <MessageBar intent="error">
                    <MessageBarBody>
                      <ErrorCircleRegular /> {editError}
                    </MessageBarBody>
                  </MessageBar>
                )}

                <div>
                  <Label size="small" weight="semibold">Nombre Completo *</Label>
                  <Input value={editNombre} onChange={(e) => setEditNombre(e.target.value)} className={styles.fullWidth} />
                </div>

                <div className={styles.formGrid}>
                  <div>
                    <Label size="small" weight="semibold">Tipo de Documento *</Label>
                    <Dropdown
                      value={editTipoDocumento === "CC" ? "Cédula de Ciudadanía (CC)" : editTipoDocumento === "CE" ? "Cédula de Extranjería (CE)" : editTipoDocumento === "NIT" ? "NIT" : "Pasaporte"}
                      onOptionSelect={(_, data) => setEditTipoDocumento(data.optionValue as any)}
                      className={styles.fullWidth}
                    >
                      <Option value="CC">Cédula de Ciudadanía (CC)</Option>
                      <Option value="CE">Cédula de Extranjería (CE)</Option>
                      <Option value="NIT">NIT</Option>
                      <Option value="Pasaporte">Pasaporte</Option>
                    </Dropdown>
                  </div>
                  <div>
                    <Label size="small" weight="semibold">Número de Documento *</Label>
                    <Input
                      value={editNumeroDocumento}
                      onChange={(e) => setEditNumeroDocumento(e.target.value.replace(/\D/g, ''))}
                      placeholder="1234567890"
                      className={styles.fullWidth}
                    />
                  </div>
                </div>

                <div className={styles.formGrid}>
                  <div>
                    <Label size="small" weight="semibold">Celular *</Label>
                    <Input
                      value={editTelefono}
                      onChange={(e) => setEditTelefono(e.target.value)}
                      placeholder="321 6549870"
                      className={styles.fullWidth}
                      onBlur={() => { if (editTelefono) setEditTelefono(formatPhoneNumber(editTelefono)); }}
                    />
                  </div>
                  <div>
                    <Label size="small" weight="semibold">Correo *</Label>
                    <Input
                      type="email"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      placeholder="email@ejemplo.com"
                      className={styles.fullWidth}
                    />
                  </div>
                </div>
              </div>
            </DialogContent>
            <DialogActions>
              <Button appearance="secondary" onClick={closeEdit}>Cancelar</Button>
              <Button appearance="primary" onClick={saveEdit}>Guardar Cambios</Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>

      {/* Diálogo de confirmación de eliminación */}
      <Dialog open={!!deleteConfirm} onOpenChange={(_, d) => !d.open && setDeleteConfirm(null)}>
        <DialogSurface>
          <DialogBody>
            <DialogTitle>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div className={styles.deleteDialogIcon}>
                  <WarningRegular style={{ width: "18px", height: "18px", color: tokens.colorStatusDangerForeground1 }} />
                </div>
                <div>
                  <div className={styles.deleteDialogTitle}>Confirmar Eliminación</div>
                  <div className={styles.deleteDialogSub}>Esta acción no se puede deshacer</div>
                </div>
              </div>
            </DialogTitle>
            <DialogContent>
              <p style={{ fontSize: "13px", color: tokens.colorNeutralForeground2 }}>
                ¿Estás seguro de que deseas eliminar a{" "}
                <span style={{ color: tokens.colorNeutralForeground1, fontWeight: 600 }}>{patientToDelete?.nombre}</span>?
                Se eliminarán todos sus datos y su historial.
              </p>
            </DialogContent>
            <DialogActions>
              <Button appearance="secondary" onClick={() => setDeleteConfirm(null)}>Cancelar</Button>
              <Button
                appearance="primary"
                style={{ backgroundColor: tokens.colorStatusDangerBackground1 }}
                onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
              >
                Sí, Eliminar
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </div>
  );
}