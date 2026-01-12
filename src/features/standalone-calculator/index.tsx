/**
 * Standalone Calculator - Main Entry Point
 * 
 * Route: /standalone-calculator
 */

import { useEffect } from 'react';
import { CalculatorLayout } from './components/CalculatorLayout';

export default function StandaloneCalculator() {
  // Set dark mode as default
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return <CalculatorLayout />;
}
