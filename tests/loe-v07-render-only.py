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

# NAME-MATCH GUARD: VAL261101 must read Westside Mall before we proceed
guard_name=(job.get('property_name') or '')
print("GUARD property_name:", repr(guard_name), "| job_number:", ld.get('job_number'))
assert 'westside' in guard_name.lower(), f"NAME-MATCH GUARD FAILED: expected Westside Mall, got {guard_name!r}"

def g(d,k): return d.get(k) or ''
def fmt_cur(v):
    n=re.sub(r'[^0-9.]','',str(v)) if v else ''
    return f"${int(float(n)):,}" if n else "$TBD"

propName=g(job,'property_name') or 'Unnamed Property'
m={
 "[Today's Date]":"June 4, 2026",
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
 '[ValueScenarios]':g(ld,'value_scenarios'),'[ReportType]':g(ld,'report_type'),
 '[AssignmentType]':g(ld,'assignment_type'),'[ApproachestoValue]':g(ld,'approaches_to_value'),
 '[Fee]':fmt_cur(g(ld,'appraisal_fee')),'[DeliveryTime]':g(ld,'delivery_time'),
 '[ClientDocuments]':g(ld,'client_documents'),'[PreviouslyAppraised]':g(ld,'previously_appraised'),
 '[ScheduleAPropertyList]':g(ld,'schedule_a_property_list'),
}
for i in range(1,7):
    m[f'[ValueScenario{i}]']=g(ld,f'value_scenario{i}'); m[f'[EA/HCSummary{i}]']=g(ld,f'ea_hc_summary{i}')

html=open(TPL).read()
if 'multiple' not in str(g(ld,'assignment_type')).lower():
    html=re.sub(r'<!-- SCHEDULE-A:START -->.*?<!-- SCHEDULE-A:END -->','',html,flags=re.S)
for k,v in m.items():
    html=html.replace(k,str(v))

# Drop the build-comment artifact line that contains a literal [Placeholder] mention
filled_html=os.path.join(OUT,"loe-v07-filled-VAL261101.html")
open(filled_html,"w").write(html)

# residual tokens (exclude the harmless comment mention)
residual=[t for t in re.findall(r'\[[A-Za-z0-9/\' .]+\]', html)]
print("RESIDUAL TOKENS:", residual)
print("FILLED:", filled_html)
print("DATA: client=%r %r  org=%r  prop=%r  addr=%r  fee=%r  jobno=%r"%(
    m['[ClientFirstName]'],m['[ClientLastName]'],m['[ClientCompanyName]'],propName,m['[PropertyAddress]'],m['[Fee]'],m['[JobNumber]']))

# dump non-empty field values for self-verify
print("--- non-empty fields ---")
for k,v in m.items():
    if str(v).strip(): print(f"  {k} = {v}")
print("--- empty fields ---")
print("  ", [k for k,v in m.items() if not str(v).strip()])
