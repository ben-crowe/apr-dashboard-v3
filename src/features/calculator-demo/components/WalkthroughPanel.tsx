/**
 * Walkthrough Panel - Step-by-Step Calculation Breakdown
 *
 * Shows HOW each result is calculated with formulas and intermediate values.
 * This is the key innovation - provides full transparency into the calculation methodology.
 */

import { useCalculationSteps } from '../hooks/useCalculationSteps';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function WalkthroughPanel() {
  const stepGroups = useCalculationSteps();

  return (
    <div className="max-h-[600px] overflow-y-auto">
      <Accordion type="multiple" defaultValue={['pgr', 'vacancy', 'noi', 'capitalization', 'final']} className="space-y-3">
        {stepGroups.map((group, groupIndex) => (
          <AccordionItem key={group.id} value={group.id} className="border rounded-lg overflow-hidden">
            <AccordionTrigger className="px-4 py-3 hover:bg-slate-50 font-semibold text-sm">
              <div className="flex items-center justify-between w-full pr-4">
                <span>{group.title}</span>
                {group.summary && (
                  <Badge variant="secondary" className="ml-auto mr-2">
                    {group.summary}
                  </Badge>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 py-3 bg-slate-50">
              <div className="space-y-3">
                {group.steps.map((step) => (
                  <Card key={step.id} className="p-4 border-l-4 border-l-blue-500">
                    <div className="space-y-2">
                      {/* Label */}
                      <p className="font-medium text-sm text-slate-700">{step.label}</p>

                      {/* Formula */}
                      <div className="bg-slate-100 p-3 rounded font-mono text-sm text-slate-800">
                        {step.formula}
                      </div>

                      {/* Inputs */}
                      {step.inputs.length > 0 && (
                        <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                          {step.inputs.map((input, idx) => (
                            <div key={idx} className="flex justify-between">
                              <span>{input.name}:</span>
                              <span className="font-medium">
                                {input.value.toLocaleString()} {input.unit}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Result */}
                      <div className="pt-2 border-t">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-slate-600">Result:</span>
                          <span className="text-lg font-bold text-blue-700">
                            {step.resultFormatted}
                          </span>
                        </div>
                      </div>

                      {/* Explanation */}
                      {step.explanation && (
                        <p className="text-xs text-slate-600 italic">{step.explanation}</p>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
