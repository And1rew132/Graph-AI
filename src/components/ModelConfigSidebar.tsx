import React, { useState, useEffect } from 'react';
import { ModelConfigSidebarProps, ModelInfo } from '../types';
import { modelService } from '../utils/models';

export const ModelConfigSidebar: React.FC<ModelConfigSidebarProps> = ({
  isOpen,
  onClose,
  nodeId,
  currentModel,
  nodeType,
  onModelChange
}) => {
  const [models, setModels] = useState<ModelInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadModels();
    }
  }, [isOpen, nodeType]);

  const loadModels = async () => {
    setLoading(true);
    try {
      const modelList = nodeType === 'text-gen' 
        ? await modelService.getTextModels()
        : await modelService.getImageModels();
      setModels(modelList);
    } catch (error) {
      console.error('Failed to load models:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredModels = models.filter(model =>
    model.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (model.author && model.author.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleModelSelect = (modelId: string) => {
    onModelChange(nodeId, modelId);
    onClose();
  };

  const setupInfo = modelService.getModelSetupInfo(currentModel);

  if (!isOpen) return null;

  return (
    <div className="model-config-sidebar-overlay" onClick={onClose}>
      <div className="model-config-sidebar" onClick={(e) => e.stopPropagation()}>
        <div className="sidebar-header">
          <h3>Configure Model</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="sidebar-content">
          <div className="current-model-section">
            <h4>Current Model</h4>
            <div className="current-model">
              <code>{currentModel}</code>
            </div>
          </div>

          <div className="setup-info-section">
            <h4>Setup Information</h4>
            <div className="setup-info">
              <p><strong>API Key:</strong></p>
              <p className="info-text">{setupInfo.apiKeyInfo}</p>
              {setupInfo.documentation && (
                <p>
                  <strong>Documentation:</strong>{' '}
                  <a 
                    href={setupInfo.documentation} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="doc-link"
                  >
                    View on Hugging Face
                  </a>
                </p>
              )}
            </div>
          </div>

          <div className="model-selection-section">
            <h4>Select Different Model</h4>
            
            <div className="model-search">
              <input
                type="text"
                placeholder="Search models..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            {loading ? (
              <div className="loading">Loading models...</div>
            ) : (
              <div className="models-list">
                {filteredModels.map((model) => (
                  <div 
                    key={model.id} 
                    className={`model-item ${model.id === currentModel ? 'current' : ''}`}
                    onClick={() => handleModelSelect(model.id)}
                  >
                    <div className="model-info">
                      <div className="model-name">{model.id}</div>
                      {model.author && (
                        <div className="model-author">by {model.author}</div>
                      )}
                      {model.description && (
                        <div className="model-description">{model.description}</div>
                      )}
                    </div>
                    <div className="model-stats">
                      {model.downloads && (
                        <span className="stat">📥 {model.downloads.toLocaleString()}</span>
                      )}
                      {model.likes && (
                        <span className="stat">❤️ {model.likes}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="helpful-links-section">
            <h4>Helpful Links</h4>
            <ul className="helpful-links">
              <li>
                <a href="https://huggingface.co/models" target="_blank" rel="noopener noreferrer">
                  Browse all Hugging Face models
                </a>
              </li>
              <li>
                <a href="https://huggingface.co/settings/tokens" target="_blank" rel="noopener noreferrer">
                  Get your API key
                </a>
              </li>
              <li>
                <a href="https://huggingface.co/docs/api-inference/index" target="_blank" rel="noopener noreferrer">
                  API Documentation
                </a>
              </li>
              {nodeType === 'image-gen' && (
                <li>
                  <a href="https://huggingface.co/models?pipeline_tag=text-to-image" target="_blank" rel="noopener noreferrer">
                    Text-to-Image models
                  </a>
                </li>
              )}
              {nodeType === 'text-gen' && (
                <li>
                  <a href="https://huggingface.co/models?pipeline_tag=text-generation" target="_blank" rel="noopener noreferrer">
                    Text Generation models
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};