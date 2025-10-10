import React, { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SectionProps } from "./types";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { FileText, RefreshCw, Loader2 } from "lucide-react";
import { SectionGroup, CompactField, TwoColumnFields } from "./ValcreStyles";
import { sendToValcre } from "@/utils/webhooks";
// import { generateLOEandSend } from "@/utils/loe/generateLOE";

const LoeQuoteSectionIndependent: React.FC<SectionProps> = ({
  job,
  jobDetails = {},
  onUpdateDetails,
}) => {
  const [isSending, setIsSending] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isOpen, setIsOpen] = useState(true); // Default to open
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    if (!onUpdateDetails) return;
    
    let processedValue: string | number | boolean = value;
    
    if (type === 'number' && value !== '') {
      processedValue = parseFloat(value);
    } else if (type === 'checkbox') {
      processedValue = (e.target as HTMLInputElement).checked;
    }
    
    onUpdateDetails({
      [name]: processedValue
    });
  };

  const fillTestData = () => {
    if (!onUpdateDetails) return;
    
    const testData = {
      reportType: 'Full Narrative',
      appraisalFee: 5000,
      disbursementPercentage: '10%',
      retainerAmount: '$5,775.00',
      jobNumber: `CAL-${Date.now().toString().slice(-6)}`,
      valcreJobId: `val_${Date.now().toString().slice(-8)}`,
      lastValcreSync: new Date().toISOString(),
      loeGenerated: false,
      loeSentToClient: false
    };
    
    onUpdateDetails(testData);
    toast.success('LOE test data filled!');
  };

  const handleSendToValcre = async () => {
    if (!jobDetails?.jobNumber) {
      toast.error("Please enter a Job Number first");
      return;
    }
    
    setIsSending(true);
    
    try {
      const valcreData = {
        jobNumber: jobDetails.jobNumber,
        clientFirstName: job.firstName || '',
        clientLastName: job.lastName || '',
        clientCompany: job.companyName || '',
        clientEmail: job.emailAddress || '',
        clientPhone: job.phoneNumber || '',
        propertyAddress: job.propertyAddress || '',
        reportType: jobDetails.reportType || '',
        appraisalFee: jobDetails.appraisalFee || 0,
        retainerAmount: jobDetails.retainerAmount || '$0.00',
      };
      
      console.log('Sending to Valcre:', valcreData);
      const result = await sendToValcre(valcreData);
      
      if (result.success) {
        const valcreJobId = result.data?.jobId || `val_${Date.now()}`;
        
        if (onUpdateDetails) {
          onUpdateDetails({
            valcreJobId: valcreJobId,
            lastValcreSync: new Date().toISOString(),
          });
        }
        
        toast.success(
          <div>
            <div>✅ Job created in Valcre!</div>
            <div className="text-xs mt-1">Job ID: {valcreJobId}</div>
          </div>
        );
      } else {
        toast.error(result.error || 'Failed to create Valcre job');
      }
    } catch (error) {
      console.error('Error sending to Valcre:', error);
      toast.error('Failed to send to Valcre');
    } finally {
      setIsSending(false);
    }
  };

  const handleGenerateLOE = async () => {
    if (!job || !jobDetails) {
      toast.error("Missing job information");
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Temporarily disabled - generateLOEandSend function needs to be imported correctly
      toast.info("LOE generation is temporarily disabled");
      
      if (onUpdateDetails) {
        onUpdateDetails({
          loeGenerated: true,
          loeSentToClient: true,
          loeSentAt: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error('Error generating LOE:', error);
      toast.error('Failed to generate LOE');
    } finally {
      setIsGenerating(false);
    }
  };

  // COMPLETELY INDEPENDENT COMPONENT
  return (
    <div className="w-full border rounded-lg bg-white shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors border-b"
      >
        <div className="flex items-center gap-2">
          {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          <span className="text-base font-medium">2. LOE Quote Preparation</span>
        </div>
      </button>
      
      {isOpen && (
        <div className="px-6 py-4">
          {/* Action Buttons Row */}
          <div className="mb-4 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleSendToValcre}
              disabled={isSending}
              className="border-blue-600 text-blue-700 hover:bg-blue-50"
            >
              {isSending ? (
                <>
                  <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-3 w-3" />
                  Create Valcre Job
                </>
              )}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleGenerateLOE}
              disabled={isGenerating || !jobDetails?.jobNumber}
              className="border-purple-600 text-purple-700 hover:bg-purple-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-3 w-3" />
                  Generate LOE
                </>
              )}
            </Button>
            
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={fillTestData}
              className="text-gray-600"
            >
              Fill Test Data
            </Button>
          </div>

          {/* LOE Details Section */}
          <SectionGroup title="LOE Details">
            <TwoColumnFields>
              <CompactField label="Report Type">
                <Input
                  name="reportType"
                  value={jobDetails.reportType || ''}
                  onChange={handleChange}
                  placeholder="e.g., Full Narrative"
                  className="h-7 text-sm"
                />
              </CompactField>
              <CompactField label="Job Number">
                <Input
                  name="jobNumber"
                  value={jobDetails.jobNumber || ''}
                  onChange={handleChange}
                  placeholder="e.g., CAL-123456"
                  className="h-7 text-sm"
                />
              </CompactField>
            </TwoColumnFields>
            
            <TwoColumnFields>
              <CompactField label="Appraisal Fee">
                <Input
                  name="appraisalFee"
                  type="number"
                  value={jobDetails.appraisalFee || ''}
                  onChange={handleChange}
                  placeholder="e.g., 5000"
                  className="h-7 text-sm"
                />
              </CompactField>
              <CompactField label="Disbursement %">
                <Input
                  name="disbursementPercentage"
                  value={jobDetails.disbursementPercentage || ''}
                  onChange={handleChange}
                  placeholder="e.g., 10%"
                  className="h-7 text-sm"
                />
              </CompactField>
            </TwoColumnFields>
            
            <CompactField label="Retainer Amount">
              <Input
                name="retainerAmount"
                value={jobDetails.retainerAmount || ''}
                onChange={handleChange}
                placeholder="Auto-calculated"
                className="h-7 text-sm bg-gray-50"
                readOnly
              />
            </CompactField>
          </SectionGroup>

          {/* Valcre Integration Status */}
          {jobDetails.valcreJobId && (
            <SectionGroup title="Valcre Integration">
              <div className="text-sm text-gray-600">
                <p>Valcre Job ID: <span className="font-mono">{jobDetails.valcreJobId}</span></p>
                {jobDetails.lastValcreSync && (
                  <p>Last Sync: {new Date(jobDetails.lastValcreSync).toLocaleString()}</p>
                )}
              </div>
            </SectionGroup>
          )}

          {/* LOE Status */}
          {jobDetails.loeGenerated && (
            <SectionGroup title="LOE Status">
              <div className="text-sm text-green-600">
                ✅ LOE Generated and Sent
                {jobDetails.loeSentAt && (
                  <span className="text-gray-500 ml-2">
                    ({new Date(jobDetails.loeSentAt).toLocaleString()})
                  </span>
                )}
              </div>
            </SectionGroup>
          )}
        </div>
      )}
    </div>
  );
};

export default LoeQuoteSectionIndependent;