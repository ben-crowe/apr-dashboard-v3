import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import DocumentBuilderTest from "./pages/DocumentBuilderTest";
import DiagnosticForm from "./pages/DiagnosticForm";
import { SigningPage } from "./pages/SigningPage";
import TestLOE from "./pages/TestLOE";
import MockReportBuilder from "./pages/MockReportBuilder";
import { TestInputDashboard } from "./features/test-input";
import { CalculatorDemoPage } from "./features/calculator-demo-v4";
import PreviewMasterWrapper from "../AGENT-HANDOFF-PreviewMaster-Wrapper";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
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
            <Route path="/mock-builder" element={<MockReportBuilder />} />
            <Route path="/test-input" element={<TestInputDashboard />} />
            <Route path="/calculator-demo" element={<CalculatorDemoPage />} />
            <Route path="/preview-master-test" element={<PreviewMasterWrapper />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
