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
      // report-builder is a symlink locally → resolve to actual path for Vercel
      "@/features/report-builder": path.resolve(__dirname, "./src/features/image-configurator/report-builder"),
    },
  },
  define: {
    'process.env': {}
  },
}));
