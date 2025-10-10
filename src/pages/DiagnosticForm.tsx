import React, { useState } from "react";
import { Button } from "@/components/ui/button";

const DiagnosticForm = () => {
  const [formData, setFormData] = useState({
    propertyType: "",
    intendedUse: "",
    assetCondition: ""
  });
  
  const [log, setLog] = useState<string[]>([]);
  
  const addLog = (message: string) => {
    setLog(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };
  
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    addLog(`SELECT CHANGED: ${name} = "${value}"`);
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      addLog(`STATE UPDATED: ${name} = "${newData[name as keyof typeof newData]}"`);
      return newData;
    });
  };
  
  const testData = {
    propertyType: "Commercial Office",
    intendedUse: "Financing",
    assetCondition: "Good"
  };
  
  const handleAutoFill = () => {
    addLog("AUTO-FILL CLICKED");
    setFormData(testData);
    addLog(`STATE SET TO: ${JSON.stringify(testData)}`);
  };
  
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Diagnostic Form - Debug Dropdowns</h1>
      
      <div className="grid grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="space-y-4 border p-4 rounded">
          <h2 className="font-semibold">Test Form</h2>
          
          <div>
            <label className="block mb-2">Property Type (Native Select)</label>
            <select
              name="propertyType"
              value={formData.propertyType}
              onChange={handleSelectChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Select property type</option>
              <option value="Commercial Office">Commercial Office</option>
              <option value="Retail Plaza">Retail Plaza</option>
              <option value="Multi-Family">Multi-Family</option>
            </select>
            <div className="text-sm mt-1 text-blue-600">
              Current value: "{formData.propertyType}"
            </div>
          </div>
          
          <div>
            <label className="block mb-2">Intended Use (Native Select)</label>
            <select
              name="intendedUse"
              value={formData.intendedUse}
              onChange={handleSelectChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Select intended use</option>
              <option value="Financing">Financing</option>
              <option value="Refinancing">Refinancing</option>
              <option value="Purchase/Sale">Purchase/Sale</option>
            </select>
            <div className="text-sm mt-1 text-blue-600">
              Current value: "{formData.intendedUse}"
            </div>
          </div>
          
          <div>
            <label className="block mb-2">Asset Condition (Native Select)</label>
            <select
              name="assetCondition"
              value={formData.assetCondition}
              onChange={handleSelectChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Select condition</option>
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Poor">Poor</option>
            </select>
            <div className="text-sm mt-1 text-blue-600">
              Current value: "{formData.assetCondition}"
            </div>
          </div>
          
          <Button onClick={handleAutoFill} className="w-full">
            Auto-Fill Test Data
          </Button>
          
          <div className="mt-4 p-2 bg-gray-100 rounded">
            <strong>Current State:</strong>
            <pre className="text-xs mt-2">{JSON.stringify(formData, null, 2)}</pre>
          </div>
        </div>
        
        {/* Log Section */}
        <div className="border p-4 rounded">
          <h2 className="font-semibold mb-2">Event Log</h2>
          <div className="space-y-1 text-sm font-mono h-96 overflow-y-auto">
            {log.length === 0 ? (
              <div className="text-gray-500">No events yet. Try selecting dropdowns or clicking Auto-Fill.</div>
            ) : (
              log.map((entry, i) => (
                <div key={i} className="border-b pb-1">{entry}</div>
              ))
            )}
          </div>
          <Button 
            onClick={() => setLog([])} 
            variant="outline" 
            className="mt-2 w-full"
          >
            Clear Log
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DiagnosticForm;