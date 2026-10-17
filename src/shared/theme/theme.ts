/**
 * Active MUI theme. Customize tokens in `defaultTheme.ts`.
 *
 * Usage:
 * ```tsx
 * import { theme } from "@/shared/theme/theme";
 * <ThemeProvider theme={theme}><App /></ThemeProvider>
 * ```
 */

import { createTheme } from "@mui/material/styles";
import { defaultThemeOptions } from "./defaultTheme";

export const theme = createTheme(defaultThemeOptions);
