
import { Button } from "@/components/ui/button";
import SubmissionForm from "@/components/SubmissionForm";
import { useTheme } from "@/hooks/use-theme"; // We'll create this hook
import { Moon, Sun, LayoutDashboard } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col pb-20">
      <header className="sticky top-0 z-10 backdrop-blur-md bg-background/80 border-b border-border transition-all">
        <div className="container flex h-16 items-center justify-between">
          <div className="font-medium">Appraisal Management System</div>
          <div className="flex items-center gap-2">
            <Button
              variant="default"
              size="default"
              onClick={() => navigate('/dashboard')}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Go to Dashboard
            </Button>
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

      <footer className="py-6 border-t">
        <div className="container text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Appraisal Management System. All rights
          reserved.
        </div>
      </footer>
    </div>
  );
};

export default Index;
// Force rebuild at Sat Sep 20 17:47:47 MDT 2025
