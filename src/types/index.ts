export interface NodeData {
  id: string;
  label: string;
  prompt: string;
  result?: string | ImageResult;
  nodeType: 'prompt' | 'image-gen' | 'text-gen';
  apiConfig?: {
    model?: string;
    parameters?: Record<string, unknown>;
  };
}

export interface ImageResult {
  type: 'image';
  url: string;
  blob?: Blob;
  alt?: string;
}

export interface GraphNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: NodeData;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: 'default';
}

export interface ApiResponse {
  success: boolean;
  data?: unknown;
  error?: string;
}

export interface HuggingFaceConfig {
  apiKey?: string;
  model: string;
  endpoint?: string;
}