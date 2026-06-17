/**
 * V4 feature gate — single source of truth.
 *
 * `VITE_V4_ENABLED` is a build-time env var. Default OFF (absent / not 'true') = the safe
 * client build, so we can never accidentally ship V4 to Chris's team.
 *   - Production env (Chris's live site): unset/OFF  → V4 dark (sections 1–2 only).
 *   - Preview + Development envs (our builds): 'true' → full V4 visible.
 *
 * Set per-environment in Vercel project env vars (same project, no separate domain — interim
 * split; the separate-domain/SaaS model is a later track). Every gate point MUST read this
 * helper, never `import.meta.env.VITE_V4_ENABLED` directly.
 */
export const isV4Enabled = (): boolean =>
  import.meta.env.VITE_V4_ENABLED === 'true';
