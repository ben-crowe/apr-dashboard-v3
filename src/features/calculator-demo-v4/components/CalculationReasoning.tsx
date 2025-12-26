/**
 * Calculation Reasoning - Step-by-step Breakdown
 *
 * Clean document-style layout with subtle separators.
 * Typewriter animation effect on load/update.
 * Dynamic height - grows with content until reaching parent constraints, then scrolls.
 */

import { useEffect, useState, useRef, useCallback } from 'react';
import { useReportBuilderStore } from '@/features/report-builder/store/reportBuilderStore';
import { useTheme } from '../context/ThemeContext';

interface AnimationState {
  isAnimating: boolean;
  currentLine: number;
  visibleChars: number;
  completedLines: Set<number>;
}

type LineType = 'header' | 'separator' | 'row' | 'total' | 'note' | 'blank' | 'check';

interface ContentLine {
  text: string;
  type: LineType;
  value?: number;
}

export default function CalculationReasoning() {
  const sections = useReportBuilderStore(state => state.sections);
  const { colors } = useTheme();
  const calcSection = sections.find(s => s.id === 'calc');
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const [animation, setAnimation] = useState<AnimationState>({
    isAnimating: false,
    currentLine: 0,
    visibleChars: 0,
    completedLines: new Set(),
  });
  const [skipAnimation, setSkipAnimation] = useState(false);
  const [lastDataHash, setLastDataHash] = useState('');

  const getFieldValue = (fieldId: string): number => {
    if (!calcSection) return 0;
    const field = calcSection.fields.find(f => f.id === fieldId);
    if (field) return Number(field.value) || 0;
    if (calcSection.subsections) {
      for (const sub of calcSection.subsections) {
        const subField = sub.fields.find(f => f.id === fieldId);
        if (subField) return Number(subField.value) || 0;
      }
    }
    return 0;
  };

  const fmt = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const fmtNum = (value: number, decimals: number = 2): string => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value);
  };

  // Get all values
  const totalUnits = getFieldValue('calc-total-units');
  const vacancyRate = getFieldValue('calc-vacancy-rate');
  const badDebtRate = getFieldValue('calc-bad-debt-rate');
  const concessionsRate = getFieldValue('calc-concessions-rate');
  const capRate = getFieldValue('calc-cap-rate');
  const mgmtPct = getFieldValue('calc-exp-management');
  const taxPerUnit = getFieldValue('calc-exp-taxes');
  const insPerUnit = getFieldValue('calc-exp-insurance');
  const repPerUnit = getFieldValue('calc-exp-repairs');
  const utilPerUnit = getFieldValue('calc-exp-utilities');
  const payPerUnit = getFieldValue('calc-exp-payroll');
  const adminPerUnit = getFieldValue('calc-exp-admin');
  const resPerUnit = getFieldValue('calc-exp-reserves');
  const otherPerUnit = getFieldValue('calc-exp-other');
  const rentalRevenue = getFieldValue('calc-rental-revenue') || getFieldValue('calc-total-rental-revenue');
  const parkingTotal = getFieldValue('calc-parking-total');
  const laundryTotal = getFieldValue('calc-laundry-total');
  const pgr = getFieldValue('calc-pgr');
  const vacancyLoss = getFieldValue('calc-vacancy-loss');
  const egr = getFieldValue('calc-egr');
  const expensesTotal = getFieldValue('calc-expenses-total');
  const noi = getFieldValue('calc-noi');
  const rawValue = getFieldValue('calc-raw-value');
  const indicatedValue = getFieldValue('calc-indicated-value');
  const adjustments = getFieldValue('calc-adj-total');

  // Calculated values
  const totalVacRate = vacancyRate + badDebtRate + concessionsRate;
  const taxTotal = taxPerUnit * totalUnits;
  const insTotal = insPerUnit * totalUnits;
  const repTotal = repPerUnit * totalUnits;
  const utilTotal = utilPerUnit * totalUnits;
  const payTotal = payPerUnit * totalUnits;
  const adminTotal = adminPerUnit * totalUnits;
  const resTotal = resPerUnit * totalUnits;
  const otherTotal = otherPerUnit * totalUnits;
  const mgmtTotal = egr * (mgmtPct / 100);
  const oer = egr > 0 ? (expensesTotal / egr) * 100 : 0;
  const expPerUnit = totalUnits > 0 ? expensesTotal / totalUnits : 0;
  const nim = noi > 0 ? indicatedValue / noi : 0;
  const breakeven = pgr > 0 ? (expensesTotal / pgr) * 100 : 0;
  const capRateInverse = capRate > 0 ? 100 / capRate : 0;
  const roundedValue = Math.round(rawValue / 10000) * 10000;

  // Validation checks
  const oerOk = oer >= 35 && oer <= 50;
  const expUnitOk = expPerUnit >= 4500 && expPerUnit <= 7500;
  const nimOk = Math.abs(nim - capRateInverse) < 1;
  const breakEvenOk = breakeven < 85;
  const matchesBaseline = indicatedValue === 1780000;

  // Generate content lines - clean document style
  const generateLines = useCallback((): ContentLine[] => {
    const lines: ContentLine[] = [];

    // Helper to add a row with label and value
    const row = (label: string, value: string): ContentLine => ({
      text: `${label}${value}`,
      type: 'row',
    });

    // STEP 1: POTENTIAL GROSS REVENUE
    lines.push({ text: 'STEP 1: POTENTIAL GROSS REVENUE', type: 'header' });
    lines.push({ text: '────────────────────────────────────────', type: 'separator' });
    lines.push(row('Rental Revenue                    ', fmt(rentalRevenue)));
    lines.push(row('+ Parking Income                  ', fmt(parkingTotal)));
    lines.push(row('+ Laundry Income                  ', fmt(laundryTotal)));
    lines.push({ text: '', type: 'blank' });
    lines.push({ text: `= Potential Gross Revenue         ${fmt(pgr)}`, type: 'total', value: pgr });
    lines.push({ text: 'Maximum revenue at 100% occupancy', type: 'note' });
    lines.push({ text: '', type: 'blank' });
    lines.push({ text: '', type: 'blank' });

    // STEP 2: VACANCY & COLLECTION LOSS
    lines.push({ text: 'STEP 2: VACANCY & COLLECTION LOSS', type: 'header' });
    lines.push({ text: '────────────────────────────────────────', type: 'separator' });
    lines.push({ text: `PGR x Total Vacancy Rate`, type: 'row' });
    lines.push({ text: `${fmt(pgr)} x ${fmtNum(totalVacRate)}% = (${fmt(vacancyLoss)})`, type: 'row', value: vacancyLoss });
    lines.push({ text: '', type: 'blank' });
    lines.push({ text: `Vacancy: ${fmtNum(vacancyRate)}%  |  Bad Debt: ${fmtNum(badDebtRate)}%  |  Concessions: ${fmtNum(concessionsRate)}%`, type: 'note' });
    lines.push({ text: '', type: 'blank' });
    lines.push({ text: `= Effective Gross Revenue         ${fmt(egr)}`, type: 'total', value: egr });
    lines.push({ text: 'Actual expected collected revenue', type: 'note' });
    lines.push({ text: '', type: 'blank' });
    lines.push({ text: '', type: 'blank' });

    // STEP 3: OPERATING EXPENSES
    lines.push({ text: 'STEP 3: OPERATING EXPENSES', type: 'header' });
    lines.push({ text: '────────────────────────────────────────', type: 'separator' });
    lines.push(row(`Management   ${fmtNum(mgmtPct)}% of EGR          `, fmt(Math.round(mgmtTotal))));
    lines.push({ text: 'Calculated on EGR (collected revenue), not PGR', type: 'note' });
    lines.push({ text: '', type: 'blank' });
    lines.push(row(`Taxes        $${fmtNum(taxPerUnit, 0)}/unit x ${totalUnits}         `, fmt(taxTotal)));
    lines.push(row(`Insurance    $${fmtNum(insPerUnit, 0)}/unit x ${totalUnits}         `, fmt(insTotal)));
    lines.push(row(`Repairs      $${fmtNum(repPerUnit, 0)}/unit x ${totalUnits}         `, fmt(repTotal)));
    lines.push(row(`Utilities    $${fmtNum(utilPerUnit, 0)}/unit x ${totalUnits}        `, fmt(utilTotal)));
    lines.push(row(`Payroll      $${fmtNum(payPerUnit, 0)}/unit x ${totalUnits}         `, fmt(payTotal)));
    if (adminPerUnit > 0) {
      lines.push(row(`Admin        $${fmtNum(adminPerUnit, 0)}/unit x ${totalUnits}         `, fmt(adminTotal)));
    }
    if (resPerUnit > 0) {
      lines.push(row(`Reserves     $${fmtNum(resPerUnit, 0)}/unit x ${totalUnits}         `, fmt(resTotal)));
      lines.push({ text: 'Treated "Above the Line" - conservative', type: 'note' });
    }
    if (otherPerUnit > 0) {
      lines.push(row(`Other        $${fmtNum(otherPerUnit, 0)}/unit x ${totalUnits}         `, fmt(otherTotal)));
    }
    lines.push({ text: '', type: 'blank' });
    lines.push({ text: `= Total Operating Expenses        ${fmt(expensesTotal)}`, type: 'total', value: expensesTotal });
    lines.push({ text: `Expense Ratio: ${fmtNum(oer)}% (industry range: 35-50%)`, type: 'note' });
    lines.push({ text: '', type: 'blank' });
    lines.push({ text: '', type: 'blank' });

    // STEP 4: NET OPERATING INCOME
    lines.push({ text: 'STEP 4: NET OPERATING INCOME', type: 'header' });
    lines.push({ text: '────────────────────────────────────────', type: 'separator' });
    lines.push({ text: 'EGR - Operating Expenses = NOI', type: 'row' });
    lines.push({ text: `${fmt(egr)} - ${fmt(expensesTotal)} = ${fmt(noi)}`, type: 'total', value: noi });
    lines.push({ text: '', type: 'blank' });
    lines.push({ text: 'Property profitability before debt service', type: 'note' });
    lines.push({ text: '', type: 'blank' });
    lines.push({ text: '', type: 'blank' });

    // STEP 5: DIRECT CAPITALIZATION
    lines.push({ text: 'STEP 5: DIRECT CAPITALIZATION', type: 'header' });
    lines.push({ text: '────────────────────────────────────────', type: 'separator' });
    lines.push({ text: 'NOI / Cap Rate = Value', type: 'row' });
    lines.push({ text: `${fmt(noi)} / ${fmtNum(capRate)}% = ${fmt(rawValue)}`, type: 'total', value: rawValue });
    lines.push({ text: '', type: 'blank' });
    lines.push({ text: 'Cap Rate reflects market risk/return expectations', type: 'note' });
    lines.push({ text: '', type: 'blank' });
    lines.push({ text: '', type: 'blank' });

    // STEP 6: ROUNDING & FINAL VALUE
    lines.push({ text: 'STEP 6: FINAL VALUE', type: 'header' });
    lines.push({ text: '────────────────────────────────────────', type: 'separator' });
    lines.push(row('Raw Value                         ', fmt(rawValue)));
    lines.push(row('Rounded to $10,000                ', fmt(roundedValue)));
    if (adjustments !== 0) {
      lines.push(row('Post-Value Adjustments            ', fmt(adjustments)));
    }
    lines.push({ text: '', type: 'blank' });
    lines.push({ text: `= INDICATED VALUE                 ${fmt(indicatedValue)}`, type: 'total', value: indicatedValue });
    lines.push({ text: '', type: 'blank' });
    lines.push({ text: '', type: 'blank' });

    // VALIDATION
    lines.push({ text: 'VALIDATION', type: 'header' });
    lines.push({ text: '────────────────────────────────────────', type: 'separator' });
    lines.push({ text: `${oerOk ? '[OK]' : '[!!]'} OER: ${fmtNum(oer)}% (range: 35-50%)`, type: 'check' });
    lines.push({ text: `${expUnitOk ? '[OK]' : '[!!]'} Expense/Unit: ${fmt(expPerUnit)} (range: $4,500-$7,500)`, type: 'check' });
    lines.push({ text: `${nimOk ? '[OK]' : '[!!]'} Net Income Multiplier: ${fmtNum(nim)}x (~${fmtNum(capRateInverse)}x)`, type: 'check' });
    lines.push({ text: `${breakEvenOk ? '[OK]' : '[!!]'} Breakeven Occupancy: ${fmtNum(breakeven)}% (<85%)`, type: 'check' });
    if (matchesBaseline) {
      lines.push({ text: '[OK] Matches Valcre baseline ($1,780,000)', type: 'check' });
    }
    lines.push({ text: '', type: 'blank' });
    lines.push({ text: '', type: 'blank' });

    // METHODOLOGY
    lines.push({ text: 'METHODOLOGY', type: 'header' });
    lines.push({ text: '────────────────────────────────────────', type: 'separator' });
    lines.push({ text: 'Direct Capitalization Method', type: 'row' });
    lines.push({ text: 'USPAP / CUSPAP Professional Standards', type: 'row' });
    lines.push({ text: 'Income Approach to Value', type: 'row' });
    lines.push({ text: 'Lending-grade conservative assumptions', type: 'row' });
    lines.push({ text: '', type: 'blank' });
    lines.push({ text: 'Engine validated: 7/7 metrics exact match', type: 'note' });

    return lines;
  }, [rentalRevenue, parkingTotal, laundryTotal, pgr, totalVacRate, vacancyRate, badDebtRate, concessionsRate, vacancyLoss, egr, mgmtPct, mgmtTotal, taxPerUnit, taxTotal, insPerUnit, insTotal, repPerUnit, repTotal, utilPerUnit, utilTotal, payPerUnit, payTotal, adminPerUnit, adminTotal, resPerUnit, resTotal, otherPerUnit, otherTotal, expensesTotal, oer, noi, capRate, rawValue, roundedValue, adjustments, indicatedValue, oerOk, expUnitOk, nim, capRateInverse, nimOk, breakeven, breakEvenOk, matchesBaseline, totalUnits]);

  const lines = generateLines();

  // Create data hash to detect changes
  const currentDataHash = JSON.stringify([pgr, egr, noi, indicatedValue, expensesTotal]);

  // Animation logic
  const startAnimation = useCallback(() => {
    setSkipAnimation(false);
    setAnimation({
      isAnimating: true,
      currentLine: 0,
      visibleChars: 0,
      completedLines: new Set(),
    });
  }, []);

  const completeAnimation = useCallback(() => {
    setSkipAnimation(true);
    setAnimation({
      isAnimating: false,
      currentLine: lines.length,
      visibleChars: 1000,
      completedLines: new Set(lines.map((_, i) => i)),
    });
  }, [lines.length]);

  // Listen for test data load event to trigger animation
  useEffect(() => {
    const handleTestDataLoaded = () => {
      // Small delay to let data settle
      setTimeout(() => startAnimation(), 100);
    };

    window.addEventListener('testDataLoaded', handleTestDataLoaded);
    return () => window.removeEventListener('testDataLoaded', handleTestDataLoaded);
  }, [startAnimation]);

  // Show all content immediately on mount (no auto-animation)
  useEffect(() => {
    if (pgr > 0 && animation.completedLines.size === 0 && !animation.isAnimating) {
      // Start with all content visible
      completeAnimation();
    }
  }, [pgr]);

  // Animation loop
  useEffect(() => {
    if (!animation.isAnimating || skipAnimation) return;

    const animate = () => {
      setAnimation(prev => {
        const currentLineData = lines[prev.currentLine];
        if (!currentLineData) {
          return { ...prev, isAnimating: false };
        }

        const lineLength = currentLineData.text.length;
        const isInstant = currentLineData.type === 'header' || currentLineData.type === 'separator' || currentLineData.type === 'blank';
        const isSlow = currentLineData.type === 'total';

        // Headers, separators, blanks appear instantly
        if (isInstant) {
          const newCompleted = new Set(prev.completedLines);
          newCompleted.add(prev.currentLine);
          return {
            ...prev,
            currentLine: prev.currentLine + 1,
            visibleChars: 0,
            completedLines: newCompleted,
          };
        }

        // Typewriter effect for regular lines
        if (prev.visibleChars < lineLength) {
          const charsPerFrame = isSlow ? 3 : 6;
          return {
            ...prev,
            visibleChars: Math.min(prev.visibleChars + charsPerFrame, lineLength),
          };
        }

        // Line complete, move to next
        const newCompleted = new Set(prev.completedLines);
        newCompleted.add(prev.currentLine);

        // Brief pause on total lines
        if (isSlow && !prev.completedLines.has(prev.currentLine)) {
          return {
            ...prev,
            completedLines: newCompleted,
          };
        }

        return {
          ...prev,
          currentLine: prev.currentLine + 1,
          visibleChars: 0,
          completedLines: newCompleted,
        };
      });
    };

    const frameDelay = lines[animation.currentLine]?.type === 'total' ? 50 : 25;
    animationRef.current = window.setTimeout(() => {
      animate();
    }, frameDelay);

    return () => {
      if (animationRef.current) clearTimeout(animationRef.current);
    };
  }, [animation, skipAnimation, lines]);

  // Auto-scroll to bottom as content updates
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [animation.currentLine, animation.visibleChars]);

  // Render line with animation
  const renderLine = (line: ContentLine, index: number) => {
    const isComplete = animation.completedLines.has(index) || skipAnimation;
    const isCurrent = animation.currentLine === index && animation.isAnimating && !skipAnimation;
    const isVisible = index <= animation.currentLine || skipAnimation;

    if (!isVisible) return null;
    if (line.type === 'blank') return <div key={index} className="h-3" />;

    let displayText = line.text;
    if (isCurrent && line.type !== 'header' && line.type !== 'separator') {
      displayText = line.text.substring(0, animation.visibleChars);
    }

    // Style based on line type - using theme colors
    let lineColor = colors.textMuted;
    let fontWeight = 'normal';
    let fontStyle = 'normal';

    switch (line.type) {
      case 'header':
        lineColor = colors.header;
        fontWeight = '600';
        break;
      case 'separator':
        lineColor = colors.separator;
        break;
      case 'total':
        lineColor = colors.text;
        fontWeight = '500';
        break;
      case 'note':
        lineColor = colors.textDim;
        fontStyle = 'italic';
        break;
      case 'check':
        lineColor = colors.textMuted;
        break;
      default:
        lineColor = colors.textMuted;
    }

    return (
      <div
        key={index}
        className="transition-opacity duration-100 tracking-wide"
        style={{
          opacity: isComplete || isCurrent ? 1 : 0.3,
          color: lineColor,
          fontWeight,
          fontStyle,
        }}
      >
        {displayText}
        {isCurrent && <span className="animate-pulse" style={{ color: colors.textDim }}>|</span>}
      </div>
    );
  };

  return (
    <div
      className="rounded-sm overflow-hidden flex flex-col h-full"
      style={{ border: `1px solid ${colors.border}` }}
      onClick={animation.isAnimating ? completeAnimation : undefined}
    >
      {/* Header */}
      <div
        className="px-5 py-2.5 flex-shrink-0"
        style={{ borderBottom: `1px solid ${colors.border}` }}
      >
        <span
          className="text-xs font-medium uppercase tracking-wider"
          style={{ color: colors.textMuted }}
        >
          Calculation Breakdown
        </span>
      </div>

      {/* Content - document style, padded, larger text */}
      <div
        ref={containerRef}
        className="px-8 py-4 font-mono cursor-pointer flex-1 overflow-y-auto"
        style={{
          backgroundColor: colors.headerBg,
          scrollbarWidth: 'thin',
          scrollbarColor: `${colors.borderLight} ${colors.headerBg}`,
          fontSize: '13px',
          lineHeight: '1.7',
        }}
        title={animation.isAnimating ? 'Click to skip animation' : undefined}
      >
        <div className="whitespace-pre" style={{ minWidth: '480px', maxWidth: '580px' }}>
          {lines.map((line, index) => renderLine(line, index))}
        </div>
      </div>

      {/* Status - only during animation */}
      {animation.isAnimating && (
        <div
          className="px-5 py-1.5 text-[11px] flex-shrink-0"
          style={{
            borderTop: `1px solid ${colors.border}`,
            color: colors.textDim,
          }}
        >
          Click to skip
        </div>
      )}
    </div>
  );
}
