/**
 * Usage Example: Loading North Battleford Test Data
 *
 * This file demonstrates how to load test data into the Report Builder.
 * Copy and adapt this code for your specific use case.
 */

import React from 'react';
import { useReportBuilderStore } from '../store/reportBuilderStore';
import {
  loadNorthBattlefordTestData,
  northBattlefordSummary,
  northBattlefordImages,
} from './index';

/**
 * Example Component: Test Data Loader Button
 *
 * This component provides a button to load the North Battleford test data
 * into the Report Builder. Useful for testing and demonstrations.
 */
export function TestDataLoader() {
  const { updateFieldValue } = useReportBuilderStore();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isLoaded, setIsLoaded] = React.useState(false);

  const handleLoadTestData = () => {
    setIsLoading(true);

    try {
      // Load all test data into the store
      loadNorthBattlefordTestData(updateFieldValue);

      // Show success message
      setIsLoaded(true);
      console.log('✅ Test data loaded successfully');
      console.log('Property:', northBattlefordSummary);

      // Reset success message after 3 seconds
      setTimeout(() => setIsLoaded(false), 3000);
    } catch (error) {
      console.error('❌ Error loading test data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="test-data-loader">
      <button
        onClick={handleLoadTestData}
        disabled={isLoading || isLoaded}
        className={`btn ${isLoaded ? 'btn-success' : 'btn-primary'}`}
      >
        {isLoading && '⏳ Loading...'}
        {isLoaded && '✅ Test Data Loaded'}
        {!isLoading && !isLoaded && '📊 Load North Battleford Test Data'}
      </button>

      {isLoaded && (
        <div className="alert alert-success mt-3">
          <strong>Test data loaded successfully!</strong>
          <br />
          Property: {northBattlefordSummary.propertyName}
          <br />
          Units: {northBattlefordSummary.units} | Value: $
          {northBattlefordSummary.concludedValue.toLocaleString()}
        </div>
      )}
    </div>
  );
}

/**
 * Example: Loading specific field values
 */
export function useLoadSpecificFields() {
  const { updateFieldValue } = useReportBuilderStore();

  const loadCoverPageOnly = () => {
    updateFieldValue('cover', 'property-name', 'North Battleford Apartments');
    updateFieldValue('cover', 'street-address', '1101, 1121 109 St');
    updateFieldValue('cover', 'city', 'North Battleford');
    updateFieldValue('cover', 'province', 'Saskatchewan');
    updateFieldValue('cover', 'valuation-date', '2025-10-17');
    updateFieldValue('cover', 'file-number', 'VAL251012 - 1');
  };

  const loadCalculatorOnly = () => {
    // Unit 1
    updateFieldValue('calc', 'calc-unit-1-type', '1BR/1BA');
    updateFieldValue('calc', 'calc-unit-1-count', 4);
    updateFieldValue('calc', 'calc-unit-1-sf', 550);
    updateFieldValue('calc', 'calc-unit-1-market-rent', 900);

    // Unit 2
    updateFieldValue('calc', 'calc-unit-2-type', '2BR/1BA');
    updateFieldValue('calc', 'calc-unit-2-count', 12);
    updateFieldValue('calc', 'calc-unit-2-sf', 667);
    updateFieldValue('calc', 'calc-unit-2-market-rent', 1060);

    // Expenses
    updateFieldValue('calc', 'calc-exp-management', 5);
    updateFieldValue('calc', 'calc-exp-taxes', 1125);
    updateFieldValue('calc', 'calc-exp-insurance', 625);
    updateFieldValue('calc', 'calc-exp-utilities', 750);
    updateFieldValue('calc', 'calc-exp-repairs', 625);
    updateFieldValue('calc', 'calc-exp-admin', 156.25);
    updateFieldValue('calc', 'calc-exp-reserves', 250);

    // Cap Rate
    updateFieldValue('calc', 'calc-cap-rate', 6.25);
  };

  return {
    loadCoverPageOnly,
    loadCalculatorOnly,
  };
}

/**
 * Example: Using test data in tests
 */
export function exampleTestUsage() {
  // Example Jest/Vitest test
  describe('Report Builder with North Battleford Data', () => {
    it('should load test data correctly', () => {
      const mockUpdateFieldValue = jest.fn();

      loadNorthBattlefordTestData(mockUpdateFieldValue);

      // Verify some key fields were updated
      expect(mockUpdateFieldValue).toHaveBeenCalledWith(
        'cover',
        'property-name',
        'North Battleford Apartments'
      );

      expect(mockUpdateFieldValue).toHaveBeenCalledWith(
        'calc',
        'calc-unit-1-count',
        4
      );

      expect(mockUpdateFieldValue).toHaveBeenCalledWith(
        'recon',
        'recon-final-value',
        1780000
      );
    });

    it('should have correct property summary', () => {
      expect(northBattlefordSummary.units).toBe(16);
      expect(northBattlefordSummary.concludedValue).toBe(1780000);
      expect(northBattlefordSummary.valuePerUnit).toBe(111250);
    });
  });
}

/**
 * Example: Programmatic access to test data
 */
export function exampleDirectAccess() {
  // Import the raw test data
  import('./northBattlefordTestData').then(({ northBattlefordTestData }) => {
    // Access specific fields
    const propertyName = northBattlefordTestData['property-name'];
    const totalUnits = northBattlefordTestData['calc-unit-1-count'] as number;
    const concludedValue = northBattlefordTestData['recon-final-value'] as number;

    console.log('Property:', propertyName);
    console.log('Units:', totalUnits);
    console.log('Value:', concludedValue);

    // Access image paths
    console.log('Cover photo:', northBattlefordTestData['cover-photo']);
    console.log('Exterior photos:', northBattlefordImages.exterior);
  });
}

/**
 * Example: Integration with UI components
 */
export function ReportBuilderWithTestData() {
  const [showLoader, setShowLoader] = React.useState(true);

  return (
    <div className="report-builder-container">
      {showLoader && (
        <div className="test-data-controls">
          <TestDataLoader />
          <button
            onClick={() => setShowLoader(false)}
            className="btn btn-link btn-sm"
          >
            Hide Test Data Controls
          </button>
        </div>
      )}

      {/* Your Report Builder UI components here */}
      {/* ... */}
    </div>
  );
}

/**
 * Example: Console logging for debugging
 */
export function logTestDataSummary() {
  console.group('📊 North Battleford Test Data Summary');
  console.log('Property Name:', northBattlefordSummary.propertyName);
  console.log('Address:', northBattlefordSummary.address);
  console.log('File Number:', northBattlefordSummary.fileNumber);
  console.log('Valuation Date:', northBattlefordSummary.valuationDate);
  console.log('');
  console.log('Property Details:');
  console.log('  - Units:', northBattlefordSummary.units);
  console.log('  - Buildings:', northBattlefordSummary.buildings);
  console.log('  - Year Built:', northBattlefordSummary.yearBuilt);
  console.log('  - NRA:', northBattlefordSummary.nra.toLocaleString(), 'SF');
  console.log('  - Site Area:', northBattlefordSummary.siteArea.toLocaleString(), 'SF');
  console.log('');
  console.log('Valuation:');
  console.log(
    '  - Concluded Value: $',
    northBattlefordSummary.concludedValue.toLocaleString()
  );
  console.log(
    '  - Value per Unit: $',
    northBattlefordSummary.valuePerUnit.toLocaleString()
  );
  console.log('  - Value per SF: $', northBattlefordSummary.valuePerSF.toFixed(2));
  console.log('');
  console.log('Available Images:');
  console.log('  - Cover:', northBattlefordImages.cover.length, 'image(s)');
  console.log('  - Exterior:', northBattlefordImages.exterior.length, 'image(s)');
  console.log('  - Interior:', northBattlefordImages.interior.length, 'image(s)');
  console.log('  - Street Views:', northBattlefordImages.streetViews.length, 'image(s)');
  console.log('  - Maps:', northBattlefordImages.maps.length, 'image(s)');
  console.groupEnd();
}
