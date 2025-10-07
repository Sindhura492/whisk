# API Client Documentation

This document describes the API endpoints and TypeScript types used in the ERP AI frontend.

## Base Configuration

```typescript
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
```

Environment variable `VITE_API_URL` can be set in `.env` file.

## API Endpoints

### 1. Generate Specification

Generate a new technical specification from a business idea.

**Endpoint:** `POST /api/specs/generate/`

**Request Type:**
```typescript
interface GenerateSpecRequest {
  idea: string;
}
```

**Response Type:**
```typescript
interface GenerateSpecResponse {
  id: string;
  idea: string;
  spec_json: AppSpec;
  created_at: string;
  updated_at: string;
}
```

**Usage:**
```typescript
const spec = await apiClient.generateSpec({ idea: "Your app idea here" });
```

---

### 2. Get All Specifications

Retrieve all specifications (latest 10).

**Endpoint:** `GET /api/specs/`

**Response Type:**
```typescript
type GetSpecsResponse = SpecRecord[];
```

**Usage:**
```typescript
const specs = await apiClient.getSpecs();
```

---

### 3. Get Single Specification

Retrieve a specific specification by ID.

**Endpoint:** `GET /api/specs/:id/`

**Response Type:**
```typescript
interface GetSpecResponse {
  id: string;
  idea: string;
  spec_json: AppSpec;
  created_at: string;
  updated_at: string;
}
```

**Usage:**
```typescript
const spec = await apiClient.getSpec("uuid-here");
```

---

### 4. Refine Specification

Refine an existing specification with feedback/instructions.

**Endpoint:** `POST /api/specs/refine/:id/`

**Request Type:**
```typescript
interface RefineSpecRequest {
  feedback: string;
}
```

**Response Type:**
```typescript
interface RefineSpecResponse {
  id: string;
  idea: string;
  spec_json: AppSpec;
  created_at: string;
  updated_at: string;
}
```

**Usage:**
```typescript
const updatedSpec = await apiClient.refineSpec("uuid-here", {
  feedback: "Add user authentication module"
});
```

---

### 5. Generate Code Stubs

Generate Django/DRF implementation code from a specification.

**Endpoint:** `POST /api/code-stubs/`

**Request Type:**
```typescript
interface CodeStubsRequest {
  spec_id: string;
  language?: string;     // default: "python"
  framework?: string;    // default: "django"
}
```

**Response Type:**
```typescript
interface CodeStubsResponse {
  blueprint_id: string;
  module_name: string;
  language: string;
  framework: string;
  implementation: {
    models_py: string;
    serializers_py: string;
    views_py: string;
    urls_py: string;
  };
}
```

**Usage:**
```typescript
const code = await apiClient.generateCodeStubs({
  spec_id: "uuid-here",
  language: "python",
  framework: "django"
});
```

---

## TypeScript Type Definitions

### Field Types

```typescript
type FieldType =
  | "string"
  | "text"
  | "integer"
  | "number"
  | "boolean"
  | "date"
  | "datetime"
  | "email";
```

### Core Schema Types

```typescript
interface SpecField {
  name: string;
  type: FieldType;
  required?: boolean;
  unique?: boolean;
  max_length?: number;
  help_text?: string;
}

interface SpecEntity {
  name: string;
  fields: SpecField[];
}

interface SpecApi {
  method: "GET" | "POST" | "PATCH" | "DELETE" | "PUT";
  path: string;
  entity?: string;
  description?: string;
}

interface SpecUI {
  type: "Table" | "Form";
  name?: string;
  entity: string;
  columns?: string[];
  fields?: Array<{
    name: string;
    label?: string;
    type?: string;
    required?: boolean;
    placeholder?: string;
    help_text?: string;
  }>;
}

interface SpecModule {
  name: string;
  purpose: string;
  entities: SpecEntity[];
  apis: SpecApi[];
  ui: SpecUI[];
}

interface AppSpec {
  title: string;
  description: string;
  modules: SpecModule[];
  kpis: string[];
}

interface SpecRecord {
  id: string;
  idea: string;
  spec_json: AppSpec;
  created_at: string;
  updated_at: string;
}
```

## Error Handling

All API calls should be wrapped in try-catch blocks:

```typescript
try {
  const spec = await apiClient.generateSpec({ idea });
  // Handle success
} catch (err: any) {
  const errorMessage = err.response?.data?.error || "Failed to generate specification";
  // Handle error
}
```

## Example: Complete Workflow

```typescript
// 1. Generate a specification
const spec = await apiClient.generateSpec({
  idea: "Build an inventory management system"
});

// 2. View the specification
const fullSpec = await apiClient.getSpec(spec.id);

// 3. Refine if needed
const refinedSpec = await apiClient.refineSpec(spec.id, {
  feedback: "Add a reporting module with analytics dashboard"
});

// 4. Generate code
const codeStubs = await apiClient.generateCodeStubs({
  spec_id: refinedSpec.id,
  language: "python",
  framework: "django"
});

// 5. Access generated files
console.log(codeStubs.implementation.models_py);
console.log(codeStubs.implementation.serializers_py);
console.log(codeStubs.implementation.views_py);
console.log(codeStubs.implementation.urls_py);
```

