import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Theme is owned by ThemeProvider (src/components/theme-provider.tsx) + the no-flash
// boot script in index.html. Do NOT force a theme here — it would stomp the user's choice.

createRoot(document.getElementById("root")!).render(<App />);

// DEV-ONLY: expose the transition-diff runner on window for the chunk-3 browser driver.
// The `import.meta.env.DEV` guard makes Rollup dead-code-eliminate this block (and the whole
// runner module) from the prod bundle — window.__transitionDiff is absent in production.
if (import.meta.env.DEV) {
  import("./features/report-builder/testSeam/transitionDiffRunner").then((m) =>
    m.installTransitionDiffRunner(),
  );
}
