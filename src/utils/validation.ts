export interface FormData {
  clientFirstName: string;
  clientLastName: string;
  clientTitle?: string;
  clientOrganization?: string;
  clientAddress?: string;
  clientPhone: string;
  clientEmail: string;
  propertyName?: string;
  propertyAddress: string;
  propertyType?: string;
  intendedUse?: string;
  valuationPremises?: string;
  assetCondition?: string;
  notes?: string;
  files: File[];
  // Property Contact fields
  sameAsClientContact?: boolean;
  propertyContactFirstName?: string;
  propertyContactLastName?: string;
  propertyContactEmail?: string;
  propertyContactPhone?: string;
}

export interface ValidationErrors {
  clientFirstName?: string;
  clientLastName?: string;
  clientTitle?: string;
  clientOrganization?: string;
  clientAddress?: string;
  clientPhone?: string;
  clientEmail?: string;
  propertyName?: string;
  propertyAddress?: string;
  propertyType?: string;
  intendedUse?: string;
  assetCondition?: string;
  notes?: string;
  files?: string;
  // Property Contact validation errors
  propertyContactFirstName?: string;
  propertyContactLastName?: string;
  propertyContactEmail?: string;
  propertyContactPhone?: string;
}

export const validateForm = (data: FormData): ValidationErrors => {
  const errors: ValidationErrors = {};

  // Required fields
  if (!data.clientFirstName?.trim()) {
    errors.clientFirstName = "First name is required";
  }

  if (!data.clientLastName?.trim()) {
    errors.clientLastName = "Last name is required";
  }

  if (!data.clientPhone?.trim()) {
    errors.clientPhone = "Phone number is required";
  } else if (!isValidPhone(data.clientPhone)) {
    errors.clientPhone = "Please enter a valid phone number";
  }

  if (!data.clientEmail?.trim()) {
    errors.clientEmail = "Email address is required";
  } else if (!isValidEmail(data.clientEmail)) {
    errors.clientEmail = "Please enter a valid email address";
  }

  if (!data.propertyAddress?.trim()) {
    errors.propertyAddress = "Property address is required";
  }

  return errors;
};

const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const isValidPhone = (phone: string): boolean => {
  // This is a simple validation, can be made more complex
  return /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(
    phone.replace(/\s+/g, "")
  );
};
