import { useState } from 'react';
import { Graph } from './components/Graph';
import './App.css';

function App() {
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(true);

  return (
    <div className="App">
      <header className="app-header">
        <h1>Graph AI - Node-based AI Tool</h1>
        <div className="header-controls">
          <button 
            onClick={() => setShowApiKeyInput(!showApiKeyInput)}
            className="api-key-toggle"
          >
            {showApiKeyInput ? 'Hide' : 'Show'} API Key
          </button>
          {showApiKeyInput && (
            <div className="api-key-input">
              <input
                type="password"
                placeholder="Enter Hugging Face API Key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              <small>
                Get your API key from{' '}
                <a 
                  href="https://huggingface.co/settings/tokens" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Hugging Face
                </a>
              </small>
            </div>
          )}
        </div>
      </header>
      
      <main className="app-main">
        <Graph apiKey={apiKey} />
      </main>
      
      <footer className="app-footer">
        <p>
          Connect nodes to create AI workflows. Text nodes generate text, 
          Image nodes generate images. Results flow from one node to the next.
        </p>
      </footer>
    </div>
  );
}

export default App;