import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  fieldRegistry,
  getAllSections,
  getFieldsBySection,
  getSubsectionsForSection,
  getFieldsBySubsection,
  FieldDefinition
} from '../report-builder/schema/fieldRegistry';
import { useReportBuilderStore } from '../report-builder/store/reportBuilderStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, ExternalLink, Calculator, Database, RefreshCw } from 'lucide-react';
import ImageFieldInput from './components/ImageFieldInput';

type FieldStatus = 'mapped' | 'empty' | 'missing';

interface FieldStatusInfo {
  field: FieldDefinition;
  status: FieldStatus;
  storeValue: any;
}

const TestInputDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { sections, updateFieldValue, runCalculations, loadFullTestData, initializeMockData } = useReportBuilderStore();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['cover']));
  const [expandedValuations, setExpandedValuations] = useState<Set<string>>(new Set(['cost', 'sales', 'income']));
  const [localValues, setLocalValues] = useState<Record<string, any>>({});

  // Initialize store on mount if sections are empty
  useEffect(() => {
    if (sections.length === 0) {
      console.log('TestInputDashboard: Initializing store...');
      initializeMockData();
    }
  }, [sections.length, initializeMockData]);

  // Section names with numbered prefixes for easy cross-reference with Report Builder
  const sectionNameMapping: Record<string, string> = {
    // V3 Operational Sections (mirrors deployed V3 Dashboard)
    'client-intake': 'S1 - CLIENT INTAKE (V3)',
    'loe-prep': 'S2 - LOE PREP (V3)',
    'image-mgt': 'S3 - IMAGE MANAGEMENT',
    // Report Builder Sections
    'cover': '01 - COVER PAGE',
    'home': '02 - INTRODUCTION LETTER',
    'maps': '03 - LOCATION MAPS',
    'assignment': '04 - IDENTIFICATION OF ASSIGNMENT',
    'report': '05 - REPORT INFORMATION',
    'exec': '06 - EXECUTIVE SUMMARY',
    'photos': '07 - PROPERTY PHOTOGRAPHS',
    'site': '08 - SITE DETAILS',
    'location': '09 - LOCATION ANALYSIS',
    'tax': '10 - PROPERTY TAXES',
    'market': '11 - MARKET ANALYSIS',
    'impv': '12 - IMPROVEMENTS',
    'zone': '13 - ZONING',
    'hbu': '14 - HIGHEST & BEST USE',
    'calc': '15 - VALUATIONS (All 3 Approaches)',
    'land1': '16 - LAND VALUE',
    'cost-s': '17 - COST APPROACH',
    'sales': '18 - SALES COMPARISON',
    'income': '19 - INCOME APPROACH',
    'rental-survey': '20 - RENTAL SURVEY',
    'recon': '21 - RECONCILIATION',
    'cert': '22 - CERTIFICATION'
  };

  // Subsection name mapping for image-mgt
  const subsectionNameMapping: Record<string, string> = {
    'cover-images': 'COVER & SIGNATURE',
    'maps': 'MAPS',
    'exterior-photos': 'EXTERIOR PHOTOS',
    'street-photos': 'STREET VIEWS',
    'common-photos': 'COMMON AREAS',
    'unit-photos': 'UNIT INTERIORS',
    'systems-photos': 'BUILDING SYSTEMS'
  };

  // Helper function to categorize fields as inputs or outputs
  const categorizeValuationFields = (fields: FieldDefinition[]): { inputs: FieldDefinition[], outputs: FieldDefinition[] } => {
    return {
      inputs: fields.filter(f => f.inputSource === 'user-input' || f.inputSource === 'auto-filled'),
      outputs: fields.filter(f => f.inputSource === 'calculated')
    };
  };

  // Get value from store by traversing sections/subsections
  const getStoreValue = (storeId: string): any => {
    for (const section of sections) {
      // Check section fields
      for (const field of section.fields) {
        if (field.id === storeId) return field.value;
      }
      // Check subsection fields
      for (const subsection of section.subsections || []) {
        for (const field of subsection.fields) {
          if (field.id === storeId) return field.value;
        }
      }
    }
    return undefined;
  };

  // Get field status
  const getFieldStatus = (field: FieldDefinition): FieldStatusInfo => {
    const storeValue = getStoreValue(field.storeId);

    // Missing: undefined or null
    if (storeValue === undefined || storeValue === null) {
      return { field, status: 'missing', storeValue: undefined };
    }

    // Empty strings are truly empty
    if (typeof storeValue === 'string' && storeValue.trim() === '') {
      return { field, status: 'empty', storeValue };
    }

    // Empty arrays are empty
    if (Array.isArray(storeValue) && storeValue.length === 0) {
      return { field, status: 'empty', storeValue };
    }

    // Everything else (including 0) is mapped
    return { field, status: 'mapped', storeValue };
  };

  // Calculate statistics
  const stats = useMemo(() => {
    let total = 0;
    let mapped = 0;
    let empty = 0;
    let missing = 0;

    fieldRegistry.forEach(field => {
      total++;
      const status = getFieldStatus(field);
      if (status.status === 'mapped') mapped++;
      else if (status.status === 'empty') empty++;
      else missing++;
    });

    const percentage = total > 0 ? Math.round((mapped / total) * 100) : 0;

    return { total, mapped, empty, missing, percentage };
  }, [sections]);

  // Log on mount and stats change
  useEffect(() => {
    console.log(`Test Data Dashboard: ${stats.mapped}/${stats.total} fields mapped (${stats.percentage}%)`);
  }, [stats]);

  // Toggle section expansion
  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  // Toggle valuation approach accordion
  const toggleValuation = (valuationId: string) => {
    setExpandedValuations(prev => {
      const newSet = new Set(prev);
      if (newSet.has(valuationId)) {
        newSet.delete(valuationId);
      } else {
        newSet.add(valuationId);
      }
      return newSet;
    });
  };

  // Handle field value change
  const handleFieldChange = (field: FieldDefinition, value: any) => {
    setLocalValues(prev => ({ ...prev, [field.storeId]: value }));
    updateFieldValue(field.storeId, value);
  };

  // Get current value (local or store)
  const getCurrentValue = (field: FieldDefinition): any => {
    if (localValues[field.storeId] !== undefined) {
      return localValues[field.storeId];
    }
    return getStoreValue(field.storeId) || '';
  };

  // Render input field based on type
  const renderInput = (field: FieldDefinition, statusInfo: FieldStatusInfo) => {
    const currentValue = getCurrentValue(field);

    switch (field.type) {
      case 'number':
      case 'currency':
      case 'percentage':
        return (
          <Input
            type="number"
            value={currentValue || ''}
            onChange={(e) => handleFieldChange(field, Number(e.target.value))}
            className="w-32 h-8 text-sm"
            placeholder={field.type === 'currency' ? '$0' : field.type === 'percentage' ? '0%' : '0'}
          />
        );

      case 'date':
        return (
          <Input
            type="date"
            value={currentValue || ''}
            onChange={(e) => handleFieldChange(field, e.target.value)}
            className="w-36 h-8 text-sm"
          />
        );

      case 'select':
        return (
          <select
            value={currentValue || ''}
            onChange={(e) => handleFieldChange(field, e.target.value)}
            className="w-48 h-8 text-sm border rounded px-2"
          >
            <option value="">Select...</option>
            {field.options?.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        );

      case 'textarea':
        return (
          <Input
            type="text"
            value={currentValue || ''}
            onChange={(e) => handleFieldChange(field, e.target.value)}
            className="w-64 h-8 text-sm"
            placeholder="Text..."
          />
        );

      case 'image':
        return (
          <div className="flex flex-col gap-0">
            <ImageFieldInput
              value={currentValue || ''}
              onChange={(url) => handleFieldChange(field, url)}
              placeholder="Drop image or click to upload"
            />
            <div className="text-[10px] text-slate-400 mt-0.5">{field.id}</div>
          </div>
        );

      default: // text
        return (
          <Input
            type="text"
            value={currentValue || ''}
            onChange={(e) => handleFieldChange(field, e.target.value)}
            className="w-64 h-8 text-sm"
          />
        );
    }
  };

  // Render status badge
  const renderStatusBadge = (status: FieldStatus) => {
    switch (status) {
      case 'mapped':
        return <Badge className="bg-green-500 text-white text-xs">Mapped</Badge>;
      case 'empty':
        return <Badge className="bg-yellow-500 text-white text-xs">Empty</Badge>;
      case 'missing':
        return <Badge className="bg-red-500 text-white text-xs">Missing</Badge>;
    }
  };

  // Preview in builder - use React Router navigation to preserve store state
  const handlePreview = () => {
    // Run calculations before navigating to ensure preview is up to date
    runCalculations();
    // Use React Router navigate (preserves Zustand store state)
    // Route is /mock-builder not /report-builder
    navigate('/mock-builder');
  };

  // Run calculations
  const handleRunCalculations = () => {
    runCalculations();
    console.log('Calculations triggered');
  };

  // Group fields by section
  const allSections = getAllSections();

  return (
    <div className="min-h-screen bg-slate-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-slate-800">TEST DATA INPUT DASHBOARD</h1>

            {/* Stats Bar */}
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-slate-600">Total:</span>
                <span className="font-bold text-slate-800">{stats.total}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-600">Mapped:</span>
                <Badge className="bg-green-500 text-white">{stats.mapped}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-600">Empty:</span>
                <Badge className="bg-yellow-500 text-white">{stats.empty}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-600">Missing:</span>
                <Badge className="bg-red-500 text-white">{stats.missing}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-600">Coverage:</span>
                <span className="font-bold text-slate-800">{stats.percentage}%</span>
              </div>
            </div>
          </div>

          {/* Actions Bar */}
          <div className="flex gap-2">
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              size="sm"
              className="gap-2"
              title="Hard refresh the page"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
            <Button
              onClick={() => {
                try {
                  console.log('Button clicked - calling loadFullTestData...');
                  console.log('Sections BEFORE:', sections.length, 'sections');
                  console.log('First field ID in store:', sections[0]?.fields[0]?.id);
                  console.log('First storeId in registry:', fieldRegistry[0]?.storeId);

                  loadFullTestData();

                  console.log('loadFullTestData completed');
                  console.log('Sections reference same?', sections === useReportBuilderStore.getState().sections);

                  // Force check after load
                  const freshSections = useReportBuilderStore.getState().sections;
                  const testField = freshSections[0]?.fields.find(f => f.id === 'property-name');
                  console.log('property-name field value after load:', testField?.value);

                  alert('Test data loaded! Check console for details.');
                } catch (error) {
                  console.error('Error loading test data:', error);
                  alert('Error: ' + String(error));
                }
              }}
              variant="default"
              size="sm"
              className="gap-2 bg-green-600 hover:bg-green-700"
            >
              <Database className="w-4 h-4" />
              Load Test Data
            </Button>
            <Button
              onClick={handlePreview}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Preview in Builder
            </Button>
            <Button
              onClick={handleRunCalculations}
              variant="default"
              size="sm"
              className="gap-2"
            >
              <Calculator className="w-4 h-4" />
              Run Calculations
            </Button>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-2">
          {allSections.map(sectionId => {
            const fields = getFieldsBySection(sectionId);
            if (fields.length === 0) return null;

            const isExpanded = expandedSections.has(sectionId);
            const sectionName = sectionNameMapping[sectionId] || sectionId.toUpperCase();

            return (
              <Collapsible
                key={sectionId}
                open={isExpanded}
                onOpenChange={() => toggleSection(sectionId)}
              >
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <CollapsibleTrigger className="w-full">
                    <div className="flex items-center justify-between p-4 hover:bg-slate-50 cursor-pointer">
                      <div className="flex items-center gap-2">
                        {isExpanded ? (
                          <ChevronDown className="w-5 h-5 text-slate-600" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-slate-600" />
                        )}
                        <h2 className="text-lg font-semibold text-slate-800">
                          {sectionName}
                        </h2>
                        <Badge variant="outline" className="text-xs">
                          {fields.length} fields
                        </Badge>
                      </div>
                    </div>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <div className="border-t border-slate-200">
                      {/* Special rendering for Calculator tab - consolidated valuations view */}
                      {sectionId === 'calc' ? (
                        <div className="space-y-4 p-4">
                          {/* 17 - Cost Approach */}
                          <Collapsible
                            open={expandedValuations.has('cost')}
                            onOpenChange={() => toggleValuation('cost')}
                          >
                            <div className="border rounded-lg overflow-hidden">
                              <CollapsibleTrigger className="w-full">
                                <div className="bg-amber-50 px-4 py-2 border-b hover:bg-amber-100 cursor-pointer flex items-center gap-2">
                                  {expandedValuations.has('cost') ? (
                                    <ChevronDown className="w-4 h-4 text-amber-800" />
                                  ) : (
                                    <ChevronRight className="w-4 h-4 text-amber-800" />
                                  )}
                                  <h3 className="text-sm font-semibold text-amber-800">🏗️ 17-Cost Approach</h3>
                                  <Badge variant="outline" className="text-xs ml-auto">
                                    {getFieldsBySection('cost-s').length} fields
                                  </Badge>
                                </div>
                              </CollapsibleTrigger>
                              <CollapsibleContent>
                                <div className="space-y-3 p-4">
                                  {(() => {
                                    const costFields = getFieldsBySection('cost-s');
                                    return (
                                      <div className="space-y-2">
                                        <table className="w-full text-sm">
                                          <tbody>
                                            {costFields.map(field => {
                                              const statusInfo = getFieldStatus(field);
                                              return (
                                                <tr key={field.id} className="border-b border-slate-100 hover:bg-slate-50">
                                                  <td className="px-2 py-1.5 text-xs font-mono text-slate-500 w-48">{field.storeId}</td>
                                                  <td className="px-2 py-1.5 text-sm">{field.label}</td>
                                                  <td className="px-2 py-1.5">{renderInput(field, statusInfo)}</td>
                                                  <td className="px-2 py-1.5 w-20">{renderStatusBadge(statusInfo.status)}</td>
                                                </tr>
                                              );
                                            })}
                                          </tbody>
                                        </table>
                                      </div>
                                    );
                                  })()}
                                </div>
                              </CollapsibleContent>
                            </div>
                          </Collapsible>

                          {/* 18 - Sales Comparison Approach */}
                          <Collapsible
                            open={expandedValuations.has('sales')}
                            onOpenChange={() => toggleValuation('sales')}
                          >
                            <div className="border rounded-lg overflow-hidden">
                              <CollapsibleTrigger className="w-full">
                                <div className="bg-blue-50 px-4 py-2 border-b hover:bg-blue-100 cursor-pointer flex items-center gap-2">
                                  {expandedValuations.has('sales') ? (
                                    <ChevronDown className="w-4 h-4 text-blue-800" />
                                  ) : (
                                    <ChevronRight className="w-4 h-4 text-blue-800" />
                                  )}
                                  <h3 className="text-sm font-semibold text-blue-800">📈 18-Sales Comparison Approach</h3>
                                  <Badge variant="outline" className="text-xs ml-auto">
                                    {getFieldsBySection('sales').length} fields
                                  </Badge>
                                </div>
                              </CollapsibleTrigger>
                              <CollapsibleContent>
                                <div className="space-y-3 p-4">
                                  {(() => {
                                    const salesFields = getFieldsBySection('sales');
                                    const { inputs, outputs } = categorizeValuationFields(salesFields);
                                    return (
                                      <>
                                        {/* Inputs */}
                                        <div className="space-y-2">
                                          <div className="text-xs font-semibold text-slate-600 pb-1 border-b">📝 INPUTS ({inputs.length} fields)</div>
                                          <table className="w-full text-sm">
                                            <tbody>
                                              {inputs.map(field => {
                                                const statusInfo = getFieldStatus(field);
                                                return (
                                                  <tr key={field.id} className="border-b border-slate-100 hover:bg-slate-50">
                                                    <td className="px-2 py-1.5 text-xs font-mono text-slate-500 w-48">{field.storeId}</td>
                                                    <td className="px-2 py-1.5 text-sm">{field.label}</td>
                                                    <td className="px-2 py-1.5">{renderInput(field, statusInfo)}</td>
                                                    <td className="px-2 py-1.5 w-20">{renderStatusBadge(statusInfo.status)}</td>
                                                  </tr>
                                                );
                                              })}
                                            </tbody>
                                          </table>
                                        </div>
                                        {/* Outputs */}
                                        <div className="space-y-2">
                                          <div className="text-xs font-semibold text-slate-600 pb-1 border-b">🔢 OUTPUTS ({outputs.length} calculated fields)</div>
                                          <table className="w-full text-sm">
                                            <tbody>
                                              {outputs.map(field => {
                                                const statusInfo = getFieldStatus(field);
                                                return (
                                                  <tr key={field.id} className="border-b border-slate-100 hover:bg-slate-50 bg-slate-50">
                                                    <td className="px-2 py-1.5 text-xs font-mono text-slate-500 w-48">{field.storeId}</td>
                                                    <td className="px-2 py-1.5 text-sm font-medium">{field.label}</td>
                                                    <td className="px-2 py-1.5">{renderInput(field, statusInfo)}</td>
                                                    <td className="px-2 py-1.5 w-20">{renderStatusBadge(statusInfo.status)}</td>
                                                  </tr>
                                                );
                                              })}
                                            </tbody>
                                          </table>
                                        </div>
                                      </>
                                    );
                                  })()}
                                </div>
                              </CollapsibleContent>
                            </div>
                          </Collapsible>

                          {/* 19 - Income Approach */}
                          <Collapsible
                            open={expandedValuations.has('income')}
                            onOpenChange={() => toggleValuation('income')}
                          >
                            <div className="border rounded-lg overflow-hidden">
                              <CollapsibleTrigger className="w-full">
                                <div className="bg-emerald-50 px-4 py-2 border-b hover:bg-emerald-100 cursor-pointer flex items-center gap-2">
                                  {expandedValuations.has('income') ? (
                                    <ChevronDown className="w-4 h-4 text-emerald-800" />
                                  ) : (
                                    <ChevronRight className="w-4 h-4 text-emerald-800" />
                                  )}
                                  <h3 className="text-sm font-semibold text-emerald-800">💰 19-Income Approach</h3>
                                  <Badge variant="outline" className="text-xs ml-auto">
                                    {getFieldsBySection('calc').length + getFieldsBySection('income').length} fields
                                  </Badge>
                                </div>
                              </CollapsibleTrigger>
                              <CollapsibleContent>
                            <div className="space-y-3 p-4">
                              {(() => {
                                // Combine calc section (calculations) and income section (narratives/conclusions)
                                const calcFields = getFieldsBySection('calc');
                                const incomeNarrativeFields = getFieldsBySection('income');
                                const incomeFields = [...calcFields, ...incomeNarrativeFields];
                                const { inputs, outputs } = categorizeValuationFields(incomeFields);
                                return (
                                  <>
                                    {/* Inputs */}
                                    <div className="space-y-2">
                                      <div className="text-xs font-semibold text-slate-600 pb-1 border-b">📝 INPUTS ({inputs.length} fields)</div>
                                      <table className="w-full text-sm">
                                        <tbody>
                                          {inputs.map(field => {
                                            const statusInfo = getFieldStatus(field);
                                            return (
                                              <tr key={field.id} className="border-b border-slate-100 hover:bg-slate-50">
                                                <td className="px-2 py-1.5 text-xs font-mono text-slate-500 w-48">{field.storeId}</td>
                                                <td className="px-2 py-1.5 text-sm">{field.label}</td>
                                                <td className="px-2 py-1.5">{renderInput(field, statusInfo)}</td>
                                                <td className="px-2 py-1.5 w-20">{renderStatusBadge(statusInfo.status)}</td>
                                              </tr>
                                            );
                                          })}
                                        </tbody>
                                      </table>
                                    </div>
                                    {/* Outputs */}
                                    <div className="space-y-2">
                                      <div className="text-xs font-semibold text-slate-600 pb-1 border-b">🔢 OUTPUTS ({outputs.length} calculated fields)</div>
                                      <table className="w-full text-sm">
                                        <tbody>
                                          {outputs.map(field => {
                                            const statusInfo = getFieldStatus(field);
                                            return (
                                              <tr key={field.id} className="border-b border-slate-100 hover:bg-slate-50 bg-slate-50">
                                                <td className="px-2 py-1.5 text-xs font-mono text-slate-500 w-48">{field.storeId}</td>
                                                <td className="px-2 py-1.5 text-sm font-medium">{field.label}</td>
                                                <td className="px-2 py-1.5">{renderInput(field, statusInfo)}</td>
                                                <td className="px-2 py-1.5 w-20">{renderStatusBadge(statusInfo.status)}</td>
                                              </tr>
                                            );
                                          })}
                                        </tbody>
                                      </table>
                                    </div>
                                  </>
                                );
                              })()}
                            </div>
                              </CollapsibleContent>
                            </div>
                          </Collapsible>
                        </div>
                      ) : sectionId === 'image-mgt' ? (
                        <div className="space-y-4 p-4">
                          {getSubsectionsForSection(sectionId).map(subsectionId => {
                            const subsectionFields = getFieldsBySubsection(sectionId, subsectionId);
                            const subsectionName = subsectionNameMapping[subsectionId] || subsectionId.toUpperCase();
                            return (
                              <div key={subsectionId} className="border rounded-lg overflow-hidden">
                                <div className="bg-blue-50 px-4 py-2 border-b">
                                  <h3 className="text-sm font-semibold text-blue-800">{subsectionName}</h3>
                                </div>
                                <div className="grid grid-cols-2 gap-4 p-4">
                                  {subsectionFields.map(field => {
                                    const statusInfo = getFieldStatus(field);
                                    return (
                                      <div key={field.id} className="flex flex-col gap-1">
                                        <label className="text-xs text-slate-600 font-medium">
                                          {field.label}
                                        </label>
                                        <div className="flex items-center gap-2">
                                          {renderInput(field, statusInfo)}
                                          {renderStatusBadge(statusInfo.status)}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <table className="w-full">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                              <th className="text-left text-xs font-semibold text-slate-600 px-4 py-2 w-48">Field ID</th>
                              <th className="text-left text-xs font-semibold text-slate-600 px-4 py-2">Label</th>
                              <th className="text-left text-xs font-semibold text-slate-600 px-4 py-2">Value</th>
                              <th className="text-left text-xs font-semibold text-slate-600 px-4 py-2 w-24">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {fields.map(field => {
                              const statusInfo = getFieldStatus(field);
                              return (
                                <tr
                                  key={field.id}
                                  className="border-b border-slate-100 hover:bg-slate-50"
                                >
                                  <td className="px-4 py-2 text-xs font-mono text-slate-600">
                                    {field.storeId}
                                  </td>
                                  <td className="px-4 py-2 text-sm text-slate-800">
                                    {field.label}
                                    {field.required && (
                                      <span className="text-red-500 ml-1">*</span>
                                    )}
                                  </td>
                                  <td className="px-4 py-2">
                                    {renderInput(field, statusInfo)}
                                  </td>
                                  <td className="px-4 py-2">
                                    {renderStatusBadge(statusInfo.status)}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TestInputDashboard;
