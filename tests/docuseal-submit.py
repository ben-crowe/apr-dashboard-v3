import json, urllib.request, subprocess, time, os

PROJ = "ngovnamnjmexdpjtcnky"
SB_URL = f"https://{PROJ}.supabase.co"
HTML_PATH = os.path.expanduser("~/Development/APR-Dashboard-v3/tests/docuseal-footer-test.html")

# get supabase access token + anon key
zshrc = open(os.path.expanduser("~/.zshrc")).read()
import re
m = re.search(r'export SUPABASE_ACCESS_TOKEN=["\']?([^"\'\n]+)', zshrc)
sat = m.group(1).strip()
def mgmt(path):
    r = urllib.request.Request(f"https://api.supabase.com/v1/projects/{PROJ}{path}",
        headers={"Authorization": "Bearer " + sat})
    return json.load(urllib.request.urlopen(r, timeout=30))
keys = mgmt("/api-keys")
anon = next(k["api_key"] for k in keys if k["name"] == "anon")

html = open(HTML_PATH).read()
payload = {
    "name": "FOOTER-TEST",
    "send_email": False,
    "documents": [{"name": "footer-test", "html": html, "size": "Letter"}],
    "submitters": [{"email": "noreply@valta.ca", "name": "Footer Test", "role": "First Party"}],
}
req = urllib.request.Request(
    f"{SB_URL}/functions/v1/docuseal-proxy?endpoint=submissions/html",
    data=json.dumps(payload).encode(),
    headers={"Authorization": "Bearer " + anon, "Content-Type": "application/json"},
    method="POST")
try:
    resp = json.load(urllib.request.urlopen(req, timeout=60))
except urllib.error.HTTPError as e:
    print("HTTP", e.code, e.read().decode()[:800]); raise SystemExit(1)

data = resp[0] if isinstance(resp, list) else resp
sid = data.get("submission_id") or data.get("id") or (data.get("submitters",[{}])[0].get("submission_id"))
slug = data.get("slug") or (data.get("submitters",[{}])[0].get("slug"))
print("SUBMISSION_ID:", sid)
print("SLUG:", slug)
print("TOP_KEYS:", list(data.keys()))
# Save raw response for PDF-URL hunting
open("/tmp/docuseal-resp.json","w").write(json.dumps(resp, indent=1))
print("raw response saved to /tmp/docuseal-resp.json")
# look for any document/pdf urls inline
blob = json.dumps(resp)
for u in re.findall(r'https?://[^"\\ ]+\.pdf', blob):
    print("PDF_URL_INLINE:", u)
