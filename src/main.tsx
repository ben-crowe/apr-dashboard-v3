import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Theme is owned by ThemeProvider (src/components/theme-provider.tsx) + the no-flash
// boot script in index.html. Do NOT force a theme here — it would stomp the user's choice.

createRoot(document.getElementById("root")!).render(<App />);
