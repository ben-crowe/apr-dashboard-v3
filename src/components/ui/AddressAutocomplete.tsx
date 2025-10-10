import React, { useState, useCallback, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MapPin, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddressResult {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

interface AddressAutocompleteProps {
  id?: string;
  name?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  country?: string; // Default to CA for Canada
  error?: boolean;
}

// For demo purposes, using mock data
// In production, you'd use Google Places API or Mapbox
const MOCK_ADDRESSES = [
  "123 Main Street, Calgary, AB T2P 1A1",
  "456 Centre Street, Calgary, AB T2P 2B2",
  "789 17th Avenue SW, Calgary, AB T2P 3C3",
  "321 Kensington Road NW, Calgary, AB T2N 1A1",
  "654 Stephen Avenue, Calgary, AB T2P 4B4",
  "987 Memorial Drive, Calgary, AB T2M 1B1",
  "2100 Middletown Place, Sparwood, BC V0B 2G0",
  "1500 Railway Avenue, Canmore, AB T1W 1P6",
  "3200 Hospital Drive NW, Calgary, AB T2N 4N1",
  "500 Centre Street SE, Calgary, AB T2G 1A6"
];

export const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  id,
  name,
  value,
  onChange,
  placeholder = "Start typing an address...",
  className,
  country = "CA",
  error = false,
}) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout>();

  // In production, this would call Google Places API or Mapbox
  const searchAddresses = useCallback(async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsSearching(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Filter mock addresses based on query
    const filtered = MOCK_ADDRESSES.filter(addr =>
      addr.toLowerCase().includes(query.toLowerCase())
    );

    // If no exact matches, create suggestions based on query
    if (filtered.length === 0 && query.length > 5) {
      setSuggestions([
        `${query}, Calgary, AB`,
        `${query}, Edmonton, AB`,
        `${query}, Vancouver, BC`,
        `${query}, Toronto, ON`
      ]);
    } else {
      setSuggestions(filtered);
    }
    
    setIsSearching(false);
    setOpen(true);
  }, []);

  // Handle input change with debouncing
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setSearchTerm(newValue);

    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Set new timer
    debounceTimer.current = setTimeout(() => {
      searchAddresses(newValue);
    }, 300);
  };

  // Handle address selection
  const handleSelect = (address: string) => {
    onChange(address);
    setSearchTerm("");
    setSuggestions([]);
    setOpen(false);
  };

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            ref={inputRef}
            id={id}
            name={name}
            type="text"
            value={value}
            onChange={handleInputChange}
            placeholder={placeholder}
            className={cn(
              "pl-9 pr-9",
              error && "border-destructive",
              className
            )}
            autoComplete="off"
            onFocus={() => {
              if (value.length >= 3) {
                searchAddresses(value);
              }
            }}
          />
          {isSearching && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" />
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[var(--radix-popover-trigger-width)] max-h-[300px] overflow-y-auto p-0" 
        align="start"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <Command>
          <CommandList>
            {suggestions.length === 0 ? (
              <CommandEmpty>
                {searchTerm.length < 3 
                  ? "Type at least 3 characters to search"
                  : "No addresses found. Keep typing..."}
              </CommandEmpty>
            ) : (
              <CommandGroup>
                {suggestions.map((address, index) => (
                  <CommandItem
                    key={`${address}-${index}`}
                    value={address}
                    onSelect={() => handleSelect(address)}
                    className="cursor-pointer"
                  >
                    <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="flex-1">{address}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

// Google Places API integration (for production)
export const AddressAutocompleteGoogle: React.FC<AddressAutocompleteProps> = ({
  id,
  name,
  value,
  onChange,
  placeholder = "Start typing an address...",
  className,
  country = "CA",
  error = false,
}) => {
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<AddressResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const sessionToken = useRef<google.maps.places.AutocompleteSessionToken | null>(null);

  // Initialize Google Places Autocomplete Service
  useEffect(() => {
    if (typeof google !== 'undefined' && google.maps && google.maps.places) {
      autocompleteService.current = new google.maps.places.AutocompleteService();
      sessionToken.current = new google.maps.places.AutocompleteSessionToken();
    }
  }, []);

  const searchAddresses = useCallback(async (query: string) => {
    if (!autocompleteService.current || query.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsSearching(true);

    const request = {
      input: query,
      componentRestrictions: { country: country.toLowerCase() },
      sessionToken: sessionToken.current,
      types: ['address', 'geocode']
    };

    autocompleteService.current.getPlacePredictions(request, (predictions, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
        setSuggestions(predictions.map(p => ({
          place_id: p.place_id,
          description: p.description,
          structured_formatting: p.structured_formatting
        })));
        setOpen(true);
      } else {
        setSuggestions([]);
      }
      setIsSearching(false);
    });
  }, [country]);

  // Rest of the component would be similar to the mock version
  // but using real Google Places data...

  return <div>Google Places implementation would go here</div>;
};

// Add this script tag to your index.html to use Google Places:
// <script async defer src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places"></script>