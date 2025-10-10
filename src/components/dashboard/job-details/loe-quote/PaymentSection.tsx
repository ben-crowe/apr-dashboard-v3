
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PaymentSectionProps {
  paymentTerms?: string;
  appraisalFee?: number;
  retainerAmount?: string;
  reportType?: string;
  onValueChange: (value: string, name: string) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PaymentSection: React.FC<PaymentSectionProps> = ({
  paymentTerms,
  appraisalFee,
  retainerAmount,
  reportType,
  onValueChange,
  onInputChange,
}) => {
  // Format number with commas (e.g., 3000 -> 3,000)
  const formatCurrency = (value: string | number): string => {
    if (!value) return '';

    // Convert to string and remove non-numeric characters except decimal
    const numericValue = String(value).replace(/[^0-9.]/g, '');

    // Split on decimal point
    const parts = numericValue.split('.');

    // Add commas to integer part
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    // Return formatted value (with decimal if present)
    return parts.join('.');
  };

  // Strip formatting from currency string (e.g., "$3,000.00" -> "3000.00")
  const unformatCurrency = (value: string): string => {
    return value.replace(/[^0-9.]/g, '');
  };

  // Handle appraisal fee changes with currency formatting
  const handleAppraisalFeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = unformatCurrency(e.target.value);

    const syntheticEvent = {
      ...e,
      target: {
        ...e.target,
        name: 'appraisalFee',
        value: rawValue  // Send raw number to parent
      }
    } as React.ChangeEvent<HTMLInputElement>;

    onInputChange(syntheticEvent);
  };

  // Handle retainer amount changes with currency formatting
  const handleRetainerAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = unformatCurrency(e.target.value);

    const syntheticEvent = {
      ...e,
      target: {
        ...e.target,
        name: 'retainerAmount',
        value: rawValue  // Send raw number to parent
      }
    } as React.ChangeEvent<HTMLInputElement>;

    onInputChange(syntheticEvent);
  };

  // Format values for display with $ and commas
  const formattedAppraisalFee = appraisalFee ? `$${formatCurrency(appraisalFee)}` : '';
  const formattedRetainerAmount = retainerAmount ? `$${formatCurrency(retainerAmount)}` : '';

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="reportType">Report Type</Label>
        <Select value={reportType || ''} onValueChange={value => onValueChange(value, 'reportType')}>
          <SelectTrigger id="reportType">
            <SelectValue placeholder="Select..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Comprehensive">Comprehensive</SelectItem>
            <SelectItem value="Summary">Summary</SelectItem>
            <SelectItem value="Restricted">Restricted</SelectItem>
            <SelectItem value="Form">Form</SelectItem>
            <SelectItem value="Letter">Letter</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="paymentTerms">Payment Terms</Label>
        <Select value={paymentTerms || ''} onValueChange={value => onValueChange(value, 'paymentTerms')}>
          <SelectTrigger id="paymentTerms">
            <SelectValue placeholder="Select..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Net 30">Net 30</SelectItem>
            <SelectItem value="Net 60">Net 60</SelectItem>
            <SelectItem value="Upon Completion">Upon Completion</SelectItem>
            <SelectItem value="50% Upfront">50% Upfront</SelectItem>
            <SelectItem value="On LOE Signature">On LOE Signature</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="appraisalFee">Appraisal Fee</Label>
        <Input
          id="appraisalFee"
          name="appraisalFee"
          type="text"
          value={formattedAppraisalFee}
          onChange={handleAppraisalFeeChange}
          placeholder="$3,500"
          className="placeholder:text-gray-500"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="retainerAmount">Retainer Amount</Label>
        <Input
          id="retainerAmount"
          name="retainerAmount"
          type="text"
          value={formattedRetainerAmount}
          onChange={handleRetainerAmountChange}
          placeholder="$350"
          className="placeholder:text-gray-500"
        />
        <p className="text-xs text-muted-foreground">
          Typical retainer: 10% of appraisal fee
        </p>
      </div>
    </div>
  );
};

export default PaymentSection;
