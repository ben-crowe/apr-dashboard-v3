
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Define types for our auth context
type User = {
  email: string;
  role: "appraiser";
};

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hard-coded test credentials for simplicity
const TEST_EMAIL = "test@appraisalflow.com";
const TEST_PASSWORD = "testpassword123";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        // Check if we have a saved session in localStorage
        const savedUser = localStorage.getItem("appraisal_user");
        
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error("Session restoration error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Simple validation for demo purposes
      if (email !== TEST_EMAIL || password !== TEST_PASSWORD) {
        throw new Error("Invalid credentials");
      }

      // Create a user object
      const loggedInUser: User = {
        email: TEST_EMAIL,
        role: "appraiser"
      };

      // Save to state and localStorage
      setUser(loggedInUser);
      localStorage.setItem("appraisal_user", JSON.stringify(loggedInUser));
      
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed: Invalid credentials");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("appraisal_user");
    toast.info("You have been logged out");
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
