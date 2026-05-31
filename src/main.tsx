import { createRoot } from "react-dom/client";
import { FluentProvider } from "@fluentui/react-components";
import { veraVisionTheme } from "./app/theme/fluent-theme";
import App from "./app/App";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
  <FluentProvider theme={veraVisionTheme}>
    <App />
  </FluentProvider>
);