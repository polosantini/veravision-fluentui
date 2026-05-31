import { RouterProvider } from "react-router";
import { FluentProvider } from "@fluentui/react-components";
import { router } from "./routes";
import { veraVisionTheme } from "./theme/fluent-theme";

export default function App() {
  return (
    <FluentProvider theme={veraVisionTheme}>
      <RouterProvider router={router} />
    </FluentProvider>
  );
}
