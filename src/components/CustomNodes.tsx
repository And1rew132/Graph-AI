import React, { useState, useCallback } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { NodeData, ImageResult } from '../types';
import { ModelConfigSidebar } from './ModelConfigSidebar';

interface CustomNodeProps extends NodeProps {
  data: NodeData;
  onModelChange?: (nodeId: string, model: string) => void;
}

export const TextNode: React.FC<CustomNodeProps> = ({ data, onModelChange }) => {
  const [prompt, setPrompt] = useState(data.prompt || '');
  const [isEditing, setIsEditing] = useState(false);
  const [showModelConfig, setShowModelConfig] = useState(false);

  const handlePromptSave = useCallback(() => {
    data.prompt = prompt;
    setIsEditing(false);
  }, [prompt, data]);

  const handleModelChange = useCallback((nodeId: string, model: string) => {
    if (onModelChange) {
      onModelChange(nodeId, model);
    }
  }, [onModelChange]);

  return (
    <div className="node-container text-node">
      <Handle type="target" position={Position.Top} />
      
      <div className="node-header">
        <h3>{data.label}</h3>
        <div className="node-header-actions">
          <span className="node-type">Text</span>
          <button 
            className="model-config-button"
            onClick={() => setShowModelConfig(true)}
            title="Configure Model"
          >
            ⚙️
          </button>
        </div>
      </div>
      
      <div className="node-content">
        <div className="model-display">
          <div className="model-display-label">Model:</div>
          <div className="model-display-value">{data.apiConfig?.model || 'gpt2'}</div>
        </div>

        {isEditing ? (
          <div className="prompt-editor">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your prompt..."
              rows={3}
            />
            <div className="editor-actions">
              <button onClick={handlePromptSave}>Save</button>
              <button onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
          </div>
        ) : (
          <div className="prompt-display" onClick={() => setIsEditing(true)}>
            {data.prompt || 'Click to add prompt...'}
          </div>
        )}
        
        {data.result && typeof data.result === 'string' && (
          <div className="result-display">
            <strong>Result:</strong>
            <p>{data.result}</p>
          </div>
        )}
      </div>
      
      <Handle type="source" position={Position.Bottom} />

      <ModelConfigSidebar
        isOpen={showModelConfig}
        onClose={() => setShowModelConfig(false)}
        nodeId={data.id}
        currentModel={data.apiConfig?.model || 'gpt2'}
        nodeType="text-gen"
        onModelChange={handleModelChange}
      />
    </div>
  );
};

export const ImageNode: React.FC<CustomNodeProps> = ({ data, onModelChange }) => {
  const [prompt, setPrompt] = useState(data.prompt || '');
  const [isEditing, setIsEditing] = useState(false);
  const [showModelConfig, setShowModelConfig] = useState(false);

  const handlePromptSave = useCallback(() => {
    data.prompt = prompt;
    setIsEditing(false);
  }, [prompt, data]);

  const handleModelChange = useCallback((nodeId: string, model: string) => {
    if (onModelChange) {
      onModelChange(nodeId, model);
    }
  }, [onModelChange]);

  const imageResult = data.result as ImageResult | undefined;

  return (
    <div className="node-container image-node">
      <Handle type="target" position={Position.Top} />
      
      <div className="node-header">
        <h3>{data.label}</h3>
        <div className="node-header-actions">
          <span className="node-type">Image</span>
          <button 
            className="model-config-button"
            onClick={() => setShowModelConfig(true)}
            title="Configure Model"
          >
            ⚙️
          </button>
        </div>
      </div>
      
      <div className="node-content">
        <div className="model-display">
          <div className="model-display-label">Model:</div>
          <div className="model-display-value">{data.apiConfig?.model || 'runwayml/stable-diffusion-v1-5'}</div>
        </div>

        {isEditing ? (
          <div className="prompt-editor">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter image generation prompt..."
              rows={3}
            />
            <div className="editor-actions">
              <button onClick={handlePromptSave}>Save</button>
              <button onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
          </div>
        ) : (
          <div className="prompt-display" onClick={() => setIsEditing(true)}>
            {data.prompt || 'Click to add prompt...'}
          </div>
        )}
        
        {imageResult && (
          <div className="image-result">
            <img 
              src={imageResult.url} 
              alt={imageResult.alt || 'Generated image'} 
              style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'contain' }}
            />
          </div>
        )}
      </div>
      
      <Handle type="source" position={Position.Bottom} />

      <ModelConfigSidebar
        isOpen={showModelConfig}
        onClose={() => setShowModelConfig(false)}
        nodeId={data.id}
        currentModel={data.apiConfig?.model || 'runwayml/stable-diffusion-v1-5'}
        nodeType="image-gen"
        onModelChange={handleModelChange}
      />
    </div>
  );
};