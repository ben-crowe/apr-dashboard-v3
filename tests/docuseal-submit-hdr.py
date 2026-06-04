import json, urllib.request, urllib.error, subprocess, os

PROJ = "ngovnamnjmexdpjtcnky"
SB_URL = f"https://{PROJ}.supabase.co"
HTML_PATH = os.path.expanduser("~/Development/APR-Dashboard-v3/tests/docuseal-header-test.html")

sat = os.environ.get("SUPABASE_ACCESS_TOKEN", "").strip()
if not sat:
    sat = subprocess.check_output(
        "grep -m1 SUPABASE_ACCESS_TOKEN ~/.zshrc | sed -E 's/.*=[\"'\"'\"']?([^\"'\"'\"']+).*/\\1/'",
        shell=True, executable="/bin/zsh").decode().strip()
assert len(sat) > 20, f"bad token len {len(sat)}"

def mgmt(path):
    r = urllib.request.Request(f"https://api.supabase.com/v1/projects/{PROJ}{path}",
        headers={"Authorization": "Bearer " + sat})
    return json.load(urllib.request.urlopen(r, timeout=30))

anon = next(k["api_key"] for k in mgmt("/api-keys") if k["name"] == "anon")

html = open(HTML_PATH).read()
payload = {
    "name": "HEADER-FOOTER-TEST",
    "send_email": False,
    "documents": [{"name": "header-test", "html": html, "size": "Letter"}],
    "submitters": [{"email": "noreply@valta.ca", "name": "Header Test", "role": "First Party"}],
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
print("SUBMISSION_ID:", sid)
print("SLUG:", data.get("slug") or (data.get("submitters",[{}])[0].get("slug")))
open("/tmp/docuseal-header-resp.json","w").write(json.dumps(resp, indent=1))
print("raw saved /tmp/docuseal-header-resp.json")
