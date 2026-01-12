
# n8n Workflow Audit Prompt Template & HTTP Request Payload Guidance

---

## n8n Workflow Audit Request
`!!execute full_analysis`

---

### Workflow & Requirements

```json
{
  "workflow": "{{PASTE_JSON}}",
  "requirements": {
    "environment": "n8n-cloud@1.9.2",
    "integrations": ["Supabase", "Pipedrive", "GHL"],
    "validation_level": "production-grade"
  },
  "tests": [
    "syntax_validation",
    "node_compatibility_matrix",
    "data_schema_compliance_check",
    "stress_scenarios: [normal, partial_failure, load]"
  ]
}
```

---

### Output Requirements

1. **AST-Based Flow Analysis Table**  
   - Node-by-node logic, relationships, and parallelization potential.
2. **Compliance Checklist**  
   - Reference `/project-files/n8n-standards.md`.
3. **Security Audit**  
   - Map findings to OWASP ASVS controls.
4. **Optimization Potential Matrix**  
   - Highlight rate limits, bottlenecks, and efficiency opportunities.
5. **Version-Specific Deprecation Warnings**  
   - Warn of any deprecated nodes, features, or parameters.

---

### HTTP Request Node Validation
_(**Add this to all future audit requests!**)_  

- **Audit every HTTP Request node for payload structure:**  
  Ensure all HTTP bodies match the official requirements of the target external API.
- **ClickUp Custom Fields (Critical):**  
  - Confirm that the `custom_fields` property in the request body is a valid JSON array of objects.
  - Each object must contain correct `id` and `value` keys.
  - The payload must **not** be a stringified object, raw string, or improperly escaped JSON.
  - Flag any node that sends an incorrect or non-JSON-compliant body.
  - Recommend or provide the correct example body for ClickUp or similar APIs.

---

### Do NOT

- Summarize unless explicitly asked.
- Suggest non-web node alternatives.
- Proceed without explicit `!!execute` confirmation.

---

## How to Submit for Audit

- You may submit a **full workflow JSON** or send **individual node JSONs** (node-by-node) for detailed, granular review and correction.
- When sending nodes individually, use the standard n8n node import/export format for best results.

---

**Use this prompt to guarantee your n8n audits catch every structural, compliance, security, and payload formatting issue—especially with tricky integrations like ClickUp.**
