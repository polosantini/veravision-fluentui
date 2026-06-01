import { makeStyles, shorthands, tokens, Card, Button, Badge, Spinner } from "@fluentui/react-components";
import {
  AlertRegular,
  AlertOffRegular,
  WarningRegular,
  CalendarRegular,
  PersonProhibitedRegular,
  ShoppingBagRegular,
  EyeRegular,
  CheckmarkRegular,
  CallRegular,
  ChatRegular,
} from "@fluentui/react-icons";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { useAlertsSync } from "../../hooks/useAlertsSync";
import { type Alert } from "../../data/mock-data";

const typeConfig: Record<
  Alert["tipo"],
  {
    icon: React.ElementType;
    label: string;
    badgeColor: "danger" | "warning" | "important" | "informative";
    iconBgToken: string;
    iconColorToken: string;
  }
> = {
  "formula-vencida": {
    icon: WarningRegular,
    label: "Fórmula Vencida",
    badgeColor: "danger",
    iconBgToken: tokens.colorStatusDangerBackground1,
    iconColorToken: tokens.colorStatusDangerForeground1,
  },
  "control-pendiente": {
    icon: CalendarRegular,
    label: "Control Pendiente",
    badgeColor: "warning",
    iconBgToken: tokens.colorStatusWarningBackground1,
    iconColorToken: tokens.colorStatusWarningForeground1,
  },
  "sin-contacto": {
    icon: PersonProhibitedRegular,
    label: "Sin Contacto",
    badgeColor: "important",
    iconBgToken: tokens.colorPaletteDarkOrangeBackground1,
    iconColorToken: tokens.colorPaletteDarkOrangeForeground1,
  },
  recompra: {
    icon: ShoppingBagRegular,
    label: "Recompra",
    badgeColor: "informative",
    iconBgToken: tokens.colorBrandBackground2,
    iconColorToken: tokens.colorBrandForeground2,
  },
  cumpleanos: {
    icon: AlertRegular,
    label: "Cumpleaños",
    badgeColor: "informative",
    iconBgToken: tokens.colorBrandBackground2,
    iconColorToken: tokens.colorBrandForeground2,
  },
};

const priorityColor = (p: Alert["prioridad"]): "danger" | "warning" | "important" | "informative" => {
  const m = { urgente: "danger", alta: "warning", media: "important", baja: "informative" } as const;
  return m[p];
};

const useStyles = makeStyles({
  container: {
    maxWidth: "850px",
    ...shorthands.margin("0", "auto"),
    display: "flex",
    flexDirection: "column",
    ...shorthands.gap("16px"),
  },
  alertCard: {
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.border("1px", "solid", tokens.colorNeutralStroke2),
    ...shorthands.borderRadius("12px"),
    ...shorthands.padding("16px"),
  },
  unreadCard: {
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.border("1px", "solid", tokens.colorBrandStroke2),
    ...shorthands.borderRadius("12px"),
    ...shorthands.padding("16px"),
    boxShadow: `0 0 12px ${tokens.colorBrandStroke2}`,
  },
  alertRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
  },
  iconContainer: {
    width: "36px",
    height: "36px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  contentContainer: {
    flex: 1,
    minWidth: 0,
  },
  headerLine: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexWrap: "wrap",
    marginBottom: "4px",
  },
  patientName: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
  },
  message: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
    marginTop: "4px",
  },
  footerActions: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginTop: "10px",
  },
  timestamp: {
    fontSize: tokens.fontSizeBase100,
    color: tokens.colorNeutralForeground3,
    flex: 1,
  },
  sectionTitle: {
    fontSize: tokens.fontSizeBase100,
    color: tokens.colorNeutralForeground3,
    fontWeight: tokens.fontWeightSemibold,
    marginBottom: "8px",
  },
  readSection: {
    opacity: 0.6,
  },
  emptyCard: {
    textAlign: "center",
    padding: "60px 20px",
  },
  emptyIcon: {
    width: "40px",
    height: "40px",
    color: tokens.colorNeutralForeground3,
    margin: "0 auto",
  },
  emptyText: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
    marginTop: "12px",
  },
  spinnerContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px",
  },
});

export function AdvisorAlerts() {
  const styles = useStyles();
  const { alerts, loading, markAsRead, markAllAsRead } = useAlertsSync();

  if (loading) {
    return (
      <div className={styles.spinnerContainer}>
        <Spinner label="Cargando alertas..." />
      </div>
    );
  }

  const unread = alerts.filter((a) => !a.leida);
  const read = alerts.filter((a) => a.leida);

  const renderAlert = (alert: Alert, isUnread: boolean) => {
    const cfg = typeConfig[alert.tipo];
    const Icon = cfg.icon;

    return (
      <div key={alert.id} className={isUnread ? styles.unreadCard : styles.alertCard}>
        <div className={styles.alertRow}>
          <div className={styles.iconContainer} style={{ backgroundColor: cfg.iconBgToken, color: cfg.iconColorToken }}>
            <Icon style={{ width: "18px", height: "18px" }} />
          </div>
          <div className={styles.contentContainer}>
            <div className={styles.headerLine}>
              <span className={styles.patientName}>{alert.pacienteNombre}</span>
              {isUnread && (
                <Badge appearance="tint" color={priorityColor(alert.prioridad)} size="small">
                  {alert.prioridad.toUpperCase()}
                </Badge>
              )}
              <Badge appearance="outline" color={cfg.badgeColor} size="small">
                {cfg.label}
              </Badge>
            </div>
            <div className={styles.message}>{alert.mensaje}</div>
            {isUnread && (
              <div className={styles.footerActions}>
                <div className={styles.timestamp}>
                  {formatDistanceToNow(alert.fecha, { addSuffix: true, locale: es })}
                </div>
                <Button size="small" appearance="secondary" icon={<CallRegular />}>
                  Llamar
                </Button>
                <Button size="small" appearance="secondary" icon={<ChatRegular />}>
                  WhatsApp
                </Button>
                <Button
                  size="small"
                  appearance="subtle"
                  icon={<EyeRegular />}
                  onClick={() => markAsRead(alert.id)}
                  title="Marcar como leída"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div className={styles.timestamp}>
          {unread.length} alertas sin leer · {alerts.length} totales
        </div>
        {unread.length > 0 && (
          <Button size="small" appearance="secondary" icon={<CheckmarkRegular />} onClick={markAllAsRead}>
            Marcar todas
          </Button>
        )}
      </div>

      {unread.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {unread.map((a) => renderAlert(a, true))}
        </div>
      )}

      {read.length > 0 && (
        <div>
          <div className={styles.sectionTitle}>ANTERIORES</div>
          <div className={styles.readSection}>{read.map((a) => renderAlert(a, false))}</div>
        </div>
      )}

      {alerts.length === 0 && (
        <Card className={styles.emptyCard}>
          <AlertOffRegular className={styles.emptyIcon} />
          <div className={styles.emptyText}>No hay alertas</div>
        </Card>
      )}
    </div>
  );
}