import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { 
  Database,
  Download,
  Check,
  AlertCircle,
  RefreshCw,
  TrendingUp,
  Building,
  DollarSign,
  Calendar,
  ExternalLink
} from "lucide-react";
import SmartLink from "./SmartLink";

interface DataGatherProps {
  type: string;
  label: string;
  data?: any;
  status?: string;
  required: boolean;
  onGather: () => void;
  smartLink?: string;
}

const DataGather: React.FC<DataGatherProps> = ({
  type,
  label,
  data,
  status = 'missing',
  required,
  onGather,
  smartLink
}) => {
  const [isGathering, setIsGathering] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleGather = async () => {
    setIsGathering(true);
    // Simulate gathering process
    setTimeout(() => {
      onGather();
      setIsGathering(false);
      setShowDetails(true);
    }, 2000);
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'complete':
        return <Badge variant="success" className="h-5"><Check className="h-3 w-3 mr-1" />Complete</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="h-5">Gathering...</Badge>;
      default:
        return <Badge variant="outline" className="h-5"><AlertCircle className="h-3 w-3 mr-1" />Not gathered</Badge>;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="space-y-2">
      {/* Main Data Row */}
      <div className="flex items-center justify-between p-3 bg-white border rounded-lg hover:bg-gray-50/50 transition-colors">
        <div className="flex items-center gap-3 flex-1">
          {/* Status Icon */}
          <div className="flex items-center justify-center w-8 h-8">
            {data ? (
              <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="h-3 w-3 text-green-600" />
              </div>
            ) : (
              <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center">
                <Database className="h-3 w-3 text-gray-400" />
              </div>
            )}
          </div>

          {/* Data Info */}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{label}</span>
              {required && <span className="text-xs text-red-500">*</span>}
              {getStatusBadge()}
            </div>
            {data && (
              <p className="text-xs text-muted-foreground mt-1">
                Last gathered: {new Date(data.gatheredAt || Date.now()).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Smart Link */}
          {smartLink && <SmartLink url={smartLink} label="View on City Site" />}

          {/* Gather Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleGather}
            disabled={isGathering}
            className="h-7 text-sm"
          >
            {isGathering ? (
              <>
                <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                Gathering...
              </>
            ) : data ? (
              <>
                <RefreshCw className="h-3 w-3 mr-1" />
                Refresh
              </>
            ) : (
              <>
                <Download className="h-3 w-3 mr-1" />
                Gather
              </>
            )}
          </Button>

          {/* Toggle Details */}
          {data && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
              className="h-7 text-sm"
            >
              {showDetails ? 'Hide' : 'Show'} Details
            </Button>
          )}
        </div>
      </div>

      {/* Assessment Data Details */}
      {data && showDetails && (
        <div className="ml-11">
          <Card className="p-4 bg-gray-50 border-gray-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Land Value */}
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-xs text-gray-600">
                  <TrendingUp className="h-3 w-3" />
                  <span>Land Value</span>
                </div>
                <p className="text-sm font-semibold">
                  {formatCurrency(data.landValue || 0)}
                </p>
              </div>

              {/* Building Value */}
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-xs text-gray-600">
                  <Building className="h-3 w-3" />
                  <span>Building Value</span>
                </div>
                <p className="text-sm font-semibold">
                  {formatCurrency(data.buildingValue || 0)}
                </p>
              </div>

              {/* Total Value */}
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-xs text-gray-600">
                  <DollarSign className="h-3 w-3" />
                  <span>Total Assessment</span>
                </div>
                <p className="text-sm font-semibold text-blue-600">
                  {formatCurrency(data.totalValue || (data.landValue + data.buildingValue) || 0)}
                </p>
              </div>

              {/* Year */}
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-xs text-gray-600">
                  <Calendar className="h-3 w-3" />
                  <span>Year</span>
                </div>
                <p className="text-sm font-semibold">
                  {data.year || new Date().getFullYear()}
                </p>
              </div>
            </div>

            {/* Additional Info */}
            {data.splitRatio && (
              <div className="mt-4 pt-3 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Land/Building Split:</span>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-xs">
                      Land: {Math.round((data.landValue / data.totalValue) * 100)}%
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Building: {Math.round((data.buildingValue / data.totalValue) * 100)}%
                    </Badge>
                  </div>
                </div>
              </div>
            )}

            {/* Note about automation */}
            <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
              <p className="flex items-center gap-1">
                <ExternalLink className="h-3 w-3" />
                This data was automatically gathered from the city assessment portal.
                {smartLink && (
                  <span className="ml-1">
                    <a href={smartLink} target="_blank" rel="noopener noreferrer" className="underline">
                      Verify on official site
                    </a>
                  </span>
                )}
              </p>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default DataGather;