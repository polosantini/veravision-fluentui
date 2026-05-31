import { useState } from "react";
import {
  makeStyles,
  shorthands,
  tokens,
  Card,
  Button,
  Badge,
  Input,
  Textarea,
  Label,
  Dropdown,
  Option,
} from "@fluentui/react-components";
import {
  ErrorCircleRegular,
  AddRegular,
  DismissRegular,
  CheckmarkCircleRegular,
  ClockRegular,
  WarningRegular,
} from "@fluentui/react-icons";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import {
  issues as mockIssues,
  getIssueCategoryLabel,
  getIssueStatusLabel,
  type Issue,
  type IssueCategory,
  type TaskPriority,
} from "../../data/mock-data";

const ADVISOR_ID = "a1";
const ADVISOR_NAME = "Carlos Méndez";

const priorityBadge = (p: TaskPriority): "danger" | "warning" | "important" | "informative" => {
  const m = { urgente: "danger", alta: "warning", media: "important", baja: "informative" } as const;
  return m[p];
};

const statusBadge = (s: Issue["estado"]): "danger" | "informative" | "success" | "subtle" => {
  const m = { pendiente: "danger", "en-revision": "informative", resuelta: "success", descartada: "subtle" } as const;
  return m[s] as any;
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
  card: {
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.border("1px", "solid", tokens.colorNeutralStroke2),
    ...shorthands.borderRadius("12px"),
    ...shorthands.padding("20px"),
  },
  issueCard: {
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.border("1px", "solid", tokens.colorNeutralStroke2),
    ...shorthands.borderRadius("12px"),
    ...shorthands.padding("16px"),
  },
  formContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  formRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
  },
  buttonGroup: {
    display: "flex",
    gap: "8px",
    marginTop: "4px",
  },
  issueHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "16px",
  },
  issueTitle: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
  },
  issueContent: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
  },
  issueDetails: {
    flex: 1,
    minWidth: 0,
  },
  issueTopLine: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexWrap: "wrap",
    marginBottom: "6px",
  },
  issueTitleText: {
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
  },
  issueDescription: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
    marginBottom: "8px",
  },
  issueMeta: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexWrap: "wrap",
    marginBottom: "12px",
  },
  metaText: {
    fontSize: tokens.fontSizeBase100,
    color: tokens.colorNeutralForeground3,
  },
  noteBox: {
    marginTop: "12px",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid transparent",
  },
  noteTitle: {
    fontSize: tokens.fontSizeBase100,
    fontWeight: tokens.fontWeightSemibold,
  },
  noteText: {
    fontSize: tokens.fontSizeBase200,
    marginTop: "4px",
  },
  emptyCard: {
    textAlign: "center",
    padding: "40px 20px",
  },
  emptyIcon: {
    width: "32px",
    height: "32px",
    color: tokens.colorNeutralForeground3,
    margin: "0 auto 8px",
  },
  emptyText: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
  },
  actionButtons: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },
});

export function AdvisorIssues() {
  const styles = useStyles();
  const [issues, setIssues] = useLocalStorage<Issue[]>("veravision_issues", mockIssues);
  const [showForm, setShowForm] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoria, setCategoria] = useState<IssueCategory>("otro");
  const [prioridad, setPrioridad] = useState<TaskPriority>("media");

  const myIssues = issues.filter((i) => i.reportadoPor === ADVISOR_ID);

  const handleSubmit = () => {
    if (!titulo.trim() || !descripcion.trim()) return;
    const newIssue: Issue = {
      id: `i${Date.now()}`,
      titulo,
      descripcion,
      categoria,
      prioridad,
      estado: "pendiente",
      reportadoPor: ADVISOR_ID,
      reportadoPorNombre: ADVISOR_NAME,
      fechaReporte: new Date(),
    };
    setIssues([newIssue, ...issues]);
    setTitulo("");
    setDescripcion("");
    setCategoria("otro");
    setPrioridad("media");
    setShowForm(false);
  };

  const getStatusIcon = (estado: Issue["estado"]) => {
    const common = { width: "18px", height: "18px" };
    switch (estado) {
      case "pendiente":
        return <ClockRegular style={{ ...common, color: tokens.colorStatusDangerForeground1 }} />;
      case "en-revision":
        return <ClockRegular style={{ ...common, color: tokens.colorBrandForeground2 }} />;
      case "resuelta":
        return <CheckmarkCircleRegular style={{ ...common, color: tokens.colorStatusSuccessForeground1 }} />;
      case "descartada":
        return <DismissRegular style={{ ...common, color: tokens.colorNeutralForeground3 }} />;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <h2 className={styles.issueTitle}>Reportar Problemas</h2>
        <Button appearance="primary" icon={<AddRegular />} onClick={() => setShowForm(true)}>
          Reportar Problema
        </Button>
      </div>

      {showForm && (
        <Card className={styles.card}>
          <div className={styles.issueHeader}>
            <h3 className={styles.issueTitle}>Nuevo Reporte</h3>
            <Button size="small" appearance="subtle" icon={<DismissRegular />} onClick={() => setShowForm(false)} />
          </div>

          <div className={styles.formContainer}>
            <div>
              <Label size="small" weight="semibold">
                Título
              </Label>
              <Input
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ej: Sistema Sofix no sincroniza"
                style={{ width: "100%", marginTop: "4px" }}
              />
            </div>
            <div>
              <Label size="small" weight="semibold">
                Descripción
              </Label>
              <Textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Describe el problema en detalle..."
                rows={4}
                style={{ width: "100%", marginTop: "4px" }}
              />
            </div>
            <div className={styles.formRow}>
              <div>
                <Label size="small" weight="semibold">
                  Categoría
                </Label>
                <Dropdown
                  value={getIssueCategoryLabel(categoria)}
                  selectedOptions={[categoria]}
                  onOptionSelect={(_, d) => setCategoria(d.optionValue as IssueCategory)}
                  style={{ width: "100%", marginTop: "4px" }}
                >
                  <Option value="tecnico">Técnico</Option>
                  <Option value="paciente">Paciente</Option>
                  <Option value="proceso">Proceso</Option>
                  <Option value="sistema">Sistema</Option>
                  <Option value="otro">Otro</Option>
                </Dropdown>
              </div>
              <div>
                <Label size="small" weight="semibold">
                  Prioridad
                </Label>
                <Dropdown
                  value={prioridad.charAt(0).toUpperCase() + prioridad.slice(1)}
                  selectedOptions={[prioridad]}
                  onOptionSelect={(_, d) => setPrioridad(d.optionValue as TaskPriority)}
                  style={{ width: "100%", marginTop: "4px" }}
                >
                  <Option value="baja">Baja</Option>
                  <Option value="media">Media</Option>
                  <Option value="alta">Alta</Option>
                  <Option value="urgente">Urgente</Option>
                </Dropdown>
              </div>
            </div>
            <div className={styles.buttonGroup}>
              <Button
                appearance="primary"
                onClick={handleSubmit}
                disabled={!titulo.trim() || !descripcion.trim()}
                style={{ flex: 1 }}
              >
                Enviar Reporte
              </Button>
              <Button appearance="secondary" onClick={() => setShowForm(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        </Card>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {myIssues.length === 0 ? (
          <Card className={styles.emptyCard}>
            <ErrorCircleRegular className={styles.emptyIcon} />
            <div className={styles.emptyText}>No has reportado ningún problema aún</div>
          </Card>
        ) : (
          myIssues.map((issue) => (
            <div key={issue.id} className={styles.issueCard}>
              <div className={styles.issueContent}>
                <div style={{ marginTop: "2px" }}>{getStatusIcon(issue.estado)}</div>
                <div className={styles.issueDetails}>
                  <div className={styles.issueTopLine}>
                    <h3 className={styles.issueTitleText}>{issue.titulo}</h3>
                    <Badge appearance="tint" color={statusBadge(issue.estado)} size="small">
                      {getIssueStatusLabel(issue.estado)}
                    </Badge>
                  </div>
                  <div className={styles.issueDescription}>{issue.descripcion}</div>
                  <div className={styles.issueMeta}>
                    <Badge appearance="outline" size="small">
                      {getIssueCategoryLabel(issue.categoria)}
                    </Badge>
                    <Badge appearance="tint" color={priorityBadge(issue.prioridad)} size="small">
                      {issue.prioridad.toUpperCase()}
                    </Badge>
                    <span className={styles.metaText}>
                      Reportado {format(issue.fechaReporte, "d 'de' MMM", { locale: es })}
                    </span>
                  </div>

                  {issue.estado === "resuelta" && issue.resolucion && (
                    <div
                      className={styles.noteBox}
                      style={{
                        backgroundColor: tokens.colorStatusSuccessBackground1,
                        borderColor: tokens.colorStatusSuccessBorder1,
                      }}
                    >
                      <div className={styles.noteTitle} style={{ color: tokens.colorStatusSuccessForeground1 }}>
                        Resolución:
                      </div>
                      <div className={styles.noteText} style={{ color: tokens.colorStatusSuccessForeground1 }}>
                        {issue.resolucion}
                      </div>
                    </div>
                  )}

                  {issue.estado === "en-revision" && issue.notas && (
                    <div
                      className={styles.noteBox}
                      style={{
                        backgroundColor: tokens.colorBrandBackground2,
                        borderColor: tokens.colorBrandStroke2,
                      }}
                    >
                      <div className={styles.noteTitle} style={{ color: tokens.colorBrandForeground2 }}>
                        Nota de gerencia:
                      </div>
                      <div className={styles.noteText} style={{ color: tokens.colorBrandForeground2 }}>
                        {issue.notas}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}