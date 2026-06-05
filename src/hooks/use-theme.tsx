// Back-compat shim: the hook now delegates to the single ThemeProvider context
// (src/components/theme-provider.tsx). Existing imports of "@/hooks/use-theme" keep working.
export { useTheme } from "@/components/theme-provider";
export type { Theme } from "@/components/theme-provider";
