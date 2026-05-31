import { createBrowserRouter } from "react-router";
import { Login } from "./components/login";

// Advisor
import { AdvisorLayout } from "./components/advisor/advisor-layout";
import { AdvisorQueue } from "./components/advisor/advisor-queue";
import { AdvisorAlerts } from "./components/advisor/advisor-alerts";
import { AdvisorPatients } from "./components/advisor/advisor-patients";
import { AdvisorCalendar } from "./components/advisor/advisor-calendar";
import { AdvisorIssues } from "./components/advisor/advisor-issues";

// Manager
import { ManagerLayout } from "./components/manager/manager-layout";
import { ManagerDashboard } from "./components/manager/manager-dashboard";
import { ManagerTeam } from "./components/manager/manager-team";
import { ManagerPatients } from "./components/manager/manager-patients";
import { ManagerConfig } from "./components/manager/manager-config";
import { ManagerIssues } from "./components/manager/manager-issues";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Login,
  },
  {
    path: "/asesora",
    Component: AdvisorLayout,
    children: [
      { index: true, Component: AdvisorQueue },
      { path: "calendario", Component: AdvisorCalendar },
      { path: "alertas", Component: AdvisorAlerts },
      { path: "pacientes", Component: AdvisorPatients },
      { path: "problemas", Component: AdvisorIssues },
    ],
  },
  {
    path: "/gerente",
    Component: ManagerLayout,
    children: [
      { index: true, Component: ManagerDashboard },
      { path: "equipo", Component: ManagerTeam },
      { path: "pacientes", Component: ManagerPatients },
      { path: "problemas", Component: ManagerIssues },
      { path: "configuracion", Component: ManagerConfig },
    ],
  },
]);
