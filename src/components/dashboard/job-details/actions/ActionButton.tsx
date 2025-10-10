
import React from "react";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

type ActionButtonProps = {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  variant?: "primary" | "outline";
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
  return (
    <Button 
      variant={variant}
      onClick={onClick}
      disabled={disabled || isLoading}
      size="sm"
      className={`flex-1 ${className}`}
    >
      <Icon className="h-4 w-4 mr-1" />
      {isLoading ? `${label.split(' ')[0]}...` : label}
    </Button>
  );
};

export default ActionButton;
