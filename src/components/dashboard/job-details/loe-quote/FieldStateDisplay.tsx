import React from "react";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { JobDetails } from "@/types/job";

// Item 4 — the three-state blank rule. An empty field now reads as ONE of three things at a glance
// instead of the old ambiguous blank. The classification (which state a field is in) is authored from
// domain reason and committed in ITEM4-FIELD-STATE-MAP.md; this module renders it. See that map before
// changing any state here — a blank in the wrong state is a silent defect.

export type FieldState = "filled" | "na" | "auto" | "action";

const has = (v: unknown) => v !== undefined && v !== null && String(v).trim() !== "";

/**
 * Resolve the empty-state of one LOE/Quote or Payment field from the job data. The Retainer Paid field
 * is CONDITIONAL — its state is picked by whether the job has a retainer and whether it is paid, in that
 * order (qa2 spec-gate F5). Every other field maps to a single empty-state.
 */
export function resolveQuoteFieldState(
  field: string,
  jd: JobDetails,
): { state: FieldState; reason?: string; tooltip?: string } {
  switch (field) {
    case "paymentAmount":
      return has(jd.paymentAmount)
        ? { state: "filled" }
        : {
            state: "auto",
            tooltip:
              "Fills when e-payment received. This amount is stamped automatically once the client's payment clears — no need to enter it by hand.",
          };
    case "paymentPaidDate":
      return has(jd.paymentPaidDate)
        ? { state: "filled" }
        : {
            state: "auto",
            tooltip: "Fills when e-payment received. Stamped automatically the moment the payment clears.",
          };
    case "signedDate":
      return has(jd.signedDate)
        ? { state: "filled" }
        : {
            state: "auto",
            tooltip:
              "DocuSeal stamps at signing. Populated automatically when the client signs the engagement letter.",
          };
    case "retainerPaidDate": {
      // CONDITIONAL — three predicate-selected branches, in order.
      const hasRetainer = has(jd.retainerAmount) && Number(jd.retainerAmount) > 0;
      if (!hasRetainer) return { state: "na", reason: "no retainer on this job" };
      if (has(jd.retainerPaidDate)) return { state: "filled" };
      return {
        state: "auto",
        tooltip: "Fills when the retainer payment clears. Stamped automatically once the client pays the retainer.",
      };
    }
    case "purpose":
      return has(jd.purpose) ? { state: "filled" } : { state: "action" };
    default:
      return { state: "filled" };
  }
}

/** N/A — the field intentionally does not apply. Muted italic + pill + reason. */
export function NAState({ reason }: { reason: string }) {
  return (
    <span
      data-testid="field-state-na"
      className="inline-flex items-center gap-1.5 text-xs italic text-muted-foreground"
    >
      <span className="rounded-[5px] border border-border bg-muted px-2 py-px text-[10.5px] font-semibold not-italic text-muted-foreground">
        N/A
      </span>
      {reason}
    </span>
  );
}

/** Auto-fills-later — dashed placeholder + blue chip; hover names when/how it populates. Reuses the
 *  shadcn Tooltip already imported in LoeQuoteSection (per the spec: reuse the existing pattern). */
export function AutoFillsChip({ tooltip }: { tooltip: string }) {
  return (
    <span data-testid="field-state-auto" className="inline-flex items-center gap-2">
      <span aria-hidden className="tracking-widest text-sm text-muted-foreground">
        — —
      </span>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-flex cursor-default items-center gap-1 rounded-md border border-blue-400/40 bg-blue-500/10 px-2 py-0.5 text-[11px] font-medium text-blue-600 dark:text-blue-300">
              <Info className="h-3 w-3" /> auto-fills
            </span>
          </TooltipTrigger>
          <TooltipContent className="max-w-[240px] text-xs leading-snug">{tooltip}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </span>
  );
}

/** Action-needed marker — sits beside a real empty input that also carries the amber left-edge. */
export function ActionNeededMarker() {
  return (
    <span
      data-testid="field-state-action"
      className="inline-flex items-center gap-1.5 text-[11px] text-amber-600 dark:text-amber-400"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> action needed
    </span>
  );
}

/**
 * Renders one Quote/Payment field's empty-state, or its editable input when filled.
 * - na / auto  → the decoration REPLACES the input (nothing for the user to enter; it does not apply,
 *   or it fills itself). Matches the mockup, which shows no input for these.
 * - filled     → the normal editable input (children).
 * (Action-needed is handled at the Purpose call site directly, because the amber left-edge lives on
 *  the input element itself.)
 */
export function QuoteFieldState({
  field,
  jobDetails,
  children,
}: {
  field: string;
  jobDetails: JobDetails;
  children: React.ReactNode;
}) {
  const s = resolveQuoteFieldState(field, jobDetails);
  if (s.state === "na") return <NAState reason={s.reason ?? ""} />;
  if (s.state === "auto") return <AutoFillsChip tooltip={s.tooltip ?? ""} />;
  return <>{children}</>;
}
