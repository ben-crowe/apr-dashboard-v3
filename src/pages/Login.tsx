
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate, useLocation } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("test@appraisalflow.com");
  const [password, setPassword] = useState("testpassword123");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the page the user was trying to access before being redirected to login
  const from = (location.state as any)?.from?.pathname || "/dashboard";
  
  // If already authenticated, redirect
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await login(email, password);
      // Navigation is handled in the useEffect above after auth state changes
    } catch (error) {
      // Error is handled in the login function
      console.error("Login submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full p-8 space-y-8 bg-card rounded-xl shadow-lg animate-fade-in">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Appraiser Login</h1>
          <p className="text-muted-foreground mt-2">
            Sign in to access the appraisal dashboard
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1"
                placeholder="test@appraisalflow.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1"
                placeholder="••••••••"
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <p className="text-muted-foreground">
            This is a demo system.
            <br />
            Default credentials are already provided.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
