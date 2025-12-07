
# Custom Field ID Manual Confirmation

This guide explains how to manually discover custom field IDs and dropdown option IDs for any SaaS product or web app with a browser-accessible UI.

---

## Browser Console Method (Universal for Web Apps)

**Step-by-step:**
1. **Open the relevant record or task** in your web app where the dropdown or custom field exists.
2. Press **F12** (or right-click → Inspect) to open **Developer Tools**.
3. Click the **Network** tab.
4. **Change the value** of your dropdown or custom field in the UI.
5. Look for a `PATCH`, `POST`, or similar request in the Network tab, often to an endpoint like `/task/`, `/record/`, or `/update/`.
6. **Click on that request** and inspect the **payload/body** in the “Headers” or “Payload” section.
7. You’ll see field IDs, option IDs, and the value being set—**copy the relevant IDs** for your workflow or automation logic.

---

### Why this method is invaluable

- No need for API tokens or extra tools.
- Works for any custom field that can be edited in the web UI.
- Reveals the exact values and IDs the API expects—essential for automation and integrations.

---

### Example (for a dropdown field)

After changing a dropdown, the network request payload might look like:

```json
"custom_fields": [
  {
    "id": "94d41de3-f248-4957-903b-59bebe512d9b",
    "value": "71a2a74f-af85-43e5-8dc3-ef8ea5cd57db"  // This is the dropdown option ID for your selection
  }
]
```

---

**Tip:**  
This manual confirmation method works for nearly any modern SaaS web application, not just ClickUp. It is a core automation builder and workflow architect skill!

