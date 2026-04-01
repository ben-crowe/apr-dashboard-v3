
import React from "react";
import { useTheme } from "@/hooks/use-theme";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Menu, User, Search, Bell, Plus, Calendar, Settings, LogOut, RefreshCw } from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children
}) => {
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };
  
  return <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 w-full border-b bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center px-4">
          {/* Logo area - Clickable to refresh */}
          <div className="mr-4 flex items-center">
            <button 
              onClick={() => window.location.reload()} 
              className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
              title="Click to refresh"
            >
              <div className="rounded h-6 w-6 bg-gradient-to-tr from-blue-500 to-navy-500 bg-slate-50"></div>
              <span className="font-semibold text-foreground hidden md:inline-block">Appraisal Dashboard</span>
            </button>
          </div>
          
          {/* Search */}
          <div className="flex-1 hidden md:flex justify-center">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input type="text" placeholder="Search..." className="w-full h-9 rounded-md border border-border bg-secondary pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
            </div>
          </div>
          
          {/* Right Side Actions */}
          <div className="flex items-center gap-2 ml-2">
            {/* Refresh Button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-9 w-9" 
              onClick={() => window.location.reload()}
              title="Refresh page"
            >
              <RefreshCw className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Calendar className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" aria-label="Toggle theme" onClick={toggleTheme} className="h-9 w-9">
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" size="icon" aria-label="Settings" className="h-9 w-9">
              <Settings className="h-5 w-5" />
            </Button>
            
            {/* User info and logout */}
            <div className="flex items-center gap-2">
              <div className="hidden md:block mr-2">
                <div className="text-sm font-medium">{user?.email}</div>
                <div className="text-xs text-muted-foreground">Appraiser</div>
              </div>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-accent/20">
                <User className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={logout} className="h-9 w-9 text-muted-foreground hover:text-destructive">
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>
      <main className="container py-4 md:py-6 px-4 sm:px-6">{children}</main>
    </div>;
};

export default DashboardLayout;
