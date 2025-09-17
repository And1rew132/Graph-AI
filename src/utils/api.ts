import { HuggingFaceConfig, ApiResponse, ImageResult } from '../types';

const HF_API_BASE = 'https://api-inference.huggingface.co/models/';

export class HuggingFaceAPI {
  private apiKey: string;
  
  constructor(apiKey: string = '') {
    this.apiKey = apiKey;
  }

  private async makeRequest(endpoint: string, data: unknown): Promise<Response> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (this.apiKey) {
      headers.Authorization = `Bearer ${this.apiKey}`;
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    return response;
  }

  async generateText(config: HuggingFaceConfig, prompt: string): Promise<ApiResponse> {
    try {
      const endpoint = `${HF_API_BASE}${config.model}`;
      const response = await this.makeRequest(endpoint, {
        inputs: prompt,
        parameters: config.endpoint ? {} : { max_length: 100, temperature: 0.7 }
      });

      if (!response.ok) {
        return { success: false, error: `API Error: ${response.statusText}` };
      }

      const result = await response.json();
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: `Request failed: ${error}` };
    }
  }

  async generateImage(config: HuggingFaceConfig, prompt: string): Promise<ApiResponse> {
    try {
      const endpoint = `${HF_API_BASE}${config.model}`;
      const response = await this.makeRequest(endpoint, {
        inputs: prompt,
      });

      if (!response.ok) {
        return { success: false, error: `API Error: ${response.statusText}` };
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      const imageResult: ImageResult = {
        type: 'image',
        url,
        blob,
        alt: prompt
      };

      return { success: true, data: imageResult };
    } catch (error) {
      return { success: false, error: `Request failed: ${error}` };
    }
  }

  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
  }
}

// Default instance
export const huggingFaceAPI = new HuggingFaceAPI();