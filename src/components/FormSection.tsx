
import React from "react";
import { cn } from "@/lib/utils";

interface FormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

const FormSection = ({
  title,
  description,
  children,
  className,
}: FormSectionProps) => {
  return (
    <div className={cn("mb-8 animate-fade-in", className)}>
      <div className="mb-4">
        <h2 className="text-xl font-medium tracking-tight">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
};

export default FormSection;
