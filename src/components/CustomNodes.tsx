import React, { useState, useCallback } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { NodeData, ImageResult } from '../types';

interface CustomNodeProps extends NodeProps {
  data: NodeData;
}

export const TextNode: React.FC<CustomNodeProps> = ({ data }) => {
  const [prompt, setPrompt] = useState(data.prompt || '');
  const [isEditing, setIsEditing] = useState(false);

  const handlePromptSave = useCallback(() => {
    data.prompt = prompt;
    setIsEditing(false);
  }, [prompt, data]);

  return (
    <div className="node-container text-node">
      <Handle type="target" position={Position.Top} />
      
      <div className="node-header">
        <h3>{data.label}</h3>
        <span className="node-type">Text</span>
      </div>
      
      <div className="node-content">
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
    </div>
  );
};

export const ImageNode: React.FC<CustomNodeProps> = ({ data }) => {
  const [prompt, setPrompt] = useState(data.prompt || '');
  const [isEditing, setIsEditing] = useState(false);

  const handlePromptSave = useCallback(() => {
    data.prompt = prompt;
    setIsEditing(false);
  }, [prompt, data]);

  const imageResult = data.result as ImageResult | undefined;

  return (
    <div className="node-container image-node">
      <Handle type="target" position={Position.Top} />
      
      <div className="node-header">
        <h3>{data.label}</h3>
        <span className="node-type">Image</span>
      </div>
      
      <div className="node-content">
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
    </div>
  );
};