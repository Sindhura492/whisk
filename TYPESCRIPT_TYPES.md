# TypeScript Type System Documentation

This document describes the comprehensive TypeScript type system implemented for the ERP AI frontend.

## 📁 File Structure

```
frontend/src/
├── types/
│   ├── spec.ts          # All specification-related types
│   └── index.ts         # Central export point
└── services/
    ├── api.ts           # Typed API client
    └── README.md        # API documentation
```

## 🎯 Type Definitions

All types are defined in `frontend/src/types/spec.ts` and align with the backend JSON schema.

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

### SpecField

Defines a field within an entity (database column).

```typescript
interface SpecField {
  name: string;
  type: FieldType;
  required?: boolean;
  unique?: boolean;
  max_length?: number;
  help_text?: string;
}
```

**Example:**
```typescript
const field: SpecField = {
  name: "email",
  type: "email",
  required: true,
  unique: true,
  max_length: 255
};
```

### SpecEntity

Defines an entity (database model).

```typescript
interface SpecEntity {
  name: string;
  fields: SpecField[];
}
```

**Example:**
```typescript
const entity: SpecEntity = {
  name: "Product",
  fields: [
    { name: "name", type: "string", required: true },
    { name: "price", type: "number", required: true },
    { name: "description", type: "text" }
  ]
};
```

### SpecApi

Defines an API endpoint.

```typescript
interface SpecApi {
  method: "GET" | "POST" | "PATCH" | "DELETE" | "PUT";
  path: string;
  entity?: string;
  description?: string;
}
```

**Example:**
```typescript
const api: SpecApi = {
  method: "GET",
  path: "/api/products/",
  entity: "Product",
  description: "List all products"
};
```

### SpecUI

Defines a UI component (Table or Form).

```typescript
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
```

**Example:**
```typescript
const tableUI: SpecUI = {
  type: "Table",
  name: "Product List",
  entity: "Product",
  columns: ["name", "price", "created_at"]
};

const formUI: SpecUI = {
  type: "Form",
  name: "Create Product",
  entity: "Product",
  fields: [
    { name: "name", label: "Product Name", required: true },
    { name: "price", label: "Price", type: "number", required: true }
  ]
};
```

### SpecModule

Defines a module (feature/app).

```typescript
interface SpecModule {
  name: string;
  purpose: string;
  entities: SpecEntity[];
  apis: SpecApi[];
  ui: SpecUI[];
}
```

**Example:**
```typescript
const module: SpecModule = {
  name: "Inventory Management",
  purpose: "Manage product inventory and stock levels",
  entities: [
    {
      name: "Product",
      fields: [
        { name: "sku", type: "string", required: true, unique: true },
        { name: "name", type: "string", required: true },
        { name: "quantity", type: "integer", required: true }
      ]
    }
  ],
  apis: [
    { method: "GET", path: "/api/products/", entity: "Product" },
    { method: "POST", path: "/api/products/", entity: "Product" }
  ],
  ui: [
    { type: "Table", entity: "Product", columns: ["sku", "name", "quantity"] },
    { type: "Form", entity: "Product", fields: [
      { name: "sku", required: true },
      { name: "name", required: true },
      { name: "quantity", required: true }
    ]}
  ]
};
```

### AppSpec

The complete application specification.

```typescript
interface AppSpec {
  title: string;
  description: string;
  modules: SpecModule[];
  kpis: string[];
}
```

**Example:**
```typescript
const appSpec: AppSpec = {
  title: "Inventory Management System",
  description: "A comprehensive solution for tracking products and stock",
  modules: [
    // ... modules
  ],
  kpis: [
    "Total Products",
    "Low Stock Items",
    "Total Inventory Value"
  ]
};
```

### SpecRecord

A specification record from the backend.

```typescript
interface SpecRecord {
  id: string;
  idea: string;
  spec_json: AppSpec;
  created_at: string;
  updated_at: string;
}
```

## 📡 API Request/Response Types

### GenerateSpecRequest

```typescript
interface GenerateSpecRequest {
  idea: string;
}
```

**Usage:**
```typescript
const request: GenerateSpecRequest = {
  idea: "Build an inventory management system"
};
```

### GenerateSpecResponse

```typescript
interface GenerateSpecResponse extends SpecRecord {}
```

### RefineSpecRequest

```typescript
interface RefineSpecRequest {
  feedback: string;
}
```

**Usage:**
```typescript
const request: RefineSpecRequest = {
  feedback: "Add user authentication module"
};
```

### RefineSpecResponse

```typescript
interface RefineSpecResponse extends SpecRecord {}
```

### CodeStubsRequest

```typescript
interface CodeStubsRequest {
  spec_id: string;
  language?: string;     // default: "python"
  framework?: string;    // default: "django"
}
```

**Usage:**
```typescript
const request: CodeStubsRequest = {
  spec_id: "123e4567-e89b-12d3-a456-426614174000",
  language: "python",
  framework: "django"
};
```

### CodeStubsResponse

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

### GetSpecsResponse

```typescript
interface GetSpecsResponse extends Array<SpecRecord> {}
```

### GetSpecResponse

```typescript
interface GetSpecResponse extends SpecRecord {}
```

## 🔧 Using the Types

### Import Types

```typescript
// Import from types directory
import type { AppSpec, SpecModule, SpecRecord } from '../types/spec';

// Or import from services (re-exported)
import type { SpecRecord } from '../services/api';
```

### In React Components

```typescript
import React, { useState } from 'react';
import type { SpecRecord } from '../types/spec';

export const MyComponent: React.FC = () => {
  const [spec, setSpec] = useState<SpecRecord | null>(null);
  
  // TypeScript will enforce the correct shape
  console.log(spec?.spec_json.title);
  console.log(spec?.spec_json.modules[0].name);
  
  return <div>{spec?.idea}</div>;
};
```

### With API Client

```typescript
import { apiClient } from '../services/api';
import type { GenerateSpecRequest, SpecRecord } from '../types/spec';

async function generateSpec(idea: string): Promise<SpecRecord> {
  const request: GenerateSpecRequest = { idea };
  const response = await apiClient.generateSpec(request);
  
  // TypeScript knows the response shape
  console.log(response.id);
  console.log(response.spec_json.title);
  
  return response;
}
```

## 🎯 Type Safety Benefits

1. **Autocomplete:** IDEs provide intelligent suggestions
2. **Error Prevention:** Catch type errors at compile time
3. **Refactoring:** Safe renames and restructuring
4. **Documentation:** Types serve as inline documentation
5. **API Contract:** Frontend and backend stay in sync

## ✅ Type Validation

TypeScript ensures:
- All required fields are present
- Field types match expectations
- No undefined property access
- API requests/responses match contracts

## 🔍 Example: Complete Type Flow

```typescript
// 1. User input (IdeaPage)
const idea: string = "Build an e-commerce platform";

// 2. API request
const request: GenerateSpecRequest = { idea };

// 3. API call with type safety
const spec: SpecRecord = await apiClient.generateSpec(request);

// 4. Access nested properties safely
const title: string = spec.spec_json.title;
const firstModule: SpecModule = spec.spec_json.modules[0];
const firstEntity: SpecEntity = firstModule.entities[0];
const firstField: SpecField = firstEntity.fields[0];

// 5. Type-safe rendering
const fieldType: FieldType = firstField.type; // Can only be valid FieldType

// TypeScript catches errors:
// spec.spec_json.modules[0].invalid_property // ❌ Error
// spec.spec_json.modules[0].entities[0].fields[0].type = "invalid" // ❌ Error
```

## 🚀 Best Practices

1. **Always use explicit types for state:**
   ```typescript
   const [spec, setSpec] = useState<SpecRecord | null>(null);
   ```

2. **Type your function parameters and returns:**
   ```typescript
   async function loadSpec(id: string): Promise<SpecRecord> { ... }
   ```

3. **Use type guards for runtime safety:**
   ```typescript
   if (spec && spec.spec_json.modules.length > 0) {
     // Safe to access
   }
   ```

4. **Avoid `any` type:**
   ```typescript
   // ❌ Bad
   const data: any = await apiClient.getSpec(id);
   
   // ✅ Good
   const data: SpecRecord = await apiClient.getSpec(id);
   ```

5. **Import types with `type` keyword:**
   ```typescript
   import type { SpecRecord } from '../types/spec';
   ```

## 📚 Resources

- Type definitions: `frontend/src/types/spec.ts`
- API client: `frontend/src/services/api.ts`
- API documentation: `frontend/src/services/README.md`
- Usage examples: See all page components in `frontend/src/pages/`

---

**All endpoints are fully typed and integrated! 🎉**

