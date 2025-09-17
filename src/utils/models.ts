import { ModelInfo, ModelCategory } from '../types';

const HF_MODELS_API = 'https://huggingface.co/api/models';

// Popular models by category (fallback if API fails)
const POPULAR_TEXT_MODELS: ModelInfo[] = [
  { 
    id: 'gpt2', 
    author: 'openai', 
    tags: ['text-generation'],
    task: 'text-generation',
    description: 'GPT-2 is a large transformer-based language model with 1.5 billion parameters'
  },
  { 
    id: 'microsoft/DialoGPT-medium', 
    author: 'microsoft', 
    tags: ['conversational'],
    task: 'text-generation',
    description: 'A medium-sized generative response model for multi-turn conversations'
  },
  { 
    id: 'distilgpt2', 
    author: 'distilbert', 
    tags: ['text-generation'],
    task: 'text-generation',
    description: 'Distilled version of GPT-2: smaller, faster, cheaper, lighter'
  },
  { 
    id: 'EleutherAI/gpt-neo-2.7B', 
    author: 'EleutherAI', 
    tags: ['text-generation'],
    task: 'text-generation',
    description: 'GPT-Neo 2.7B is a transformer model designed for text generation'
  }
];

const POPULAR_IMAGE_MODELS: ModelInfo[] = [
  { 
    id: 'runwayml/stable-diffusion-v1-5', 
    author: 'runwayml', 
    tags: ['diffusers', 'text-to-image'],
    task: 'text-to-image',
    description: 'Stable Diffusion is a latent text-to-image diffusion model'
  },
  { 
    id: 'stabilityai/stable-diffusion-2-1', 
    author: 'stabilityai', 
    tags: ['diffusers', 'text-to-image'],
    task: 'text-to-image',
    description: 'Stable Diffusion 2.1 - improved version with better quality'
  },
  { 
    id: 'prompthero/openjourney', 
    author: 'prompthero', 
    tags: ['diffusers', 'stable-diffusion'],
    task: 'text-to-image',
    description: 'Openjourney is a Stable Diffusion fine tuned model on Midjourney images'
  },
  { 
    id: 'dreamlike-art/dreamlike-diffusion-1.0', 
    author: 'dreamlike-art', 
    tags: ['diffusers', 'stable-diffusion'],
    task: 'text-to-image',
    description: 'Dreamlike Diffusion is a SD model fine tuned on dreamy art'
  }
];

export class ModelService {
  private cache: Map<string, ModelInfo[]> = new Map();
  private lastFetch: Map<string, number> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  async getTextModels(): Promise<ModelInfo[]> {
    return this.getModels('text-generation');
  }

  async getImageModels(): Promise<ModelInfo[]> {
    return this.getModels('text-to-image');
  }

  private async getModels(task: string): Promise<ModelInfo[]> {
    const cacheKey = task;
    const now = Date.now();
    const lastFetch = this.lastFetch.get(cacheKey) || 0;

    // Return cached data if available and fresh
    if (this.cache.has(cacheKey) && (now - lastFetch < this.CACHE_DURATION)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      // Try to fetch from Hugging Face API
      const response = await fetch(`${HF_MODELS_API}?task=${task}&sort=downloads&direction=-1&limit=20`);
      
      if (response.ok) {
        const models = await response.json();
        const modelInfos: ModelInfo[] = models.map((model: any) => ({
          id: model.id,
          author: model.author,
          downloads: model.downloads,
          likes: model.likes,
          tags: model.tags || [],
          task: task,
          description: model.description || `${model.id} model for ${task}`
        }));

        this.cache.set(cacheKey, modelInfos);
        this.lastFetch.set(cacheKey, now);
        return modelInfos;
      }
    } catch (error) {
      console.warn('Failed to fetch models from Hugging Face API:', error);
    }

    // Fallback to popular models
    const fallbackModels = task === 'text-generation' ? POPULAR_TEXT_MODELS : POPULAR_IMAGE_MODELS;
    this.cache.set(cacheKey, fallbackModels);
    this.lastFetch.set(cacheKey, now);
    return fallbackModels;
  }

  getModelCategories(): ModelCategory[] {
    return [
      {
        name: 'Text Generation',
        task: 'text-generation',
        models: []
      },
      {
        name: 'Image Generation',
        task: 'text-to-image', 
        models: []
      }
    ];
  }

  getModelSetupInfo(modelId: string): { apiKeyInfo: string; documentation?: string } {
    return {
      apiKeyInfo: 'Get your free API key from Hugging Face: https://huggingface.co/settings/tokens',
      documentation: `https://huggingface.co/${modelId}`
    };
  }
}

export const modelService = new ModelService();