-- Fix §10 EA/HC row suppression: add EAHC-ROW-n:START/END fence markers to the active LOE-07-1 v7 template.
-- The deployed template has 6 physical <tr> rows but no fence comments, so applyEahcRowSuppression
-- (generateLOE.ts) cannot match and remove empty rows on jobs with fewer than 6 scenarios.
-- This migration does targeted string replacements on each of the 6 rows in the active template.
-- DB template uses <tr><td><span class="merge-token"> structure (not divs like the static .html file).

UPDATE loe_templates
SET template_html = REPLACE(
  REPLACE(
    REPLACE(
      REPLACE(
        REPLACE(
          REPLACE(
            template_html,
            '<tr><td><span class="merge-token" data-token="ValueScenario1">[ValueScenario1]</span></td><td><span class="merge-token" data-token="EAHCSummary1">[EA/HCSummary1]</span></td></tr>',
            '<!-- EAHC-ROW-1:START --><tr><td><span class="merge-token" data-token="ValueScenario1">[ValueScenario1]</span></td><td><span class="merge-token" data-token="EAHCSummary1">[EA/HCSummary1]</span></td></tr><!-- EAHC-ROW-1:END -->'
          ),
          '<tr><td><span class="merge-token" data-token="ValueScenario2">[ValueScenario2]</span></td><td><span class="merge-token" data-token="EAHCSummary2">[EA/HCSummary2]</span></td></tr>',
          '<!-- EAHC-ROW-2:START --><tr><td><span class="merge-token" data-token="ValueScenario2">[ValueScenario2]</span></td><td><span class="merge-token" data-token="EAHCSummary2">[EA/HCSummary2]</span></td></tr><!-- EAHC-ROW-2:END -->'
        ),
        '<tr><td><span class="merge-token" data-token="ValueScenario3">[ValueScenario3]</span></td><td><span class="merge-token" data-token="EAHCSummary3">[EA/HCSummary3]</span></td></tr>',
        '<!-- EAHC-ROW-3:START --><tr><td><span class="merge-token" data-token="ValueScenario3">[ValueScenario3]</span></td><td><span class="merge-token" data-token="EAHCSummary3">[EA/HCSummary3]</span></td></tr><!-- EAHC-ROW-3:END -->'
      ),
      '<tr><td><span class="merge-token" data-token="ValueScenario4">[ValueScenario4]</span></td><td><span class="merge-token" data-token="EAHCSummary4">[EA/HCSummary4]</span></td></tr>',
      '<!-- EAHC-ROW-4:START --><tr><td><span class="merge-token" data-token="ValueScenario4">[ValueScenario4]</span></td><td><span class="merge-token" data-token="EAHCSummary4">[EA/HCSummary4]</span></td></tr><!-- EAHC-ROW-4:END -->'
    ),
    '<tr><td><span class="merge-token" data-token="ValueScenario5">[ValueScenario5]</span></td><td><span class="merge-token" data-token="EAHCSummary5">[EA/HCSummary5]</span></td></tr>',
    '<!-- EAHC-ROW-5:START --><tr><td><span class="merge-token" data-token="ValueScenario5">[ValueScenario5]</span></td><td><span class="merge-token" data-token="EAHCSummary5">[EA/HCSummary5]</span></td></tr><!-- EAHC-ROW-5:END -->'
  ),
  '<tr><td><span class="merge-token" data-token="ValueScenario6">[ValueScenario6]</span></td><td><span class="merge-token" data-token="EAHCSummary6">[EA/HCSummary6]</span></td></tr>',
  '<!-- EAHC-ROW-6:START --><tr><td><span class="merge-token" data-token="ValueScenario6">[ValueScenario6]</span></td><td><span class="merge-token" data-token="EAHCSummary6">[EA/HCSummary6]</span></td></tr><!-- EAHC-ROW-6:END -->'
),
updated_at = NOW()
WHERE version = 7
  AND is_active = true;
