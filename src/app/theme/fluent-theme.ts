import { createLightTheme, type Theme } from "@fluentui/react-components";

const microsoftBrandRamps = {
  10: "#061724", 20: "#082338", 30: "#0a2e4a", 40: "#0c3b5e",
  50: "#0e4772", 60: "#0f548c", 70: "#115ea3", 80: "#0f6cbd",
  90: "#2878c7", 100: "#4090d4", 110: "#57a0de", 120: "#7cb6e8",
  130: "#9acaf2", 140: "#b7defa", 150: "#d2ebfc", 160: "#eef4fc",
};

export const veraVisionTheme: Theme = {
  ...createLightTheme(microsoftBrandRamps),
  fontFamilyBase: "'Segoe UI', 'Segoe UI Web (West European)', -apple-system, BlinkMacSystemFont, Roboto, 'Helvetica Neue', sans-serif",
  fontFamilyMonospace: "'Cascadia Code', 'Courier New', monospace",
  borderRadiusSmall: "2px",
  borderRadiusMedium: "4px",
  borderRadiusLarge: "6px",
  borderRadiusXLarge: "8px",
  borderRadiusCircular: "9999px",
  shadow2: "0 0 2px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.14)",
  shadow4: "0 0 2px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.14)",
  shadow8: "0 0 2px rgba(0,0,0,0.12), 0 4px 8px rgba(0,0,0,0.14)",
  shadow16: "0 0 2px rgba(0,0,0,0.12), 0 8px 16px rgba(0,0,0,0.14)",
  shadow28: "0 0 8px rgba(0,0,0,0.12), 0 14px 28px rgba(0,0,0,0.24)",
  shadow64: "0 0 8px rgba(0,0,0,0.12), 0 32px 64px rgba(0,0,0,0.24)",
  colorStatusDangerBackground: "#FDF3F4",
  colorStatusDangerForeground: "#B10E1C",
  colorStatusWarningBackground: "#FFFCE6",
  colorStatusWarningForeground: "#817400",
  colorStatusSuccessBackground: "#F1FAF1",
  colorStatusSuccessForeground: "#0E700E",
};