
import { Button } from "@/components/ui/button";
import SubmissionForm from "@/components/SubmissionForm";
import { useTheme } from "@/hooks/use-theme"; // We'll create this hook
import { Moon, Sun, LayoutDashboard } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";

const Index = () => {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Handle OAuth callback redirect from ClickUp
  // ClickUp redirects to base URL with ?code=xxx&state=xxx
  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    
    // If we have OAuth params, redirect to callback handler
    if (code && state) {
      navigate(`/clickup/callback?code=${code}&state=${state}`, { replace: true });
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex flex-col pb-20">
      <header className="sticky top-0 z-10 backdrop-blur-md bg-background/80 border-b border-border transition-all">
        <div className="container flex h-16 items-center justify-between">
          <div className="font-medium">Appraisal Management System</div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-gray-800 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-100 hover:underline transition-colors text-sm font-medium flex items-center gap-2"
            >
              <LayoutDashboard className="h-4 w-4" />
              Go to Dashboard
            </button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container py-8 md:py-12">
        <SubmissionForm />
      </main>

      <footer className="py-6 border-t border-gray-200 dark:border-white/10">
      </footer>
    </div>
  );
};

export default Index;
// Force rebuild at Sat Sep 20 17:47:47 MDT 2025
