import React, { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FormSection from "@/components/FormSection";
import { FormData, ValidationErrors } from "@/utils/validation";
import { cn } from "@/lib/utils";
import { ClientProfileService, ClientProfile } from "@/services/ClientProfileService";
import { Check, User, Building, Mail } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";

interface ClientInformationSectionProps {
  formData: FormData;
  errors: ValidationErrors;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onAutoFill?: (data: Partial<FormData>) => void;
}

const ClientInformationSectionWithAutoFill: React.FC<ClientInformationSectionProps> = ({
  formData,
  errors,
  handleChange,
  onAutoFill,
}) => {
  const [searchResults, setSearchResults] = useState<ClientProfile[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentClients, setRecentClients] = useState<ClientProfile[]>([]);
  const [hasAutoFilled, setHasAutoFilled] = useState(false);

  // Load recent clients on mount for quick access
  useEffect(() => {
    const loadRecentClients = async () => {
      const recent = await ClientProfileService.getRecentClients(5);
      setRecentClients(recent);
    };
    loadRecentClients();
  }, []);

  // Search for clients as they type email
  const searchClients = useCallback(async (searchTerm: string) => {
    if (searchTerm.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await ClientProfileService.searchClients(searchTerm);
      setSearchResults(results);
      setShowSuggestions(results.length > 0);
    } catch (error) {
      console.error('Error searching clients:', error);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Auto-fill form when email changes (debounced)
  useEffect(() => {
    if (hasAutoFilled) return; // Don't auto-fill again if already done

    const timer = setTimeout(() => {
      if (formData.clientEmail && formData.clientEmail.includes('@')) {
        searchClients(formData.clientEmail);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [formData.clientEmail, searchClients, hasAutoFilled]);

  // Auto-fill form with client data
  const handleAutoFill = (client: ClientProfile) => {
    const autoFillData: Partial<FormData> = {
      clientEmail: client.email,
      clientFirstName: client.firstName || formData.clientFirstName,
      clientLastName: client.lastName || formData.clientLastName,
      clientPhone: client.phone || formData.clientPhone,
      clientTitle: client.title || formData.clientTitle,
      clientOrganization: client.organization || formData.clientOrganization,
      clientAddress: client.address || formData.clientAddress,
    };

    if (onAutoFill) {
      onAutoFill(autoFillData);
    } else {
      // Fallback: manually trigger change events
      Object.entries(autoFillData).forEach(([key, value]) => {
        const input = document.getElementById(key) as HTMLInputElement;
        if (input && value) {
          input.value = value;
          input.dispatchEvent(new Event('change', { bubbles: true }));
        }
      });
    }

    setHasAutoFilled(true);
    setShowSuggestions(false);
    toast.success(`Auto-filled from previous submission (${client.totalJobs} prior job${client.totalJobs > 1 ? 's' : ''})`);
  };

  return (
    <FormSection
      title="Client Information"
      description="Contact details for the client requesting the appraisal"
    >
      {/* Show recent clients for quick selection */}
      {!hasAutoFilled && recentClients.length > 0 && (
        <div className="mb-4 p-3 bg-muted/50 rounded-lg">
          <p className="text-sm font-medium mb-2 text-muted-foreground">Recent Clients - Quick Select:</p>
          <div className="flex flex-wrap gap-2">
            {recentClients.map((client) => (
              <button
                key={client.id}
                type="button"
                onClick={() => handleAutoFill(client)}
                className="inline-flex items-center gap-1 px-3 py-1 text-xs border rounded-full hover:bg-accent transition-colors"
              >
                {client.organization ? (
                  <>
                    <Building className="h-3 w-3" />
                    {client.organization}
                  </>
                ) : (
                  <>
                    <User className="h-3 w-3" />
                    {client.firstName} {client.lastName}
                  </>
                )}
                <span className="text-muted-foreground">({client.totalJobs})</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Show auto-fill success indicator */}
      {hasAutoFilled && (
        <div className="mb-4 p-2 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-2">
          <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
          <span className="text-sm text-green-700 dark:text-green-300">Client information auto-filled from previous submission</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label
            htmlFor="clientFirstName"
            className={cn(errors.clientFirstName && "text-destructive")}
          >
            First Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="clientFirstName"
            name="clientFirstName"
            value={formData.clientFirstName}
            onChange={handleChange}
            className={cn(errors.clientFirstName && "border-destructive")}
            placeholder="Enter first name"
          />
          {errors.clientFirstName && (
            <p className="text-sm text-destructive">{errors.clientFirstName}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="clientLastName"
            className={cn(errors.clientLastName && "text-destructive")}
          >
            Last Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="clientLastName"
            name="clientLastName"
            value={formData.clientLastName}
            onChange={handleChange}
            className={cn(errors.clientLastName && "border-destructive")}
            placeholder="Enter last name"
          />
          {errors.clientLastName && (
            <p className="text-sm text-destructive">{errors.clientLastName}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="clientTitle">Client Title</Label>
          <Input
            id="clientTitle"
            name="clientTitle"
            value={formData.clientTitle}
            onChange={handleChange}
            placeholder="e.g. CEO, Property Manager"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="clientOrganization">Client Organization Name</Label>
          <Input
            id="clientOrganization"
            name="clientOrganization"
            value={formData.clientOrganization}
            onChange={handleChange}
            placeholder="Enter organization name"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="clientAddress">Client Organization Address</Label>
          <Input
            id="clientAddress"
            name="clientAddress"
            value={formData.clientAddress}
            onChange={handleChange}
            placeholder="Enter organization address"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="clientPhone"
            className={cn(errors.clientPhone && "text-destructive")}
          >
            Client Phone <span className="text-destructive">*</span>
          </Label>
          <Input
            id="clientPhone"
            name="clientPhone"
            value={formData.clientPhone}
            onChange={handleChange}
            className={cn(errors.clientPhone && "border-destructive")}
            placeholder="(123) 456-7890"
          />
          {errors.clientPhone && (
            <p className="text-sm text-destructive">{errors.clientPhone}</p>
          )}
        </div>

        <div className="space-y-2 relative">
          <Label
            htmlFor="clientEmail"
            className={cn(errors.clientEmail && "text-destructive")}
          >
            Client Email <span className="text-destructive">*</span>
            {isSearching && (
              <span className="text-xs text-muted-foreground ml-2">Searching...</span>
            )}
          </Label>
          <Popover open={showSuggestions} onOpenChange={setShowSuggestions}>
            <PopoverTrigger asChild>
              <Input
                id="clientEmail"
                name="clientEmail"
                type="email"
                value={formData.clientEmail}
                onChange={(e) => {
                  handleChange(e);
                  setHasAutoFilled(false); // Reset auto-fill flag when email changes
                }}
                className={cn(errors.clientEmail && "border-destructive")}
                placeholder="email@example.com"
              />
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command>
                <CommandList>
                  <CommandEmpty>No matching clients found</CommandEmpty>
                  <CommandGroup heading="Matching Clients">
                    {searchResults.map((client) => (
                      <CommandItem
                        key={client.id}
                        onSelect={() => handleAutoFill(client)}
                        className="cursor-pointer"
                      >
                        <div className="flex items-center gap-2 w-full">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <div className="flex-1">
                            <div className="font-medium">
                              {client.firstName} {client.lastName}
                              {client.organization && (
                                <span className="text-muted-foreground ml-2">({client.organization})</span>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">{client.email}</div>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {client.totalJobs} job{client.totalJobs !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          {errors.clientEmail && (
            <p className="text-sm text-destructive">{errors.clientEmail}</p>
          )}
        </div>
      </div>
    </FormSection>
  );
};

export default ClientInformationSectionWithAutoFill;