import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8086,
    proxy: {
      '/api': {
        target: 'https://apr-dashboard-v3.vercel.app',
        changeOrigin: true,
        secure: true
      }
    }
  },
  plugins: [
    react(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // The ONE source of the five SharePoint folder names, shared by the Deno edge functions and the
      // browser bundle. It is a deliberately inert leaf (no imports, no Deno, no browser globals) —
      // that is what lets both sides import the same file instead of hand-copying the list.
      "@shared": path.resolve(__dirname, "./supabase/functions/_shared"),
    },
  },
  define: {
    'process.env': {}
  },
}));
