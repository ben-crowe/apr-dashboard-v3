/**
 * Preview Panel Component
 *
 * Right panel container - simple iframe at 100%, no zoom controls.
 * Sizing controlled by panel divider, not zoom buttons.
 * Matches Report Builder behavior exactly.
 */

import { PageFrame } from './PageFrame';

export function PreviewPanel() {
  return (
    <div className="h-full w-full">
      <PageFrame />
    </div>
  );
}
