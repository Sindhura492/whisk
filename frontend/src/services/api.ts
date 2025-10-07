import axios from "axios";
import type {
  SpecRecord,
  GenerateSpecRequest,
  GenerateSpecResponse,
  RefineSpecRequest,
  RefineSpecResponse,
  CodeStubsRequest,
  CodeStubsResponse,
  GetSpecsResponse,
  GetSpecResponse,
} from "../types/spec";

const baseURL =
  (import.meta as any).env?.VITE_API_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear storage and redirect to login
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const apiClient = {
  /**
   * Generate a new specification from an idea
   * POST /api/specs/generate/
   */
  generateSpec: async (
    data: GenerateSpecRequest
  ): Promise<GenerateSpecResponse> => {
    const response = await api.post<GenerateSpecResponse>(
      "/specs/generate/",
      data
    );
    return response.data;
  },

  /**
   * Get all specifications (latest 10)
   * GET /api/specs/
   */
  getSpecs: async (): Promise<GetSpecsResponse> => {
    const response = await api.get<GetSpecsResponse>("/specs/");
    return response.data;
  },

  /**
   * Get a single specification by ID
   * GET /api/specs/:id/
   */
  getSpec: async (id: string): Promise<GetSpecResponse> => {
    const response = await api.get<GetSpecResponse>(`/specs/${id}/`);
    return response.data;
  },

  /**
   * Refine an existing specification with feedback
   * POST /api/specs/refine/:id/
   */
  refineSpec: async (
    id: string,
    data: RefineSpecRequest
  ): Promise<RefineSpecResponse> => {
    const response = await api.post<RefineSpecResponse>(
      `/specs/refine/${id}/`,
      data
    );
    return response.data;
  },

  /**
   * Generate code stubs from a specification
   * POST /api/code-stubs/
   */
  generateCodeStubs: async (
    data: CodeStubsRequest
  ): Promise<CodeStubsResponse> => {
    const response = await api.post<CodeStubsResponse>("/code-stubs/", data);
    return response.data;
  },
};

// Export types for convenience
export type {
  SpecRecord,
  GenerateSpecRequest,
  GenerateSpecResponse,
  RefineSpecRequest,
  RefineSpecResponse,
  CodeStubsRequest,
  CodeStubsResponse,
  GetSpecsResponse,
  GetSpecResponse,
};

// Re-export the AppSpec and related types
export type {
  AppSpec,
  SpecModule,
  SpecEntity,
  SpecField,
  SpecApi,
  SpecUI,
  FieldType,
} from "../types/spec";

export default api;
