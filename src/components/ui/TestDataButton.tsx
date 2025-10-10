import React from 'react';
import { Button } from '@/components/ui/button';
import { FlaskConical, Sparkles } from 'lucide-react';
import { 
  generateCompleteTestData, 
  generateClientTestData,
  generatePropertyTestData,
  TestClientData,
  TestPropertyData
} from '@/utils/testDataGenerator';
import { toast } from 'sonner';

interface TestDataButtonProps {
  onFillData: (data: any) => void;
  dataType?: 'complete' | 'client' | 'property';
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
  showIcon?: boolean;
  buttonText?: string;
}

/**
 * Reusable test data button component
 * Generates varied test data for form testing
 */
export function TestDataButton({
  onFillData,
  dataType = 'complete',
  variant = 'outline',
  size = 'sm',
  className = '',
  showIcon = true,
  buttonText = 'Fill Test Data'
}: TestDataButtonProps) {
  
  const handleFillTestData = () => {
    let testData: any;
    let toastMessage = '';
    
    switch (dataType) {
      case 'client':
        testData = generateClientTestData();
        toastMessage = `Test client: ${testData.clientFirstName} ${testData.clientLastName}`;
        break;
      case 'property':
        testData = generatePropertyTestData();
        toastMessage = `Test property: ${testData.propertyAddress}`;
        break;
      case 'complete':
      default:
        testData = generateCompleteTestData();
        toastMessage = `Test data: ${testData.clientFirstName} ${testData.clientLastName} - ${testData.propertyAddress}`;
        break;
    }
    
    // Call the provided callback with the test data
    onFillData(testData);
    
    // Show toast notification with the generated data
    toast.success(toastMessage, {
      description: 'Test mode - API calls will be mocked',
      duration: 3000,
    });
  };
  
  // Only show in development environment
  const isDevelopment = import.meta.env.MODE === 'development' || 
                       window.location.hostname === '10.0.0.238' ||
                       window.location.hostname === 'localhost';
  
  if (!isDevelopment) {
    return null;
  }
  
  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={handleFillTestData}
      className={`${className} flex items-center gap-2`}
    >
      {showIcon && (
        <FlaskConical className="h-4 w-4" />
      )}
      {buttonText}
      <Sparkles className="h-3 w-3 text-yellow-500" />
    </Button>
  );
}

/**
 * Quick test data filling for development
 * Shows multiple test options
 */
export function TestDataPanel({ onFillData }: { onFillData: (data: any) => void }) {
  const testScenarios = [
    { name: 'New Client - Office', type: 'office' },
    { name: 'Repeat Client - Retail', type: 'retail' },
    { name: 'Urgent - Industrial', type: 'industrial' },
    { name: 'Standard - Mixed Use', type: 'mixed' }
  ];
  
  const handleScenario = (type: string) => {
    const testData = generateCompleteTestData();
    
    // Customize based on scenario
    switch (type) {
      case 'office':
        testData.propertyType = 'Office';
        testData.intendedUse = 'Financing/Refinancing';
        break;
      case 'retail':
        testData.propertyType = 'Retail';
        testData.intendedUse = 'Acquisition';
        testData.clientOrganization = 'Repeat Client Corp';
        break;
      case 'industrial':
        testData.propertyType = 'Industrial';
        testData.priorityLevel = 'Urgent';
        testData.intendedUse = 'Financing/Refinancing';
        break;
      case 'mixed':
        testData.propertyType = 'Mixed Use';
        testData.priorityLevel = 'Standard';
        testData.intendedUse = 'Portfolio Review';
        break;
    }
    
    onFillData(testData);
    toast.success(`Test scenario loaded: ${type}`, {
      description: `${testData.clientFirstName} ${testData.clientLastName} - ${testData.propertyAddress}`
    });
  };
  
  const isDevelopment = import.meta.env.MODE === 'development' || 
                       window.location.hostname === '10.0.0.238' ||
                       window.location.hostname === 'localhost';
  
  if (!isDevelopment) {
    return null;
  }
  
  return (
    <div className="fixed bottom-4 right-4 z-50 p-3 bg-background border rounded-lg shadow-lg">
      <div className="text-xs font-semibold mb-2 flex items-center gap-1">
        <FlaskConical className="h-3 w-3" />
        Test Scenarios
      </div>
      <div className="flex flex-col gap-1">
        {testScenarios.map((scenario) => (
          <Button
            key={scenario.type}
            size="sm"
            variant="ghost"
            onClick={() => handleScenario(scenario.type)}
            className="justify-start text-xs"
          >
            {scenario.name}
          </Button>
        ))}
      </div>
    </div>
  );
}