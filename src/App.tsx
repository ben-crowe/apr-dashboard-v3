import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/components/theme-provider";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import DocumentBuilderTest from "./pages/DocumentBuilderTest";
import DiagnosticForm from "./pages/DiagnosticForm";
import { SigningPage } from "./pages/SigningPage";
import TestLOE from "./pages/TestLOE";
import LoeRenderTest from "./pages/LoeRenderTest";
// import MockReportBuilder from "./pages/MockReportBuilder"; // TODO: consolidate report-builder location (symlink issue)
import ImageTest from "./pages/ImageTest";
// import { TestInputDashboard } from "./features/test-input"; // TODO: consolidate report-builder location (symlink issue)
// import { CalculatorDemoPage } from "./features/calculator-demo-v4"; // TODO: consolidate report-builder location
// import CalculatorWithPreview from "@/features/calculator-demo-v4/CalculatorWithPreview"; // TODO: consolidate report-builder location
import ClickUpCallback from "./pages/ClickUpCallback";
import StandaloneCalculator from "./features/standalone-calculator";
import StyleGuide from "./pages/StyleGuide";
import { toast } from "sonner";

// ─── Notification rule (Ben) ──────────────────────────────────────────────
// SUCCESS = SILENT. No "saved / deleted / renamed / synced" popups — they fired
// like crazy and Ben never wants them. Only genuine ERRORS pop. In-flight is shown
// by a spinner, not a toast. We neuter the non-error sonner channels app-wide at the
// source so every success/info/neutral toast dies at once (keeps toast.error/warning).
// (Stop-gap blanket kill — QA is doing the proper per-call removal + spinner; this can
//  be lifted once that lands.)
(["success", "info", "message", "loading"] as const).forEach((channel) => {
  // @ts-expect-error — intentionally overriding sonner's channels with silent no-ops
  toast[channel] = () => "";
});

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/appraisal-request-form" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard/*" element={<Dashboard />} />
            <Route
              path="/document-builder-test"
              element={<DocumentBuilderTest />}
            />
            <Route path="/diagnostic" element={<DiagnosticForm />} />
            <Route path="/sign/:id" element={<SigningPage />} />
            <Route path="/test-loe" element={<TestLOE />} />
            <Route path="/loe-render" element={<LoeRenderTest />} />
            {/* <Route path="/mock-builder" element={<MockReportBuilder />} /> */}
            {/* <Route path="/test-input" element={<TestInputDashboard />} /> */}
            {/* <Route path="/calculator-demo" element={<CalculatorDemoPage />} /> */}
            {/* <Route path="/calculator-preview" element={<CalculatorWithPreview />} /> */}
            <Route path="/standalone-calculator" element={<StandaloneCalculator />} />
            <Route path="/image-test" element={<ImageTest />} />
            <Route path="/clickup/callback" element={<ClickUpCallback />} />
            <Route path="/style-guide" element={<StyleGuide />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
