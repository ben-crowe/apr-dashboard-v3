
import React from "react";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

type ActionButtonProps = {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  variant?: "primary" | "outline" | "success";
  className?: string;
};

const ActionButton: React.FC<ActionButtonProps> = ({
  icon: Icon,
  label,
  onClick,
  disabled = false,
  isLoading = false,
  variant = "outline",
  className = "",
}) => {
  // Map variants to standardized gray styling
  const variantClasses = {
    primary: "bg-muted hover:bg-muted dark:hover:bg-gray-700",
    success: "bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30 border-green-200 dark:border-green-800",
    outline: "bg-muted hover:bg-muted dark:hover:bg-gray-700"
  };

  return (
    <Button
      variant="outline"
      onClick={onClick}
      disabled={disabled || isLoading}
      size="sm"
      className={`flex-1 ${variantClasses[variant]} ${className}`}
    >
      <Icon className="h-4 w-4 mr-1" />
      {isLoading ? `${label.split(' ')[0]}...` : label}
    </Button>
  );
};

export default ActionButton;
