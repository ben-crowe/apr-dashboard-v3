import json, urllib.request, urllib.error, subprocess, os, re

PROJ="ngovnamnjmexdpjtcnky"; SB=f"https://{PROJ}.supabase.co"
TPL=os.path.expanduser("~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/loe07-build/LOE-template-v07.html")
JOB_ID="e5a7ba2f-0535-4fbf-9ba7-b7027cf0a157"  # VAL261101 = Westside Mall

sat=subprocess.check_output("grep -m1 SUPABASE_ACCESS_TOKEN ~/.zshrc | sed -E 's/.*=[\"'\"'\"']?([^\"'\"'\"']+).*/\\1/'",shell=True,executable="/bin/zsh").decode().strip()
def mgmt_sql(q):
    req=urllib.request.Request(f"https://api.supabase.com/v1/projects/{PROJ}/database/query",
        data=json.dumps({"query":q}).encode(),
        headers={"Authorization":"Bearer "+sat,"Content-Type":"application/json","User-Agent":"curl/8.0"},method="POST")
    return json.load(urllib.request.urlopen(req,timeout=30))

job=mgmt_sql(f"select * from job_submissions where id='{JOB_ID}'")[0]
ld =mgmt_sql(f"select * from job_loe_details where job_id='{JOB_ID}'")
ld =ld[0] if ld else {}
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
 '[CurrentUseImprovements]':g(ld,'current_use'),'[ProposedUseImprovements]':g(ld,'proposed_use'),
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
# conditional Schedule A: strip unless assignment includes 'multiple'
if 'multiple' not in str(g(ld,'assignment_type')).lower():
    html=re.sub(r'<!-- SCHEDULE-A:START -->.*?<!-- SCHEDULE-A:END -->','',html,flags=re.S)
for k,v in m.items():
    html=html.replace(k,v)
open("/tmp/loe-v07-filled.html","w").write(html)
print("filled; placeholders left:", len(re.findall(r'\[[A-Za-z0-9/ ]+\]', html)), "client:", m['[ClientFirstName]'], m['[ClientLastName]'], "| prop:", propName)

# submit to DocuSeal
anon=subprocess.check_output(f'curl -s "https://api.supabase.com/v1/projects/{PROJ}/api-keys" -H "Authorization: Bearer {sat}"',shell=True).decode()
anon=next(k['api_key'] for k in json.loads(anon) if k['name']=='anon')
payload={"name":"LOE-V07-FILLED-VAL261101","send_email":False,
 "documents":[{"name":"LOE-v07-filled","html":html,"size":"Letter"}],
 "submitters":[{"email":"noreply@valta.ca","name":"Westside Mall LOE","role":"First Party"}]}
req=urllib.request.Request(f"{SB}/functions/v1/docuseal-proxy?endpoint=submissions/html",
 data=json.dumps(payload).encode(),
 headers={"Authorization":"Bearer "+anon,"Content-Type":"application/json","User-Agent":"curl/8.0"},method="POST")
try: resp=json.load(urllib.request.urlopen(req,timeout=90))
except urllib.error.HTTPError as e: print("HTTP",e.code,e.read().decode()[:400]); raise SystemExit(1)
d=resp[0] if isinstance(resp,list) else resp
sid=d.get("submission_id") or d.get("id") or d.get("submitters",[{}])[0].get("submission_id")
print("FILLED_SUBMISSION_ID:",sid)
