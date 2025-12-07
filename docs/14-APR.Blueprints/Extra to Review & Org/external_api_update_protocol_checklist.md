
# External API Field Update Protocol Checklist

---

## Guiding Principle

**Never assume the payload structure, endpoint, or bulk-update support for custom fields (or complex objects) in any third-party SaaS API. Always check the current API documentation for the required endpoint, HTTP method, and payload structure before confirming or implementing node logic in n8n or any automation tool.**

---

## Audit Checklist

- **Always confirm the correct API endpoint and HTTP method for updating custom fields, properties, or sub-objects.**
    - Do not assume support for bulk updates, object arrays, or “convenience” endpoints found in other APIs or older versions.
- **Validate payload structure:**  
    - Ensure you are sending a valid object or array, per current API documentation—not a string, not a legacy format.
- **If an integration requires one call per field/property update, implement a loop or multiple nodes—do not attempt to batch unless explicitly documented.**
- **Flag any node implementation that assumes unsupported patterns (e.g., bulk updates via a task PUT/PATCH) or does not match current docs.**
- **Cite API docs or provide direct reference when confirming the chosen endpoint and payload for an update operation.**
- **If in doubt, perform a real-world test and document the result in the audit.**
- **Make this check for every external SaaS integration node or workflow build.**

---

## Summary Principle

> API field updates—especially for custom fields, nested data, or integrations—must be implemented per the current documentation for each tool. Never assume batch, array, or shortcut support unless it’s documented. Validate endpoint, method, and body every time.

---

**This ensures all your n8n (or other automation) integrations remain robust, future-proof, and API-compliant—no matter what SaaS or service you connect.**
