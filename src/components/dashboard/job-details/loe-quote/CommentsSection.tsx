
import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CommentsSectionProps {
  appraiserComments?: string;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({
  appraiserComments,
  onInputChange,
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="appraiserComments">Appraiser Comments</Label>
        <Textarea
          id="appraiserComments"
          name="appraiserComments"
          value={appraiserComments || ''}
          onChange={onInputChange}
          rows={6}
        />
      </div>
    </div>
  );
};

export default CommentsSection;
