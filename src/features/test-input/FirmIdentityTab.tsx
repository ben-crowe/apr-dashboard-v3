import React from "react";

/**
 * Firm & Appraiser Identity — a new section ("tab") on the V4 field-test page (/test-input),
 * built to the Ben-approved mockup:
 *   ~/Development/KM-Exp/data/screenshots/apr-settings-firm-appraiser.html
 *
 * These are the FIRM's own identity fields (company + appraiser details set once and reused on
 * every job) — NOT per-job data, which is why they have no V3 intake source. This is a display /
 * settings surface only: V4 is NOT operational, so nothing here is a dependency other code relies
 * on. The values below are the mockup's seed values (Ben's real firm details).
 *
 * House style = the CORRECTED V3-job-page pattern the mockup uses: right-aligned labels ending in a
 * colon (fixed 160px column), value in a soft filled well with an underline under the VALUE only,
 * small uppercase tracked section headings, two columns. Dark mode (the field-test page is dark).
 * All classes are scoped under `.firm-identity-tab` so nothing collides with the rest of the page.
 *
 * Tab name / position: proposed S0 (ordered first, before S1) with the human label
 * "Firm & Appraiser". Trivially changeable — the label lives in FIRM_TAB_LABEL and the order is one
 * entry in TestInputDashboard's sectionDisplayOrder. Ben rules the final name.
 */

// Seed values (the mockup's — Ben's real firm details). Editable inputs, uncontrolled.
const APPRAISER_NAME = "Ben Crowe";
const CREDENTIALS = "AACI, P.App";
// The signature line is READ-ONLY, auto-composed from name + credentials (flag note 3) — never a
// third hand-kept field. e.g. "Ben Crowe, AACI, P.App".
const SIGNATURE_LINE = [APPRAISER_NAME, CREDENTIALS].filter(Boolean).join(", ");

export const FIRM_TAB_LABEL = "Firm & Appraiser";

const FirmIdentityTab: React.FC = () => {
  return (
    <div className="firm-identity-tab" id="section-firm-identity">
      <style>{`
        .firm-identity-tab {
          --fi-card2:#222b38; --fi-well:#161b22; --fi-border:#2b3542;
          --fi-fg:#e7edf5; --fi-muted:#8b98a9; --fi-muted2:#6b7789;
          --fi-blue:#3b82f6; --fi-blue-dim:#2a3a54; --fi-field:#171c24;
          color:var(--fi-fg);
          font:13px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",Inter,sans-serif;
        }
        .firm-identity-tab *{box-sizing:border-box}
        .firm-identity-tab .fi-head{display:flex;justify-content:space-between;align-items:flex-start;margin:0 0 6px}
        .firm-identity-tab h1{font-size:19px;margin:0;font-weight:650;color:var(--fi-fg)}
        .firm-identity-tab .fi-sub{color:var(--fi-muted);font-size:12.5px;margin-top:2px}
        .firm-identity-tab .fi-save{font-size:12.5px;font-weight:600;padding:8px 18px;border-radius:8px;background:var(--fi-blue);color:#fff;border:none;cursor:pointer}
        .firm-identity-tab .fi-banner{background:var(--fi-blue-dim);border:1px solid #33517d;border-radius:8px;padding:9px 14px;margin:12px 0 16px;font-size:12.25px;color:#cdd7e3;display:flex;gap:10px;align-items:flex-start}
        .firm-identity-tab .fi-banner svg{width:16px;height:16px;color:#9dc0f5;flex:none;margin-top:1px}
        .firm-identity-tab .fi-banner b{color:#9dc0f5}
        /* One encapsulating box around the whole identity group, V3-style */
        .firm-identity-tab .fi-card{border:1px solid #3d4757;border-radius:7px;margin:0 0 16px;overflow:hidden}
        .firm-identity-tab .fi-cardhd{background:var(--fi-card2);border-radius:7px 7px 0 0;padding:10.5px 14px;display:flex;align-items:center;gap:9px;font-size:14px;font-weight:500;color:var(--fi-fg)}
        .firm-identity-tab .fi-cardhd .chev{width:13px;height:13px;flex:none;opacity:.7}
        .firm-identity-tab .fi-cardbody{padding:14px 18px 16px}
        /* Sub-section inside the box: flat, small-caps letter-spaced heading only */
        .firm-identity-tab .fi-group{background:transparent;border:none;border-radius:0;margin-bottom:0}
        .firm-identity-tab .fi-ghd{padding:14px 0 8px;border:none;display:flex;align-items:baseline;gap:9px}
        .firm-identity-tab .fi-group:first-child .fi-ghd{padding-top:2px}
        .firm-identity-tab .fi-ghd svg{display:none}
        .firm-identity-tab .fi-ghd h2{margin:0;font-size:10.5px;font-weight:600;letter-spacing:.525px;text-transform:uppercase;color:var(--fi-fg)}
        .firm-identity-tab .fi-ghd .sub{margin-left:auto;font-size:11px;color:var(--fi-muted2);text-transform:none;letter-spacing:0}
        /* One line per field, label right-aligned to a colon; two columns, 160px label column */
        .firm-identity-tab .fi-fields{padding:0;display:grid;grid-template-columns:1fr 1fr;gap:0 44px}
        .firm-identity-tab .fi-f{display:flex;flex-direction:row;align-items:center;gap:9px;padding:5px 0}
        .firm-identity-tab .fi-f.wide{grid-column:1 / -1}
        .firm-identity-tab .fi-f label{flex:0 0 160px;text-align:right;font-size:12.25px;font-weight:400;color:var(--fi-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .firm-identity-tab .fi-f label::after{content:":"}
        /* V3 value well: filled well + underline ONLY, no side/top borders, no rounding */
        .firm-identity-tab .fi-f .in{flex:1;min-width:0;height:31.5px;background:var(--fi-field);border:none;border-bottom:1px solid var(--fi-border);border-radius:0;display:flex;align-items:center;padding:0 8px;font-size:12.25px;color:var(--fi-fg);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;width:100%}
        .firm-identity-tab .fi-f input.in{outline:none}
        .firm-identity-tab .fi-f input.in:focus{border-bottom-color:var(--fi-blue)}
        .firm-identity-tab .fi-f .in.ph,.firm-identity-tab .fi-f input.in::placeholder{color:var(--fi-muted2)}
        .firm-identity-tab .fi-f.tall{align-items:flex-start}
        .firm-identity-tab .fi-f.tall label{padding-top:8px}
        .firm-identity-tab .fi-f textarea.in{height:52px;padding:7px 8px;align-items:flex-start;line-height:1.45;font:inherit;font-size:12.25px;color:var(--fi-muted2);resize:none;border:none;border-bottom:1px solid var(--fi-border);white-space:normal;display:block}
        /* read-only signature well reads slightly dimmer, no caret */
        .firm-identity-tab .fi-f .in.ro{color:var(--fi-fg);cursor:default}
        /* upload tiles */
        .firm-identity-tab .fi-uploads{display:grid;grid-template-columns:1fr 1fr;gap:14px;padding:12px 0 0}
        .firm-identity-tab .fi-up{border:1px dashed var(--fi-border);border-radius:8px;padding:12px 14px;display:flex;align-items:center;gap:13px;background:transparent}
        .firm-identity-tab .fi-up .thumb{width:52px;height:52px;border-radius:8px;background:var(--fi-card2);border:1px solid var(--fi-border);display:grid;place-items:center;flex:none;color:var(--fi-muted2)}
        .firm-identity-tab .fi-up .thumb.round{border-radius:50%}
        .firm-identity-tab .fi-up .thumb svg{width:22px;height:22px}
        .firm-identity-tab .fi-up .ut{font-size:12px;font-weight:600}
        .firm-identity-tab .fi-up .us{font-size:11px;color:var(--fi-muted2);margin-top:2px}
        .firm-identity-tab .fi-up .btn{margin-left:auto;font-size:11px;font-weight:600;padding:6px 12px;border-radius:7px;border:1px solid var(--fi-border);color:var(--fi-fg);background:transparent;cursor:pointer}
        /* flags panel */
        .firm-identity-tab .fi-flags{background:#211a12;border:1px solid #5c4620;border-radius:10px;padding:15px 17px;margin-top:26px}
        .firm-identity-tab .fi-flags h3{margin:0 0 9px;font-size:12px;font-weight:700;color:#f5c877;display:flex;align-items:center;gap:8px}
        .firm-identity-tab .fi-flags h3 svg{width:14px;height:14px}
        .firm-identity-tab .fi-flags ul{margin:0;padding-left:2px;list-style:none}
        .firm-identity-tab .fi-flags li{font-size:11.5px;color:#d8c8a8;line-height:1.5;padding:4px 0;display:flex;gap:9px}
        .firm-identity-tab .fi-flags li .n{color:#f5c877;font-weight:700;flex:none}
        .firm-identity-tab .fi-flags li b{color:#f0e2c4}
        .firm-identity-tab .fi-flags .cap{font-size:10.5px;color:#9c8c6a;margin-top:9px}
      `}</style>

      <div className="fi-head">
        <div>
          <h1>Firm &amp; Appraiser</h1>
          <div className="fi-sub">Your identity — set once, reused on every job.</div>
        </div>
        <button className="fi-save" type="button">Save settings</button>
      </div>

      <div className="fi-banner">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-5M12 8h.01" />
        </svg>
        <div>
          These are <b>your</b> firm and appraiser details — filled once here and pulled into every
          job automatically. They were moved off the per-job form because they never change job to job.
        </div>
      </div>

      {/* ONE ENCAPSULATING BOX around the whole identity group, V3-style */}
      <div className="fi-card">
        <div className="fi-cardhd">
          <svg className="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M6 9l6 6 6-6" />
          </svg>
          Firm &amp; Appraiser Identity
        </div>
        <div className="fi-cardbody">

          {/* COMPANY */}
          <div className="fi-group">
            <div className="fi-ghd">
              <h2>Company</h2>
              <span className="sub">appears on reports &amp; the engagement letter</span>
            </div>
            <div className="fi-fields">
              <div className="fi-f wide"><label>Company Name</label><input className="in" defaultValue="Valta Property Valuations" /></div>
              <div className="fi-f wide"><label>Company Address</label><input className="in" defaultValue="120 Kensington Rd NW, Suite 400" /></div>
              <div className="fi-f"><label>City</label><input className="in" defaultValue="Calgary" /></div>
              <div className="fi-f"><label>Province</label><input className="in" defaultValue="AB" /></div>
              <div className="fi-f"><label>Postal Code</label><input className="in" defaultValue="T2N 3P5" /></div>
              <div className="fi-f"><label>Phone</label><input className="in" defaultValue="(587) 603-7034" /></div>
              <div className="fi-f"><label>Email</label><input className="in" defaultValue="office@valta.ca" /></div>
              <div className="fi-f"><label>Website</label><input className="in" defaultValue="valtapropertyvaluations.com" /></div>
            </div>
          </div>

          {/* APPRAISER */}
          <div className="fi-group">
            <div className="fi-ghd"><h2>Appraiser</h2></div>
            <div className="fi-fields">
              <div className="fi-f"><label>Appraiser Name</label><input className="in" defaultValue={APPRAISER_NAME} /></div>
              <div className="fi-f"><label>Title</label><input className="in" defaultValue="Senior Appraiser" /></div>
              <div className="fi-f"><label>Role</label><input className="in" placeholder="e.g. Lead Appraiser" /></div>
              <div className="fi-f"><label>Email</label><input className="in" defaultValue="bc@valta.ca" /></div>
            </div>
          </div>

          {/* CREDENTIALS & LICENSES */}
          <div className="fi-group">
            <div className="fi-ghd"><h2>Credentials &amp; Licenses</h2></div>
            <div className="fi-fields">
              <div className="fi-f"><label>Credentials</label><input className="in" defaultValue={CREDENTIALS} /></div>
              <div className="fi-f"><label>Designation</label><input className="in" defaultValue="Accredited Appraiser" /></div>
              <div className="fi-f"><label>License Number</label><input className="in" defaultValue="AB-104772" /></div>
              <div className="fi-f"><label>License Expiry</label><input className="in" defaultValue="2027-03-31" /></div>
              <div className="fi-f"><label>AIC Member Number</label><input className="in" defaultValue="908431" /></div>
              <div className="fi-f"><label>RICS Membership Number</label><input className="in" placeholder="optional" /></div>
            </div>
          </div>

          {/* SIGNATURE & BIO */}
          <div className="fi-group">
            <div className="fi-ghd">
              <h2>Signature &amp; Bio</h2>
              <span className="sub">printed in the report's appraiser block</span>
            </div>
            <div className="fi-fields">
              {/* Read-only, auto-composed from Appraiser Name + Credentials (flag note 3) */}
              <div className="fi-f wide"><label>Name &amp; Credentials (signature line)</label><div className="in ro" title="Auto-composed from Appraiser Name + Credentials — read-only">{SIGNATURE_LINE}</div></div>
              <div className="fi-f wide tall"><label>Bio — Paragraph 1</label><textarea className="in" readOnly defaultValue="Ben Crowe is a senior commercial appraiser with over fifteen years of experience across Western Canada…" /></div>
              <div className="fi-f wide tall"><label>Bio — Paragraph 2</label><textarea className="in" readOnly defaultValue="He specializes in self-storage, multi-tenant, and mixed-use valuations…" /></div>
              <div className="fi-f wide tall"><label>Appraiser Comments</label><textarea className="in" readOnly placeholder="standing note that carries onto reports" /></div>
            </div>
          </div>

          {/* LOGO & HEADSHOT */}
          <div className="fi-group">
            <div className="fi-ghd"><h2>Logo &amp; Headshot</h2></div>
            <div className="fi-uploads">
              <div className="fi-up">
                <div className="thumb">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="M21 15l-5-5L5 21" />
                  </svg>
                </div>
                <div><div className="ut">Company Logo</div><div className="us">PNG or SVG · shown on report cover</div></div>
                <button className="btn" type="button">Upload</button>
              </div>
              <div className="fi-up">
                <div className="thumb round">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
                  </svg>
                </div>
                <div><div className="ut">Appraiser Headshot</div><div className="us">JPG · shown in the appraiser bio</div></div>
                <button className="btn" type="button">Upload</button>
              </div>
            </div>
          </div>

        </div>{/* /fi-cardbody */}
      </div>{/* /fi-card */}

      {/* FLAGS — all four registry notes from the approved mockup, kept verbatim + unresolved */}
      <div className="fi-flags">
        <h3>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M12 9v4M12 17h.01M10.3 3.9L1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L14.7 3.9a2 2 0 00-3.4 0z" />
          </svg>
          Registry problems I hit pulling the fields — resolve before build
        </h3>
        <ul>
          <li><span className="n">1</span><div><b>The company details exist twice in the registry.</b> There is a company- set (Company Name, Address, Phone, Email, Website) AND an appraiser- mirror of the same data (appraiser-company, appraiser-address, appraiser-city, appraiser-province, appraiser-postal, appraiser-phone, appraiser-website). Worse, the two disagree on address shape — one has a single combined "City/State/Zip" field, the other splits it into City + Province + Postal. The settings screen must hold ONE company block; the registry needs to pick which id set wins so the design binds to real fields.</div></li>
          <li><span className="n">2</span><div><b>AIC number is defined twice</b> — appraiser-aic ("AIC Number") and appraiser-aic-number ("AIC Member Number"). One should go.</div></li>
          <li><span className="n">3</span><div><b>"Appraiser Name &amp; Credentials" is a composite</b> of Appraiser Name + Credentials — it should auto-build from those two, not be a third field someone types and keeps in sync by hand. I've shown it as the read-only signature line.</div></li>
          <li><span className="n">4</span><div><b>"Client Job Number" (company-jobnumber) is per-job, not firm identity</b> — it does not belong on this settings screen. I left it out.</div></li>
        </ul>
        <div className="cap">Thirty-one ids pulled from fieldRegistry.ts; the four notes above are why the screen shows fewer visible fields than the raw count.</div>
      </div>
    </div>
  );
};

export default FirmIdentityTab;
