# Gemini File Search API - INVALID_ARGUMENT Error Research Report

**Date:** 2025-12-13
**Issue:** 400 INVALID_ARGUMENT errors when importing TypeScript files into Gemini File Search stores
**Research Focus:** File size limits, quotas, TypeScript file support, and common error causes

---

## Executive Summary

Based on comprehensive research of official documentation, GitHub issues, and community forums, the `INVALID_ARGUMENT` error when importing TypeScript files into Gemini File Search stores is likely caused by one of three issues:

1. **File state timing**: Files must be in `ACTIVE` state before import (most likely cause)
2. **API client initialization**: Incorrect `api_version` parameter can cause malformed requests
3. **Individual file size**: Files exceeding 100 MB per file will fail

TypeScript (.ts) files are explicitly supported as part of "common programming language file types" in the File Search API.

---

## Key Findings

### 1. File Size Limits and Quotas

**Individual File Limits:**
- **Maximum per file:** 100 MB (for all non-video files)
- **Videos:** Up to 2 GB per file
- **Your situation:** 1.02 MB total across 5 TypeScript files = well within limits

**Store Quotas:**
- **Free tier:** 1 GB total storage
- **Tier 1:** 10 GB storage
- **Tier 2:** 100 GB storage
- **Tier 3:** 1 TB storage
- **Recommended:** Keep stores under 20 GB for optimal retrieval speed

**Verdict:** File size is NOT the issue. Your files are well within all limits.

**Sources:**
- [File Search Documentation](https://ai.google.dev/gemini-api/docs/file-search)
- [Google Gemini file upload size limits](https://www.datastudios.org/post/google-gemini-file-upload-size-limits-supported-types-and-advanced-document-processing)
- [Gemini File Upload Limits and Specifications](https://www.genspark.ai/spark/gemini-file-upload-limits-and-specifications/2ffeccb7-4004-4c3b-a6a4-ca989cd03eaa)

---

### 2. TypeScript File Support

**Official Support Status:**
- TypeScript (.ts) files are **explicitly supported** as part of "common programming language file types"
- File Search supports 150+ file types including:
  - Code files: Java, SQL, TypeScript, JavaScript, Python, PHP, Shell scripts
  - Documents: PDF, DOCX, TXT, JSON
  - Archives: ZIP files

**Verdict:** TypeScript files ARE supported. File type is NOT the issue.

**Sources:**
- [File Search Documentation](https://ai.google.dev/gemini-api/docs/file-search)
- [Gemini API File Search: A Web Developer Tutorial](https://www.philschmid.de/gemini-file-search-javascript)
- [Introducing the File Search Tool in Gemini API](https://blog.google/technology/developers/file-search-gemini-api/)

---

### 3. File State Requirements - MOST LIKELY CAUSE

**Critical Discovery:** Files must be in `ACTIVE` state before they can be imported into File Search stores.

#### File State Lifecycle

The Gemini API defines three file states:

1. **PROCESSING** - "File is being processed and cannot be used for inference yet"
2. **ACTIVE** - "File is processed and available for inference"
3. **FAILED** - "File failed processing"

#### The Problem

When you upload a file using `client.files.upload()`, the file initially enters `PROCESSING` state. If you immediately call `import_file()` before the file reaches `ACTIVE` state, it will fail with `INVALID_ARGUMENT`.

#### The Solution

You must wait for files to reach `ACTIVE` state before importing:

```python
# Step 1: Upload file
uploaded_file = client.files.upload(file=str(file_path))

# Step 2: WAIT FOR ACTIVE STATE (THIS IS MISSING FROM YOUR CODE)
import time
while uploaded_file.state.name == "PROCESSING":
    time.sleep(2)
    uploaded_file = client.files.get(name=uploaded_file.name)

if uploaded_file.state.name == "FAILED":
    raise Exception(f"File processing failed: {uploaded_file.error}")

# Step 3: Now safe to import
operation = client.file_search_stores.import_file(
    file_search_store_name=store.name,
    file_name=uploaded_file.name
)
```

**Important Notes:**
- Video files ALWAYS require state polling
- Other file types (text, PDF, images) usually become ACTIVE immediately
- TypeScript files may take a few seconds to process depending on size
- Use `client.files.get()` to refresh file state, not `uploaded_file.state` directly

**Sources:**
- [Using files API Documentation](https://ai.google.dev/api/files)
- [File API always PROCESSING - Forum Discussion](https://discuss.ai.google.dev/t/file-api-always-processing/85107)
- [File Search Stores API Reference](https://ai.google.dev/api/file-search/file-search-stores)

---

### 4. API Client Initialization Issues

**Secondary Potential Cause:** Incorrect client initialization can cause `INVALID_ARGUMENT` errors.

#### Known Issue

When initializing `genai.Client()` with an explicit `api_version` parameter, the SDK may construct malformed requests:

```python
# PROBLEMATIC CODE
from google import genai
from google.genai import types

client = genai.Client(
    http_options=types.HttpOptions(api_version='v1')  # ❌ Can cause issues
)
```

#### The Fix

Omit the `api_version` parameter entirely:

```python
# CORRECT CODE
from google import genai

client = genai.Client()  # ✅ Let SDK use default version
```

**What happens:** Specifying `api_version='v1'` can cause the client to send requests with field names the API doesn't recognize (like `fileData` instead of the correct field name), resulting in `INVALID_ARGUMENT: Unknown name "X" at 'Y': Cannot find field`.

**Sources:**
- [Invalid JSON payload error - GitHub Issue #1088](https://github.com/googleapis/python-genai/issues/1088)
- [Request contains an invalid argument when use uploaded PDF](https://discuss.ai.google.dev/t/request-contains-an-invalid-argument-when-use-uploaded-pdf/61977)

---

### 5. Common INVALID_ARGUMENT Error Causes

Based on analysis of GitHub issues and forum discussions:

#### Documented Causes:
1. **File not in ACTIVE state** (most common)
2. **Incorrect API client initialization** (api_version parameter)
3. **Missing required parameters** in API calls
4. **Incorrect data types** passed to API methods
5. **File exceeding size limits** (100 MB for non-video)

#### Related GitHub Issues:
- [Issue #1638](https://github.com/googleapis/python-genai/issues/1638) - File Search Store usage questions
- [Issue #1670](https://github.com/googleapis/python-genai/issues/1670) - FileSearchTool AttributeError
- [Issue #1088](https://github.com/googleapis/python-genai/issues/1088) - Invalid JSON payload with PDF uploads
- [Issue #1274](https://github.com/googleapis/python-genai/issues/1274) - INVALID_ARGUMENT when combining Function Calling with retrieval

**Sources:**
- [googleapis/python-genai GitHub Issues](https://github.com/googleapis/python-genai/issues)
- [Gemini API Developer Forum](https://discuss.ai.google.dev/)

---

## Recommended Fix

### Immediate Action Plan

**1. Add File State Polling**

This is the most likely fix for your issue:

```python
from google import genai
import time

client = genai.Client()

# Upload file
uploaded_file = client.files.upload(file=str(file_path))
print(f"File uploaded: {uploaded_file.name}, State: {uploaded_file.state.name}")

# Poll until ACTIVE
max_wait = 60  # seconds
elapsed = 0
while uploaded_file.state.name == "PROCESSING" and elapsed < max_wait:
    time.sleep(2)
    elapsed += 2
    uploaded_file = client.files.get(name=uploaded_file.name)
    print(f"State: {uploaded_file.state.name} (waited {elapsed}s)")

# Check for failure
if uploaded_file.state.name == "FAILED":
    print(f"File processing failed: {uploaded_file.error}")
    raise Exception(f"File {file_path} failed to process")

# Verify ACTIVE before import
if uploaded_file.state.name != "ACTIVE":
    raise Exception(f"File did not become ACTIVE after {max_wait}s")

print(f"File is ACTIVE, proceeding to import...")

# Now safe to import
operation = client.file_search_stores.import_file(
    file_search_store_name=store.name,
    file_name=uploaded_file.name
)

# Wait for import operation to complete
while not operation.done:
    time.sleep(2)
    operation = client.operations.get(operation)

print(f"Import complete for {file_path}")
```

**2. Verify Client Initialization**

Ensure your client is initialized without `api_version`:

```python
# Check your initialization
client = genai.Client()  # Should NOT have http_options parameter
```

**3. Alternative: Use Direct Upload Method**

Instead of upload-then-import, use the single-step method:

```python
operation = client.file_search_stores.upload_to_file_search_store(
    file=str(file_path),
    file_search_store_name=store.name,
    config={
        'display_name': file_path.name,
    }
)

# Wait for operation
while not operation.done:
    time.sleep(2)
    operation = client.operations.get(operation)
```

This method handles state transitions internally.

**Sources:**
- [File Search Documentation](https://ai.google.dev/gemini-api/docs/file-search)
- [Google Gen AI SDK Documentation](https://googleapis.github.io/python-genai/)

---

## Additional Context

### Import Operation is Async

After calling `import_file()`, you must poll the operation until complete:

```python
operation = client.file_search_stores.import_file(
    file_search_store_name=store.name,
    file_name=uploaded_file.name
)

# MUST WAIT FOR OPERATION
while not operation.done:
    time.sleep(5)
    operation = client.operations.get(operation)

# Check for errors
if operation.error:
    print(f"Import failed: {operation.error}")
```

### File Search Store States

File Search stores track document states:
- `state_unspecified`
- `processing`
- `active`
- `failed`

You can check store status:
```python
store = client.file_search_stores.get(name=store.name)
print(f"Active documents: {store.active_documents}")
print(f"Processing documents: {store.processing_documents}")
```

**Sources:**
- [File Search Stores Guide](https://hexdocs.pm/gemini_ex/file_search_stores.html)
- [Gemini File Search and File Stores for Easy RAG](https://www.raymondcamden.com/2025/11/17/gemini-file-search-file-stores-for-easy-rag)

---

## Pricing Note

- **Storage:** Free
- **Embeddings at query time:** Free
- **Initial indexing:** $0.15 per 1 million tokens
- **Retrieved tokens:** Standard context pricing

For 5 TypeScript files totaling 1.02 MB, indexing cost will be minimal (likely < $0.01).

**Sources:**
- [Introducing the File Search Tool in Gemini API](https://blog.google/technology/developers/file-search-gemini-api/)
- [Gemini API File Search Tutorial](https://medium.com/@abdulkadir9929/gemini-apis-new-file-search-tool-built-in-rag-for-everyone-e990c054dcff)

---

## Conclusion

**Root Cause:** The `INVALID_ARGUMENT` error is almost certainly caused by attempting to import files that are still in `PROCESSING` state rather than waiting for them to reach `ACTIVE` state.

**Solution:** Add file state polling after upload and before import, as shown in the recommended fix above.

**Confidence:** High - This matches the documented API behavior and is a common pattern in all official examples.

**Alternative Solutions:**
1. Use `upload_to_file_search_store()` instead of separate upload/import
2. Verify client initialization doesn't include `api_version` parameter

---

## References

All sources cited inline throughout the document. Key documentation:

- [File Search API Documentation](https://ai.google.dev/gemini-api/docs/file-search)
- [File Search Stores API Reference](https://ai.google.dev/api/file-search/file-search-stores)
- [Files API Reference](https://ai.google.dev/api/files)
- [Google Gen AI Python SDK](https://github.com/googleapis/python-genai)
- [Python GenAI SDK Documentation](https://googleapis.github.io/python-genai/)

Additional community resources:
- [Gemini API Developer Forum](https://discuss.ai.google.dev/)
- [Google GenAI GitHub Issues](https://github.com/googleapis/python-genai/issues)
