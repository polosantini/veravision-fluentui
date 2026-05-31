import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import {
  makeStyles,
  shorthands,
  tokens,
  Card,
  Button,
  Badge,
  Textarea,
  Label,
  Dialog,
  DialogSurface,
  DialogBody,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@fluentui/react-components";
import {
  ErrorCircleRegular,
  CheckmarkCircleRegular,
  ClockRegular,
  DismissCircleRegular,
  EyeRegular,
  ChatRegular,
} from "@fluentui/react-icons";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import {
  issues as mockIssues,
  getIssueCategoryLabel,
  getIssueStatusLabel,
  type Issue,
  type IssueStatus,
  type TaskPriority,
} from "../../data/mock-data";

const priorityBadge = (p: TaskPriority): "danger" | "warning" | "important" | "informative" => {
  const m = { urgente: "danger", alta: "warning", media: "important", baja: "informative" } as const;
  return m[p];
};

const statusBadge = (s: IssueStatus): "danger" | "informative" | "success" | "subtle" => {
  const m = { pendiente: "danger", "en-revision": "informative", resuelta: "success", descartada: "subtle" } as const;
  return m[s] as any;
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
    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
    gap: "12px",
  },
  statCard: {
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.border("1px", "solid", tokens.colorNeutralStroke2),
    ...shorthands.borderRadius("12px"),
    ...shorthands.padding("16px"),
    textAlign: "center",
  },
  statValue: {
    fontSize: "24px",
    fontWeight: 700,
  },
  statLabel: {
    fontSize: "12px",
    color: tokens.colorNeutralForeground2,
    fontWeight: 500,
  },
  filterBar: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },
  filterBtn: {
    padding: "8px 16px",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: 500,
    cursor: "pointer",
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground2,
    color: tokens.colorNeutralForeground2,
    transition: "all 0.15s ease",
  },
  filterBtnActive: {
    backgroundColor: tokens.colorBrandBackground,
    color: "white",
    borderColor: tokens.colorBrandStroke1,
  },
  issueCard: {
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.border("1px", "solid", tokens.colorNeutralStroke2),
    ...shorthands.borderRadius("12px"),
    ...shorthands.padding("16px"),
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
  issueHeader: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexWrap: "wrap",
    marginBottom: "6px",
  },
  issueTitle: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
  },
  issueDescription: {
    fontSize: "12px",
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
    fontSize: "11px",
    color: tokens.colorNeutralForeground3,
  },
  noteBox: {
    marginTop: "12px",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid transparent",
  },
  noteTitle: {
    fontSize: "11px",
    fontWeight: 600,
  },
  noteText: {
    fontSize: "12px",
    marginTop: "4px",
  },
  emptyCard: {
    textAlign: "center",
    padding: "32px",
  },
  emptyIcon: {
    width: "32px",
    height: "32px",
    color: tokens.colorNeutralForeground3,
    margin: "0 auto 8px",
  },
  emptyText: {
    fontSize: "13px",
    color: tokens.colorNeutralForeground2,
  },
  actionButtons: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },
  dialogContent: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  taskPreview: {
    padding: "12px",
    backgroundColor: tokens.colorNeutralBackground3,
    borderRadius: "8px",
  },
  previewTitle: {
    fontSize: "13px",
    fontWeight: 600,
    color: tokens.colorNeutralForeground1,
  },
  previewDesc: {
    fontSize: "12px",
    color: tokens.colorNeutralForeground2,
    marginTop: "4px",
  },
  fullWidthTextarea: {
    width: "100%",
    marginTop: "4px",
  },
});

export function ManagerIssues() {
  const styles = useStyles();
  const [searchParams] = useSearchParams();
  const [issues, setIssues] = useLocalStorage<Issue[]>("veravision_issues", mockIssues);
  const [filter, setFilter] = useState<IssueStatus | "todas" | "urgentes">("todas");
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [notas, setNotas] = useState("");
  const [resolucion, setResolucion] = useState("");

  useEffect(() => {
    if (searchParams.get("urgent") === "true") setFilter("urgentes");
  }, [searchParams]);

  const filteredIssues = (() => {
    if (filter === "todas") return issues;
    if (filter === "urgentes") return issues.filter((i) => i.prioridad === "urgente" && i.estado === "pendiente");
    return issues.filter((i) => i.estado === filter);
  })();

  const pendingCount = issues.filter((i) => i.estado === "pendiente").length;
  const urgentCount = issues.filter((i) => i.prioridad === "urgente" && i.estado === "pendiente").length;
  const inReviewCount = issues.filter((i) => i.estado === "en-revision").length;
  const resolvedCount = issues.filter((i) => i.estado === "resuelta").length;

  const handleUpdateStatus = (issueId: string, newStatus: IssueStatus) => {
    setIssues(issues.map((i) => i.id === issueId
      ? { ...i, estado: newStatus, fechaResolucion: newStatus === "resuelta" ? new Date() : i.fechaResolucion }
      : i));
    if (selectedIssue?.id === issueId) setSelectedIssue({ ...selectedIssue, estado: newStatus });
  };

  const handleAddNote = (issueId: string) => {
    if (!notas.trim()) return;
    setIssues(issues.map((i) => i.id === issueId
      ? { ...i, notas, estado: i.estado === "pendiente" ? "en-revision" : i.estado }
      : i));
    setNotas("");
    setSelectedIssue(null);
  };

  const handleResolve = (issueId: string) => {
    if (!resolucion.trim()) return;
    setIssues(issues.map((i) => i.id === issueId
      ? { ...i, resolucion, estado: "resuelta", fechaResolucion: new Date() }
      : i));
    setSelectedIssue(null);
    setResolucion("");
  };

  const getStatusIcon = (estado: Issue["estado"]) => {
    const common = { width: "16px", height: "16px" };
    switch (estado) {
      case "pendiente":
        return <ErrorCircleRegular style={{ ...common, color: tokens.colorStatusDangerForeground1 }} />;
      case "en-revision":
        return <ClockRegular style={{ ...common, color: tokens.colorBrandForeground2 }} />;
      case "resuelta":
        return <CheckmarkCircleRegular style={{ ...common, color: tokens.colorStatusSuccessForeground1 }} />;
      case "descartada":
        return <DismissCircleRegular style={{ ...common, color: tokens.colorNeutralForeground3 }} />;
    }
  };

  const stats = [
    { label: "Pendientes", value: pendingCount, color: tokens.colorStatusDangerForeground1 },
    { label: "Urgentes", value: urgentCount, color: tokens.colorStatusWarningForeground1 },
    { label: "En Revisión", value: inReviewCount, color: tokens.colorBrandForeground2 },
    { label: "Resueltas", value: resolvedCount, color: tokens.colorStatusSuccessForeground1 },
    { label: "Total", value: issues.length, color: tokens.colorBrandForeground2 },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.statsGrid}>
        {stats.map((s) => (
          <div key={s.label} className={styles.statCard}>
            <div className={styles.statValue} style={{ color: s.color }}>{s.value}</div>
            <div className={styles.statLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className={styles.filterBar}>
        {[
          { value: "todas", label: "Todas" },
          { value: "urgentes", label: "Urgentes" },
          { value: "pendiente", label: "Pendientes" },
          { value: "en-revision", label: "En Revisión" },
          { value: "resuelta", label: "Resueltas" },
          { value: "descartada", label: "Descartadas" },
        ].map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value as any)}
            className={`${styles.filterBtn} ${filter === f.value ? styles.filterBtnActive : ""}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {filteredIssues.length === 0 ? (
          <Card className={styles.emptyCard}>
            <ErrorCircleRegular className={styles.emptyIcon} />
            <div className={styles.emptyText}>No hay problemas en esta categoría</div>
          </Card>
        ) : (
          filteredIssues.map((issue) => (
            <div key={issue.id} className={styles.issueCard}>
              <div className={styles.issueContent}>
                <div style={{ marginTop: "2px" }}>{getStatusIcon(issue.estado)}</div>
                <div className={styles.issueDetails}>
                  <div className={styles.issueHeader}>
                    <h3 className={styles.issueTitle}>{issue.titulo}</h3>
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
                      Reportado por {issue.reportadoPorNombre}
                    </span>
                    <span className={styles.metaText}>
                      {format(issue.fechaReporte, "d 'de' MMM", { locale: es })}
                    </span>
                  </div>

                  {issue.notas && (
                    <div
                      className={styles.noteBox}
                      style={{
                        backgroundColor: tokens.colorBrandBackground2,
                        borderColor: tokens.colorBrandStroke2,
                      }}
                    >
                      <div className={styles.noteTitle} style={{ color: tokens.colorBrandForeground2 }}>Nota:</div>
                      <div className={styles.noteText} style={{ color: tokens.colorBrandForeground2 }}>{issue.notas}</div>
                    </div>
                  )}

                  {issue.resolucion && (
                    <div
                      className={styles.noteBox}
                      style={{
                        backgroundColor: tokens.colorStatusSuccessBackground1,
                        borderColor: tokens.colorStatusSuccessBorder1,
                      }}
                    >
                      <div className={styles.noteTitle} style={{ color: tokens.colorStatusSuccessForeground1 }}>Resolución:</div>
                      <div className={styles.noteText} style={{ color: tokens.colorStatusSuccessForeground1 }}>{issue.resolucion}</div>
                      {issue.fechaResolucion && (
                        <div className={styles.metaText} style={{ marginTop: "4px", color: tokens.colorStatusSuccessForeground1, opacity: 0.8 }}>
                          Resuelta {format(issue.fechaResolucion, "d 'de' MMM", { locale: es })}
                        </div>
                      )}
                    </div>
                  )}

                  {issue.estado !== "resuelta" && issue.estado !== "descartada" && (
                    <div className={styles.actionButtons}>
                      {issue.estado === "pendiente" && (
                        <Button
                          size="small"
                          appearance="secondary"
                          icon={<EyeRegular />}
                          onClick={() => handleUpdateStatus(issue.id, "en-revision")}
                        >
                          Revisar
                        </Button>
                      )}
                      <Button
                        size="small"
                        appearance="primary"
                        icon={<ChatRegular />}
                        onClick={() => setSelectedIssue(issue)}
                      >
                        {issue.estado === "en-revision" ? "Resolver" : "Agregar Nota"}
                      </Button>
                      <Button
                        size="small"
                        appearance="subtle"
                        icon={<DismissCircleRegular />}
                        onClick={() => handleUpdateStatus(issue.id, "descartada")}
                      >
                        Descartar
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <Dialog open={!!selectedIssue} onOpenChange={(_, d) => { if (!d.open) { setSelectedIssue(null); setNotas(""); setResolucion(""); } }}>
        <DialogSurface>
          <DialogBody>
            <DialogTitle>{selectedIssue?.estado === "en-revision" ? "Resolver Problema" : "Agregar Nota"}</DialogTitle>
            <DialogContent>
              {selectedIssue && (
                <div className={styles.dialogContent}>
                  <div className={styles.taskPreview}>
                    <div className={styles.previewTitle}>{selectedIssue.titulo}</div>
                    <div className={styles.previewDesc}>{selectedIssue.descripcion}</div>
                  </div>

                  {selectedIssue.estado === "en-revision" ? (
                    <div>
                      <Label size="small" weight="semibold">Descripción de la resolución</Label>
                      <Textarea
                        value={resolucion}
                        onChange={(e) => setResolucion(e.target.value)}
                        placeholder="Describe cómo se resolvió el problema..."
                        rows={4}
                        className={styles.fullWidthTextarea}
                      />
                    </div>
                  ) : (
                    <div>
                      <Label size="small" weight="semibold">Nota para el equipo</Label>
                      <Textarea
                        value={notas}
                        onChange={(e) => setNotas(e.target.value)}
                        placeholder="Agrega una nota sobre el estado del problema..."
                        rows={3}
                        className={styles.fullWidthTextarea}
                      />
                    </div>
                  )}
                </div>
              )}
            </DialogContent>
            <DialogActions>
              <Button appearance="secondary" onClick={() => { setSelectedIssue(null); setNotas(""); setResolucion(""); }}>Cancelar</Button>
              {selectedIssue?.estado === "en-revision" ? (
                <Button appearance="primary" disabled={!resolucion.trim()} onClick={() => selectedIssue && handleResolve(selectedIssue.id)}>
                  Marcar como Resuelta
                </Button>
              ) : (
                <Button appearance="primary" disabled={!notas.trim()} onClick={() => selectedIssue && handleAddNote(selectedIssue.id)}>
                  Guardar Nota
                </Button>
              )}
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </div>
  );
}