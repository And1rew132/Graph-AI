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

export interface ModelInfo {
  id: string;
  author?: string;
  downloads?: number;
  likes?: number;
  tags?: string[];
  task?: string;
  description?: string;
}

export interface ModelCategory {
  name: string;
  task: string;
  models: ModelInfo[];
}

export interface ModelConfigSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  nodeId: string;
  currentModel: string;
  nodeType: 'text-gen' | 'image-gen';
  onModelChange: (nodeId: string, model: string) => void;
}