import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      '/api/valcre': {
        target: 'https://api-core.valcre.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/valcre/, '/api/v1'),
        secure: true
      },
      '/auth/valcre': {
        target: 'https://auth.valcre.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/auth\/valcre/, ''),
        secure: true
      }
    }
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    'process.env': {}
  },
}));
