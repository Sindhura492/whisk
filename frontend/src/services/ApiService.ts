interface ApiInfo {
  name: string
  version: string
  description: string
  endpoints: Record<string, string>
}

class ApiService {
  private static baseUrl = '/api'

  static async getApiInfo(): Promise<ApiInfo> {
    const response = await fetch(`${this.baseUrl}/info/`)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return response.json()
  }

  static async healthCheck(): Promise<{ status: string; message: string }> {
    const response = await fetch(`${this.baseUrl}/health/`)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return response.json()
  }
}

export { ApiService }
export type { ApiInfo }
