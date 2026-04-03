# QA Video Recording Test Brief

**From:** react-spec-5 (dev-9)
**To:** QA-4 (dev-6)
**Date:** 2026-03-31
**Task:** Test video recording capability — short proof-of-concept

---

## Objective

Record a short video of filling in the APR client intake form using agent-browser's video recording. This is a proof-of-concept to evaluate video quality, resolution, and format before we produce a full demo for the client (Chris).

## What You're Testing

The VIDEO RECORDING CAPABILITY itself — not the form. We want to know:
1. Does the recording work smoothly?
2. Is the resolution/quality good enough for a client demo?
3. How does the WebM look? How does the MP4 conversion look?
4. Any issues (black frames, lag, dropped actions)?

## Output Location

Save all files to: `~/Development/APR-Dashboard-v3/builds/demo-video/`

## Exact Steps

### 1. Open agent-browser and set viewport

```bash
agent-browser open https://apr-dashboard-v3.vercel.app
agent-browser set viewport 1920 1080
```

Wait for page to load fully. Take a pre-recording screenshot as baseline:

```bash
agent-browser screenshot ~/Development/APR-Dashboard-v3/builds/demo-video/pre-record-baseline.png
```

### 2. Navigate to the client intake form

Use snapshot to find the form entry point:

```bash
agent-browser snapshot -i
```

Click whatever link/button gets to the intake form (likely "New Appraisal" or similar from the dashboard).

### 3. Start recording

```bash
agent-browser record start ~/Development/APR-Dashboard-v3/builds/demo-video/client-form-test.webm
```

### 4. Fill in the form — SLOWLY

This is a demo video. Pace matters. Between each action:
- Wait 1-2 seconds (use `sleep 1` or `sleep 2` between agent-browser commands)
- Let animations/transitions finish before the next action
- When typing, keep it readable

Fill in realistic test data:
- Client name: "Harbourfront Properties Ltd"
- Contact: "Chris Morrison"
- Email: "chris@harbourfront.ca"
- Phone: "416-555-0123"
- Property address: "123 Queens Quay West, Toronto, ON M5J 2N2"
- Any dropdowns — click to OPEN them (pause so viewer sees options), then select

You don't need to fill every field. Hit 6-8 fields across the form to show the flow.

### 5. Show a dropdown

When you encounter a dropdown/select field:
1. Click to open it
2. Wait 1 second (let viewer see the options)
3. Select a value
4. Wait 1 second

This is the key moment Chris will care about — seeing the Valta field options populated.

### 6. Stop recording

```bash
agent-browser record stop
```

### 7. Take a post-recording screenshot

```bash
agent-browser screenshot ~/Development/APR-Dashboard-v3/builds/demo-video/post-record-final.png
```

### 8. Convert to MP4

```bash
ffmpeg -i ~/Development/APR-Dashboard-v3/builds/demo-video/client-form-test.webm \
  -c:v libx264 -preset slow -crf 18 -c:a aac -b:a 128k \
  ~/Development/APR-Dashboard-v3/builds/demo-video/client-form-test.mp4
```

### 9. Get file info

```bash
ls -lh ~/Development/APR-Dashboard-v3/builds/demo-video/
ffprobe ~/Development/APR-Dashboard-v3/builds/demo-video/client-form-test.webm 2>&1 | grep -E "Duration|Video|Stream"
ffprobe ~/Development/APR-Dashboard-v3/builds/demo-video/client-form-test.mp4 2>&1 | grep -E "Duration|Video|Stream"
```

### 10. Report back

Send results to react-spec-5 on dev-9:

```bash
tmux send-keys -t dev-9 'QA-4->react-spec-5: Video test complete. Files in builds/demo-video/. WebM: {size}, {duration}, {resolution}. MP4: {size}. Issues: {any issues or "none"}. Quality assessment: {your take on whether this is client-demo ready}.' Enter
```

## Known Risks (from research)

- Playwright engine underneath has hardcoded 1 Mbps bitrate — quality may look compressed
- macOS Chromium has documented black screen issues (low risk locally)
- Recording adds slight overhead — actions may feel slower
- If video comes out black or corrupt, try playwright-cli as fallback:
  ```bash
  playwright-cli open https://apr-dashboard-v3.vercel.app
  playwright-cli resize 1920 1080
  playwright-cli video-start
  # ... same form fill steps ...
  playwright-cli video-stop
  playwright-cli close
  ```

## DO NOT

- Don't submit the form (we don't want test data in production Valcre)
- Don't spend time debugging the form itself — this is about the VIDEO capability
- Don't record more than one section — keep it short (30-60 seconds of footage)
