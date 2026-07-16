import React, { useState } from "react";
import { Archive, Trash2 } from "lucide-react";
import { JobSubmission } from "@/types/job";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { formatJobNumber } from "@/utils/formatters";
import { archiveJob, permanentlyDeleteJob } from "./archiveDelete";

// Item 7B — the pop-up the Archive action opens. It asks what happens to the two things that outlive
// the job record (the uploaded files, the SharePoint folders) with the SAFE option pre-selected, then
// archives. A true permanent delete is reachable only from the link at the bottom-left, behind its own
// confirm. Built against ~/Development/KM-Exp/data/screenshots/apr-item7b-archive-over-delete.html.

type FilesChoice = "keep" | "delete";
type FoldersChoice = "leave" | "delete";

// SharePoint folder DELETE has no Graph capability yet (only create-job-folders exists), so per the
// spec this option is GATED — the default "leave folders" always works, and we never fake a delete.
const FOLDER_DELETE_AVAILABLE = false;

function Opt({
  selected,
  onSelect,
  disabled,
  title,
  desc,
  recommended,
}: {
  selected: boolean;
  onSelect: () => void;
  disabled?: boolean;
  title: string;
  desc: string;
  recommended?: boolean;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      disabled={disabled}
      onClick={onSelect}
      className={cn(
        "flex w-full items-start gap-2.5 rounded-lg border p-2.5 text-left transition-colors",
        selected ? "border-primary bg-primary/10" : "border-border hover:bg-muted/50",
        disabled && "cursor-not-allowed opacity-50 hover:bg-transparent",
      )}
    >
      <span
        className={cn(
          "mt-0.5 flex h-[15px] w-[15px] shrink-0 items-center justify-center rounded-full border-2",
          selected ? "border-primary" : "border-muted-foreground",
        )}
      >
        {selected && <span className="h-[7px] w-[7px] rounded-full bg-primary" />}
      </span>
      <span className="min-w-0">
        <span className="text-[12.5px] text-foreground">
          {title}
          {recommended && (
            <span className="ml-1.5 rounded border border-emerald-600/40 bg-emerald-500/10 px-1 py-px text-[9.5px] font-bold uppercase text-emerald-600 dark:text-emerald-400">
              Recommended
            </span>
          )}
          {disabled && (
            <span className="ml-1.5 rounded border border-border bg-muted px-1 py-px text-[9.5px] font-semibold uppercase text-muted-foreground">
              not yet available
            </span>
          )}
        </span>
        <span className="mt-0.5 block text-[10.5px] text-muted-foreground">{desc}</span>
      </span>
    </button>
  );
}

export function ArchiveJobDialog({
  job,
  open,
  onOpenChange,
  onDone,
}: {
  job: JobSubmission;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDone: () => void;
}) {
  const [files, setFiles] = useState<FilesChoice>("keep");
  const [folders, setFolders] = useState<FoldersChoice>("leave");
  const [busy, setBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const label = formatJobNumber(job.jobNumber, job);

  const doArchive = async () => {
    setBusy(true);
    try {
      await archiveJob(job.id, { deleteFiles: files === "delete" });
      toast.success(`${label} archived${files === "delete" ? " — uploaded files deleted" : ""}`);
      onOpenChange(false);
      onDone();
    } catch (e) {
      console.error("Archive failed:", e);
      toast.error("Could not archive the job");
    } finally {
      setBusy(false);
    }
  };

  const doPermanentDelete = async () => {
    setBusy(true);
    try {
      await permanentlyDeleteJob(job.id);
      toast.success(`${label} permanently deleted — records and files removed`);
      setConfirmDelete(false);
      onOpenChange(false);
      onDone();
    } catch (e) {
      console.error("Permanent delete failed:", e);
      toast.error("Could not delete the job");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]" data-testid="archive-dialog">
        <DialogHeader>
          <span className="mb-1 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
            <Archive className="h-5 w-5 text-primary" />
          </span>
          <DialogTitle>Archive {label}?</DialogTitle>
          <DialogDescription>
            This removes the job from your active dashboard but keeps its record. Choose what happens to
            the two things that outlive the job.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-1">
          {/* Question 1 — the client's uploaded files */}
          <div className="border-t border-border pt-3">
            <div className="text-[12.5px] font-semibold">The client's uploaded files</div>
            <div className="mb-2.5 text-[11px] text-muted-foreground">
              The documents attached to this job, held in storage.
            </div>
            <div className="space-y-1.5" role="radiogroup" aria-label="What to do with uploaded files">
              <Opt
                selected={files === "keep"}
                onSelect={() => setFiles("keep")}
                title="Keep them with the archived job"
                desc="Files stay in storage and come back if the job is restored."
                recommended
              />
              <Opt
                selected={files === "delete"}
                onSelect={() => setFiles("delete")}
                title="Delete the uploaded files permanently"
                desc="Removes them from storage. Cannot be undone."
              />
            </div>
          </div>

          {/* Question 2 — the SharePoint folders */}
          <div className="border-t border-border pt-3">
            <div className="text-[12.5px] font-semibold">The SharePoint folders</div>
            <div className="mb-2.5 text-[11px] text-muted-foreground">
              The five-folder set (and any subfolders) created for this job.
            </div>
            <div className="space-y-1.5" role="radiogroup" aria-label="What to do with SharePoint folders">
              <Opt
                selected={folders === "leave"}
                onSelect={() => setFolders("leave")}
                title="Leave the folders in SharePoint"
                desc="Untouched — nothing is removed from the client's SharePoint."
                recommended
              />
              <Opt
                selected={folders === "delete" && FOLDER_DELETE_AVAILABLE}
                onSelect={() => FOLDER_DELETE_AVAILABLE && setFolders("delete")}
                disabled={!FOLDER_DELETE_AVAILABLE}
                title="Delete the SharePoint folders too"
                desc="Removes the job's folders and everything inside them. Cannot be undone."
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 border-t border-border pt-3">
          <button
            type="button"
            data-testid="permanent-delete-link"
            onClick={() => setConfirmDelete(true)}
            disabled={busy}
            className="mr-auto inline-flex items-center gap-1.5 text-[11px] text-destructive hover:underline disabled:opacity-50"
          >
            <Trash2 className="h-3.5 w-3.5" /> Delete job permanently instead
          </button>
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)} disabled={busy}>
            Cancel
          </Button>
          <Button size="sm" onClick={doArchive} disabled={busy} data-testid="confirm-archive">
            {busy ? "Archiving…" : "Archive job"}
          </Button>
        </div>
      </DialogContent>

      {/* The permanent-delete confirm — its own gate, so nobody hard-deletes by reflex. */}
      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent data-testid="permanent-delete-confirm">
          <AlertDialogHeader>
            <AlertDialogTitle>Permanently delete {label}?</AlertDialogTitle>
            <AlertDialogDescription>
              This erases the job record, every related row, and the uploaded files from storage. It
              cannot be undone. To keep the record, archive instead.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={busy}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                void doPermanentDelete();
              }}
              disabled={busy}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {busy ? "Deleting…" : "Delete permanently"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}
