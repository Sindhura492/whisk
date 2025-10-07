// Field types for entity definitions
export type FieldType =
  | "string"
  | "text"
  | "integer"
  | "number"
  | "boolean"
  | "date"
  | "datetime"
  | "email";

// Field definition in an entity
export interface SpecField {
  name: string;
  type: FieldType;
  required?: boolean;
  unique?: boolean;
  max_length?: number;
  help_text?: string;
}

// Entity definition (database model)
export interface SpecEntity {
  name: string;
  fields: SpecField[];
}

// API endpoint definition
export interface SpecApi {
  method: "GET" | "POST" | "PATCH" | "DELETE" | "PUT";
  path: string;
  entity?: string;
  description?: string;
}

// UI component definition
export interface SpecUI {
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

// Module definition (feature/app module)
export interface SpecModule {
  name: string;
  purpose: string;
  entities: SpecEntity[];
  apis: SpecApi[];
  ui: SpecUI[];
}

// Complete application specification
export interface AppSpec {
  title: string;
  description: string;
  modules: SpecModule[];
  kpis: string[];
}

// Specification record from backend
export interface SpecRecord {
  id: string;
  idea: string;
  spec_json: AppSpec;
  created_at: string;
  updated_at: string;
}

// API Request/Response types
export interface GenerateSpecRequest {
  idea: string;
}

export interface GenerateSpecResponse extends SpecRecord {}

export interface RefineSpecRequest {
  feedback: string;
}

export interface RefineSpecResponse extends SpecRecord {}

export interface CodeStubsRequest {
  spec_id: string;
  language?: string;
  framework?: string;
}

export interface CodeStubsResponse {
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

export interface GetSpecsResponse extends Array<SpecRecord> {}

export interface GetSpecResponse extends SpecRecord {}

