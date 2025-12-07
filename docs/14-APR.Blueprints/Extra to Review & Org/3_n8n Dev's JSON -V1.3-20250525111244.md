# 3. n8n Dev's JSON -V1.3

  

1. As part of any new build, I will provide a **Required Credentials** list, suggesting a name and type for each service.
2. You will then either confirm the names or provide the names of your existing credentials.
3. I will use those exact, confirmed names in the final configured JSON.

I have updated our master knowledge base document to include this new procedure under the "Build Standards & Best Practices" section. This will be our guide for all future projects.

Here is the updated master guide:

* * *

# **n8n Dev's JSON Guide KN Base**

**Document Location:** [View in ClickUp](https://app.clickup.com/8555561/v/dc/85319-15297/85319-67037)

Version: 1.4

Date: May 25, 2025

## **Table of Contents**

1. Core Principles & Role Definition
2. The Phased Workflow Build Process
3. Build Standards & Best Practices
    *   3.1. General Standards (All Workflows)
    *   3.2. Skeleton Workflow Standards
    *   3.3. Functional Workflow Standards
    *   3.4. Credential Handling Procedure (SOP)
4. Import Safety & Compatibility Rules
    *   4.1. Instruction Safety Override
    *   4.2. Clipboard Import Rules & Safe Strategy
    *   4.3. Field-Level Import Compatibility Matrix
5. Advanced Processes & Procedures
    *   5.1. Handling Complex Nodes (Manual Configuration)
    *   5.2. Workflow Validation Process
6. Case Study: Key Learnings from SCC Data Gathering Workflow

* * *

## **1\. Core Principles & Role Definition**

This section defines the purpose and core responsibilities of the n8n workflow builder.

*   **Purpose:** To generate clean, importable n8n workflows based on build guides, node instructions, or user input.
    *   **Supported Modes:Fully Functional Workflows:** Configured with all non-sensitive parameters.
    *   **Skeleton Workflows:** Placeholder nodes for planning and layout.
    *   **Core Responsibilities:**Parse node names, types, and execution order.
    *   Structure IF nodes, loops, and conditions correctly.
    *   Follow strict n8n export standards to generate fully importable workflows.
    *   Ask clarifying questions if input is ambiguous.
    *   Offer suggestions for optimization and documentation.

* * *

## **2\. The Phased Workflow Build Process**

Our success is built on a structured, multi-phase approach. This process is now a standard operating procedure.

*   **Phase 1: Skeleton First:** Always begin by creating a `[Skeleton]` workflow. The primary goal is to validate the logical flow, node connections, and visual layout _before_ adding complex parameters. This ensures a clean, importable foundation for every project.
*   **Phase 2: Safe Functional Configuration:** Once the skeleton is approved, create a `[Configured]` version. This step must adhere strictly to the **Instruction Safety Override** and **Clipboard Import Compatibility** rules. Prioritizing known-working parameter structures is paramount.
*   **Phase 3: Architectural Review & Iteration:** After a functional version exists, it should be reviewed for architectural soundness. This is the stage to identify and implement improvements like batch processing or advanced error handling.

* * *

## **3\. Build Standards & Best Practices**

### **3.1. General Standards (All Workflows)**

*   **Naming Convention:** All nodes must have a meaningful name using a `Name (Type)` format (e.g., "Get Users (HTTP Request)").
*   **Positioning:** Nodes should be positioned cleanly for visual clarity. A horizontal layout is preferred.
    *   Start node at position `[200, 200]`.
    *   Space nodes horizontally at `+300px` intervals.
    *   Keep vertical alignment (`Y`) consistent, branching vertically for IF/Switch nodes.
*   **Documentation:** Use Sticky Notes to explain complex logic, assumptions, or external system mappings.

### **3.2. Skeleton Workflow Standards**

*   **Purpose:** Skeletons are planning tools, node scaffolds, and blueprints for execution logic.
*   **Required Node Shape:** Every node must follow this format. The `id` field must be omitted. JSON
*   

```llvm
{
  "parameters": {},
  "name": "Name of Node (Type)",
  "type": "n8n-nodes-base.nodeType",
  "typeVersion": 2,
  "position": [x, y]
}
```

*   **Connections Format:** Structure connections using this exact schema.
    *   **Linear:**JSON
    *   

```prolog
  "connections": {
    "Start Node": {
      "main": [[{ "node": "Next Node", "type": "main", "index": 0 }]]
    }
  }
```

*       *   **IF Node:**JSON
    *   

```prolog
  "IF Node": {
    "main": [
      [{ "node": "True Branch Node", "type": "main", "index": 0 }],
      [{ "node": "False Branch Node", "type": "main", "index": 0 }]
    ]
  }
```

*   **Common Pitfalls to Avoid:** | Mistake | Result | | :--- | :--- | | Missing `"parameters": {}` | Node fails to render | | Empty `"connections"` map | No execution path — logic is lost | | Incorrect `"typeVersion"` | Node appears blank or crashes on import | | No `"type"` in node name | Workflow fails to load entirely |

### **3.3. Functional Workflow Standards**

*   **Node Configuration:** Every node should have a meaningful name, complete and valid parameters, and correct type information.
*   **Credentials:** Always reference credentials by **name only**. Never embed tokens or secrets in parameters.
*   **Naming Clarity:** Use consistent, human-readable names. | Bad Name | Good Name | | :--- | :--- | | “Node 1” | “Check Lead Status (IF)” | | “Webhook A” | “Trigger on Contact Form (Webhook)” |
*   **Summary Table:** | Must Do | Never Do | | :--- | :--- | | Use exact `type`, `typeVersion`, `position` | Omit `parameters` or `type` | | Reference creds by name only | Embed secrets or hardcode tokens | | Use expressions for dynamic values | Use templating without `{{$json...}}` | | Connect all nodes with full paths | Leave logic floating (disconnected nodes) | | Validate each branch on import | Assume IF/loops will just work automatically |

### **3.4. Credential Handling Procedure (SOP)**

To ensure a seamless and secure connection between the workflow JSON and the n8n credential store, we will follow this standardized procedure for every build.

*   **Step 1: Identification & Suggestion:** The Knowledge Manager will identify all required credentials for a workflow and provide a `Required Credentials` list as part of the initial build plan. This list will include a suggested name and the required type.
    *   **Example:** | Suggested Name | Type | Used For | | :--- | :--- | :--- | | `ClickUp API Token` | Header Auth | ClickUp API | | `Perplexity API Credential` | Header Auth | Perplexity API |
*   **Step 2: Confirmation:** The user will review the list and either (a) create new credentials in their n8n instance with the suggested names, or (b) provide the exact names of their existing, equivalent credentials.
*   **Step 3: Implementation:** The Knowledge Manager will use these confirmed names in the final configured workflow JSON. This ensures that when the workflow is imported, n8n automatically and securely links each node to the correct pre-existing credential.

* * *

## **4\. Import Safety & Compatibility Rules**

This is the most critical section for ensuring workflows are importable without errors.

### **4.1. Instruction Safety Override**

The primary responsibility is to **generate workflows that load**, even if this means ignoring or omitting specific user-provided parameter configurations that would break the import. Always prioritize known-working structural patterns over blindly trusting provided instructions.

### **4.2. Clipboard Import Rules & Safe Strategy**

When importing via clipboard, strict compliance with the node’s UI-generated parameter shape is required.

*   Base each node on a UI-configured version that has been copy-paste tested.
*   **Do not manually add parameters** like `"authentication"`, `"jsonParameters"`, or `"bodyParametersJson"` unless the node was originally configured in the UI to include them.
*   Introduce new fields or blocks incrementally, verifying at each stage that the import remains valid.

### **4.3. Field-Level Import Compatibility Matrix**

Use this reference to determine which parameters are safe to include in workflow JSON.

| **Node Type** | **Disallowed Fields (Unless UI Adds Them)** |
| ---| --- |
| `n8n-nodes-base.httpRequest` | `authentication`, `jsonParameters`, `bodyParametersJson`, `headerParametersJson`, `responseFormat` |
| `n8n-nodes-base.set` | custom JSON keys outside `values.string` and `values.json` |

* * *

## **5\. Advanced Processes & Procedures**

### **5.1. Handling Complex Nodes (Manual Configuration)**

For nodes with complex configurations that may fail direct generation, use a two-step process:

1. Provide a **skeleton workflow** first.
2. The user imports the skeleton, configures the node in the n8n UI, and provides the resulting JSON.
3. Use the now-verified JSON structure to build out the final functional workflow.
*   **Example Manual Configuration Guide:** Present instructions to the user in a clear, table-based format that mirrors the n8n UI.

#### **Node 03 — Upsert Contact to GHL (HTTP Request)**

*   | UI Field Name | Value | | :--- | :--- | | Method | POST | | URL |

[

services.leadconnectorhq.com

https://services.leadconnectorhq.com/contacts/upsert

](https://services.leadconnectorhq.com/contacts/upsert)

*   | | Authentication | Generic Credential Type | | Auth Type | Header Auth | | ... | ... |

### **5.2. Workflow Validation Process**

When a workflow review is requested, use this structured validation process.

*       *   **Validation Requirements:Per-Node Configuration:** Verify `typeVersion`, credential syntax, required parameters, and URLs.
    *   **Data Flow Simulation:** Check I/O schema compatibility, array handling, and data transformations.
    *   **Connection Validation:** Ensure branch index consistency and proper error path configurations.
    *   **Security Audit:** Check for credential leakage and assess community node risks.
*   **Required Node Documentation Format for Validation:**Markdown
*   

```
## Node [X] - [Node Name]`(node-type · typeVersion [N])`**Connections**- Inputs: [Source Nodes]
- Outputs: [Destination Nodes]

**Parameters**```json
[ACTUAL PARAMETER CONFIG]


```

* * *

## **6\. Case Study: Key Learnings from SCC Data Gathering Workflow**

_This section summarizes the practical application of the above principles from our May 2025 project._

*       *   **Architectural Best Practices:Looping for Batch Processing:** If an initial node uses `splitIntoItems: true`, it **must** be followed by a looping mechanism (e.g., `SplitInBatches`) to ensure all items are processed.
    *   **Production-Grade Reliability:** For critical API calls, a `Catch Error` node should be considered for graceful failure handling. For maintainability, complex API bodies can be abstracted into a separate `Set` node.
    *   **Precision in Configuration:**Be specific with data requirements, differentiating between container IDs (like a ClickUp `List ID`) and content IDs (like `Custom Field IDs`).
    *   When iterating on a workflow, always modify the last "clean" JSON generated, not an export from the n8n canvas that contains instance-specific metadata.