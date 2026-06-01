import { useState, useEffect } from "react";
import { alerts as mockAlerts, type Alert } from "../data/mock-data";
import { getPersistedAlerts, persistAlert } from "./useLocalStorage";

export function useAlertsSync() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = () => {
    const persisted = getPersistedAlerts();
    if (persisted.length === 0) {
      setAlerts(mockAlerts);
    } else {
      setAlerts(persisted);
    }
    setLoading(false);
  };

  useEffect(() => {
    refresh();
    const handler = () => refresh();
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const markAsRead = (id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, leida: true } : a)));
    persistAlert(id, true);
  };

  const markAllAsRead = () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, leida: true })));
    alerts.forEach((a) => persistAlert(a.id, true));
  };

  const unreadCount = alerts.filter((a) => !a.leida).length;

  return { alerts, loading, markAsRead, markAllAsRead, unreadCount };
}