import { useState } from "react";
import {
  makeStyles,
  shorthands,
  tokens,
  Card,
  Button,
  Switch,
  Input,
  Label,
} from "@fluentui/react-components";
import {
  SaveRegular,
  ArrowResetRegular,
  CallRegular,
  ChatRegular,
  PeopleRegular,
  CalendarLtrRegular,
  AlertRegular,
  FlashRegular,
} from "@fluentui/react-icons";

interface LifecycleRule {
  id: string;
  label: string;
  description: string;
  triggerDays: number;
  channel: "llamada" | "whatsapp" | "ambos";
  maxIntentos: number;
  enabled: boolean;
}

const defaultRules: LifecycleRule[] = [
  { id: "post-venta", label: "Post-Venta", description: "Verificar adaptación del producto", triggerDays: 5, channel: "llamada", maxIntentos: 2, enabled: true },
  { id: "control-3m", label: "Control 3 Meses", description: "Seguimiento de satisfacción", triggerDays: 90, channel: "whatsapp", maxIntentos: 3, enabled: true },
  { id: "control-6m", label: "Control 6 Meses", description: "Agendar revisión visual", triggerDays: 180, channel: "llamada", maxIntentos: 3, enabled: true },
  { id: "renovacion", label: "Renovación Anual", description: "Renovar fórmula y promover recompra", triggerDays: 330, channel: "llamada", maxIntentos: 4, enabled: true },
  { id: "formula-alerta", label: "Alerta Fórmula (30d)", description: "Notificar fórmula próxima a vencer", triggerDays: 335, channel: "llamada", maxIntentos: 2, enabled: true },
  { id: "inactividad", label: "Rescate Inactivos", description: "Contactar pacientes sin actividad > 12 meses", triggerDays: 365, channel: "llamada", maxIntentos: 3, enabled: true },
];

interface AlertConfig { label: string; description: string; enabled: boolean; }

const defaultAlertConfigs: AlertConfig[] = [
  { label: "Fórmula próxima a vencer", description: "Alerta cuando faltan 30 días para vencimiento", enabled: true },
  { label: "Fórmula vencida", description: "Alerta cuando la fórmula ya venció", enabled: true },
  { label: "Sin contacto > 90 días", description: "Alerta de paciente sin gestión reciente", enabled: true },
  { label: "Tarea vencida sin completar", description: "Escala a gerencia si un asesor no completa", enabled: true },
  { label: "Baja tasa de contacto", description: "Alerta si un asesor baja del 60% de tasa de contacto", enabled: true },
];

const useStyles = makeStyles({
  container: {
    maxWidth: "900px",
    ...shorthands.margin("0", "auto"),
    display: "flex",
    flexDirection: "column",
    ...shorthands.gap("20px"),
  },
  infoCard: {
    background: `linear-gradient(135deg, ${tokens.colorBrandBackground2}, ${tokens.colorBrandBackground})`,
    border: `1px solid ${tokens.colorBrandStroke1}`,
    borderRadius: "12px",
    padding: "16px",
  },
  infoContent: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
  },
  infoIcon: {
    width: "20px",
    height: "20px",
    color: tokens.colorBrandForeground2,
    flexShrink: 0,
    marginTop: "2px",
  },
  infoTitle: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground1,
    fontWeight: tokens.fontWeightSemibold,
  },
  infoDescription: {
    fontSize: tokens.fontSizeBase100,
    color: tokens.colorNeutralForeground2,
    marginTop: "2px",
  },
  card: {
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.border("1px", "solid", tokens.colorNeutralStroke2),
    ...shorthands.borderRadius("12px"),
    ...shorthands.overflow("hidden"),
  },
  cardHeader: {
    ...shorthands.padding("20px"),
    ...shorthands.borderBottom("1px", "solid", tokens.colorNeutralStroke2),
  },
  cardHeaderTitle: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "4px",
  },
  cardHeaderIcon: {
    width: "20px",
    height: "20px",
    color: tokens.colorBrandForeground2,
  },
  cardHeaderText: {
    fontSize: tokens.fontSizeBase300,
    color: tokens.colorNeutralForeground1,
    fontWeight: tokens.fontWeightSemibold,
  },
  cardSubtext: {
    fontSize: tokens.fontSizeBase100,
    color: tokens.colorNeutralForeground2,
    marginTop: "4px",
  },
  ruleRow: {
    ...shorthands.padding("16px"),
    ...shorthands.borderBottom("1px", "solid", tokens.colorNeutralStroke2),
  },
  ruleContent: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
  },
  ruleDetails: {
    flex: 1,
    minWidth: 0,
  },
  ruleLabel: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground1,
    fontWeight: tokens.fontWeightSemibold,
  },
  ruleDescription: {
    fontSize: tokens.fontSizeBase100,
    color: tokens.colorNeutralForeground2,
    marginTop: "2px",
  },
  ruleConfig: {
    display: "flex",
    flexWrap: "wrap",
    gap: "16px",
    marginTop: "12px",
  },
  configItem: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  configLabel: {
    fontSize: "10px",
    color: tokens.colorNeutralForeground2,
  },
  channelButtons: {
    display: "flex",
    gap: "4px",
    marginTop: "4px",
  },
  alertRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    ...shorthands.padding("16px"),
    ...shorthands.borderBottom("1px", "solid", tokens.colorNeutralStroke2),
  },
  alertInfo: {
    opacity: (props: { enabled: boolean }) => (props.enabled ? 1 : 0.5),
  },
  alertLabel: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground1,
    fontWeight: tokens.fontWeightMedium,
  },
  alertDescription: {
    fontSize: tokens.fontSizeBase100,
    color: tokens.colorNeutralForeground2,
  },
  footerButtons: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
  },
  savedButton: {
    backgroundColor: tokens.colorStatusSuccessBackground,
  },
});

export function ManagerConfig() {
  const styles = useStyles();
  const [rules, setRules] = useState(defaultRules);
  const [alertConfigs, setAlertConfigs] = useState(defaultAlertConfigs);
  const [saved, setSaved] = useState(false);

  const updateRule = (id: string, patch: Partial<LifecycleRule>) => {
    setRules((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
    setSaved(false);
  };

  const toggleAlert = (i: number) => {
    setAlertConfigs((prev) => prev.map((a, idx) => (idx === i ? { ...a, enabled: !a.enabled } : a)));
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const renderChannelButton = (ruleId: string, channel: "llamada" | "whatsapp" | "ambos", currentChannel: string) => {
    const isActive = currentChannel === channel;
    let icon = null;
    if (channel === "llamada") icon = <CallRegular style={{ width: "12px", height: "12px" }} />;
    if (channel === "whatsapp") icon = <ChatRegular style={{ width: "12px", height: "12px" }} />;
    if (channel === "ambos") icon = <PeopleRegular style={{ width: "12px", height: "12px" }} />;
    const label = channel.charAt(0).toUpperCase() + channel.slice(1);

    return (
      <Button
        key={channel}
        size="small"
        appearance={isActive ? "primary" : "secondary"}
        icon={icon}
        onClick={() => updateRule(ruleId, { channel })}
        style={{ minWidth: "auto" }}
      >
        {label}
      </Button>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.infoCard}>
        <div className={styles.infoContent}>
          <FlashRegular className={styles.infoIcon} />
          <div>
            <div className={styles.infoTitle}>Configuración del Flujo Automático</div>
            <div className={styles.infoDescription}>
              Aquí se definen las reglas que generan tareas automáticamente para las asesoras.
              Estas reglas reemplazan el criterio personal y estandarizan el contacto con los pacientes.
            </div>
          </div>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.cardHeaderTitle}>
            <CalendarLtrRegular className={styles.cardHeaderIcon} />
            <h3 className={styles.cardHeaderText}>Reglas del Ciclo de Vida</h3>
          </div>
          <div className={styles.cardSubtext}>
            Configure cuándo y cómo se generan las tareas de seguimiento automático
          </div>
        </div>

        <div>
          {rules.map((rule) => {
            const ruleEnabled = rule.enabled;
            return (
              <div key={rule.id} className={styles.ruleRow} style={{ opacity: ruleEnabled ? 1 : 0.5 }}>
                <div className={styles.ruleContent}>
                  <Switch
                    checked={ruleEnabled}
                    onChange={(_, d) => updateRule(rule.id, { enabled: d.checked })}
                  />
                  <div className={styles.ruleDetails}>
                    <div className={styles.ruleLabel}>{rule.label}</div>
                    <div className={styles.ruleDescription}>{rule.description}</div>

                    {ruleEnabled && (
                      <div className={styles.ruleConfig}>
                        <div className={styles.configItem}>
                          <Label size="small" className={styles.configLabel}>Activar después de (días)</Label>
                          <Input
                            type="number"
                            value={String(rule.triggerDays)}
                            onChange={(e) => updateRule(rule.id, { triggerDays: parseInt(e.target.value) || 0 })}
                            size="small"
                            style={{ width: "90px" }}
                          />
                        </div>
                        <div className={styles.configItem}>
                          <Label size="small" className={styles.configLabel}>Canal preferido</Label>
                          <div className={styles.channelButtons}>
                            {renderChannelButton(rule.id, "llamada", rule.channel)}
                            {renderChannelButton(rule.id, "whatsapp", rule.channel)}
                            {renderChannelButton(rule.id, "ambos", rule.channel)}
                          </div>
                        </div>
                        <div className={styles.configItem}>
                          <Label size="small" className={styles.configLabel}>Máx. intentos</Label>
                          <Input
                            type="number"
                            value={String(rule.maxIntentos)}
                            onChange={(e) => updateRule(rule.id, { maxIntentos: parseInt(e.target.value) || 1 })}
                            size="small"
                            style={{ width: "70px" }}
                            min={1}
                            max={10}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.cardHeaderTitle}>
            <AlertRegular className={styles.cardHeaderIcon} style={{ color: tokens.colorStatusWarningForeground1 }} />
            <h3 className={styles.cardHeaderText}>Alertas Automáticas</h3>
          </div>
          <div className={styles.cardSubtext}>
            Configure qué alertas se generan automáticamente
          </div>
        </div>

        <div>
          {alertConfigs.map((alert, i) => (
            <div key={i} className={styles.alertRow}>
              <Switch checked={alert.enabled} onChange={() => toggleAlert(i)} />
              <div className={styles.alertInfo} style={{ opacity: alert.enabled ? 1 : 0.5 }}>
                <div className={styles.alertLabel}>{alert.label}</div>
                <div className={styles.alertDescription}>{alert.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.footerButtons}>
        <Button
          appearance="secondary"
          icon={<ArrowResetRegular />}
          onClick={() => {
            setRules(defaultRules);
            setAlertConfigs(defaultAlertConfigs);
            setSaved(false);
          }}
        >
          Restaurar
        </Button>
        <Button
          appearance="primary"
          icon={<SaveRegular />}
          onClick={handleSave}
          className={saved ? styles.savedButton : undefined}
        >
          {saved ? "Guardado" : "Guardar Cambios"}
        </Button>
      </div>
    </div>
  );
}