import { FileText } from "lucide-react";
import { isContractBoundField } from "@/utils/webhooks/docuseal";

// "in LOE" chip (Item 8, 2026-07-16) — marks a job-page field that flows into the Letter of Engagement
// (the signed DocuSeal contract). It renders ONLY when the field is contract-bound per the single
// source of truth, isContractBoundField() / CONTRACT_BOUND_JOB_FIELDS in docuseal.ts (derived from the
// mapJobToDocuSealFields jobField metadata). An unmarked label = the field is not on the contract.
// Because the show/hide decision reads the derived mapping set, the marker can never drift from what
// the contract actually contains.
export function ContractBoundChip({
  field,
  className = "",
}: {
  field: string;
  className?: string;
}) {
  if (!isContractBoundField(field)) return null;
  return (
    <span
      title="This field appears in the Letter of Engagement."
      className={`inline-flex items-center gap-1 rounded-[5px] border border-blue-400/40 bg-blue-500/10 px-1.5 py-px text-[10px] font-semibold leading-none text-blue-600 dark:text-blue-300 ${className}`}
    >
      <FileText className="h-2.5 w-2.5" aria-hidden />
      in LOE
    </span>
  );
}
