"""
Cascade proof — render V07 contract TWICE with two different cascade outputs,
to test whether Section 10 + pagination respond to the cascade.

Does NOT touch the DB. Pulls real Westside Mall job data for every OTHER field
(name-match guard intact), then OVERRIDES only the value_scenario / ea_hc_summary
fields with the two cascade results we want to compare:

  Variant A  "Existing - Under Renovation"  -> 2 scenarios (As-Is + As If Complete & Stabilized)
  Variant B  "Existing - Completed"         -> 1 scenario  (As Stabilized)

Output: two filled HTML files in the screenshots dir, ready to headless-screenshot + compare.
"""
import json, urllib.request, subprocess, os, re

PROJ="ngovnamnjmexdpjtcnky"
TPL=os.path.expanduser("~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/loe07-build/LOE-template-v07.html")
JOB_ID="e5a7ba2f-0535-4fbf-9ba7-b7027cf0a157"  # VAL261101 = Westside Mall
OUT=os.path.expanduser("~/Development/KM-Exp/data/screenshots")
os.makedirs(OUT, exist_ok=True)

sat=subprocess.check_output("grep -m1 SUPABASE_ACCESS_TOKEN ~/.zshrc | sed -E 's/.*=[\"'\"'\"']?([^\"'\"'\"']+).*/\\1/'",shell=True,executable="/bin/zsh").decode().strip()
def mgmt_sql(q):
    req=urllib.request.Request(f"https://api.supabase.com/v1/projects/{PROJ}/database/query",
        data=json.dumps({"query":q}).encode(),
        headers={"Authorization":"Bearer "+sat,"Content-Type":"application/json","User-Agent":"curl/8.0"},method="POST")
    return json.load(urllib.request.urlopen(req,timeout=30))

job=mgmt_sql(f"select * from job_submissions where id='{JOB_ID}'")[0]
ld =mgmt_sql(f"select * from job_loe_details where job_id='{JOB_ID}'"); ld=ld[0] if ld else {}
pi =mgmt_sql(f"select * from job_property_info where job_id='{JOB_ID}'"); pi=pi[0] if pi else {}

guard_name=(job.get('property_name') or '')
print("GUARD property_name:", repr(guard_name), "| job_number:", ld.get('job_number'))
assert 'westside' in guard_name.lower(), f"NAME-MATCH GUARD FAILED: expected Westside Mall, got {guard_name!r}"

def g(d,k): return d.get(k) or ''
def fmt_cur(v):
    n=re.sub(r'[^0-9.]','',str(v)) if v else ''
    return f"${int(float(n)):,}" if n else "$TBD"

propName=g(job,'property_name') or 'Unnamed Property'

def base_map():
    m={
     "[Today's Date]":"June 8, 2026",
     '[ClientFirstName]':g(job,'client_first_name'),'[ClientLastName]':g(job,'client_last_name'),
     '[ClientCompanyName]':g(job,'client_organization'),'[ClientOrganizationAddress]':g(job,'client_address'),
     '[ClientPhone]':g(job,'client_phone'),'[ClientEmail]':g(job,'client_email'),
     '[JobNumber]':g(ld,'job_number') or 'Awaiting Valcre job',
     '[JobName]':', '.join([x for x in [propName,g(job,'property_address')] if x]),
     '[PropertyName]':propName,'[PropertyAddress]':g(job,'property_address'),'[PropertyType]':g(job,'property_type'),
     '[InterestAppraised]':g(ld,'property_rights_appraised'),
     '[CurrentUseImprovements]':g(ld,'current_use') or g(pi,'current_use'),
     '[ProposedUseImprovements]':g(ld,'proposed_use') or g(pi,'proposed_use'),
     '[AuthorizedUse]':g(ld,'authorized_use') or g(job,'intended_use'),
     '[Valuetimeframe]':g(ld,'value_timeframe') or g(ld,'valuation_premises'),
     '[ReportType]':g(ld,'report_type'),
     '[AssignmentType]':g(ld,'assignment_type'),
     '[Fee]':fmt_cur(g(ld,'appraisal_fee')),'[DeliveryTime]':g(ld,'delivery_time'),
     '[ClientDocuments]':g(ld,'client_documents'),'[PreviouslyAppraised]':g(ld,'previously_appraised'),
     '[ScheduleAPropertyList]':g(ld,'schedule_a_property_list'),
    }
    return m

# The two cascade outputs we are comparing (LEFT column = cascade-derived scenarios)
VARIANTS = {
 "A_under-renovation_2scenarios": {
    "status":"Existing - Under Renovation",
    "scenarios":["As-Is","As If Complete & Stabilized"],
    "approaches":"Direct Comparison, Income, Cost",
 },
 "B_completed_1scenario": {
    "status":"Existing - Completed",
    "scenarios":["As Stabilized"],
    "approaches":"Direct Comparison, Income",
 },
}

tpl=open(TPL).read()

for label,v in VARIANTS.items():
    m=base_map()
    scen=v["scenarios"]
    m['[ValueScenarios]']=", ".join(scen)
    m['[ApproachestoValue]']=v["approaches"]
    # fill / blank the 6 EA-HC rows from the cascade scenario list
    for i in range(1,7):
        if i<=len(scen):
            m[f'[ValueScenario{i}]']=scen[i-1]
            m[f'[EA/HCSummary{i}]']=f"(EA/HC narrative for {scen[i-1]} — pending text library)"
        else:
            m[f'[ValueScenario{i}]']=''
            m[f'[EA/HCSummary{i}]']=''
    html=tpl
    if 'multiple' not in str(g(ld,'assignment_type')).lower():
        html=re.sub(r'<!-- SCHEDULE-A:START -->.*?<!-- SCHEDULE-A:END -->','',html,flags=re.S)
    for k,val in m.items():
        html=html.replace(k,str(val))
    out=os.path.join(OUT,f"loe-cascade-{label}.html")
    open(out,"w").write(html)
    residual=re.findall(r'\[[A-Za-z0-9/\' .]+\]', html)
    print(f"\n=== {label} ===")
    print(f"  status pick : {v['status']}")
    print(f"  scenarios   : {scen}  ({len(scen)} -> {len(scen)} filled rows, {6-len(scen)} blanked)")
    print(f"  residual    : {residual}")
    print(f"  FILE        : {out}")
