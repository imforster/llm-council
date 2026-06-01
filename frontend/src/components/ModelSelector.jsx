import { useState } from 'react';
import './ModelSelector.css';

export default function ModelSelector({ available, selected, chairman, apiKey, onChangeCouncil, onChangeChairman, onChangeApiKey }) {
  const [open, setOpen] = useState(false);
  const [testStatus, setTestStatus] = useState(null); // null | 'testing' | 'ok' | 'failed'

  const toggle = (model) => {
    if (selected.includes(model)) {
      onChangeCouncil(selected.filter(m => m !== model));
    } else {
      onChangeCouncil([...selected, model]);
    }
  };

  const testKey = async () => {
    setTestStatus('testing');
    try {
      const resp = await fetch('http://localhost:8001/api/test-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ api_key: apiKey }),
      });
      setTestStatus(resp.ok ? 'ok' : 'failed');
    } catch {
      setTestStatus('failed');
    }
  };

  const shortName = (model) => model.replace('bedrock/', '').replace('us.', '');

  return (
    <div className="model-selector">
      <button className="model-selector-toggle" onClick={() => setOpen(!open)}>
        ⚙ Models ({selected.length} council + chairman) {apiKey ? '🔑' : ''}
      </button>
      {open && (
        <div className="model-selector-panel">
          <div className="model-section">
            <h4>API Key</h4>
            <div className="api-key-row">
              <input
                type="password"
                className="api-key-input"
                placeholder="bedrock-api-key-..."
                value={apiKey}
                onChange={e => { onChangeApiKey(e.target.value); setTestStatus(null); }}
              />
              <button
                className={`test-key-button ${testStatus || ''}`}
                onClick={testKey}
                disabled={!apiKey || testStatus === 'testing'}
              >
                {testStatus === 'testing' ? '...' : testStatus === 'ok' ? '✓' : testStatus === 'failed' ? '✗' : 'Test'}
              </button>
            </div>
            <span className="api-key-hint">
              {testStatus === 'ok' ? '✓ Key is valid' : testStatus === 'failed' ? '✗ Key is invalid or expired' : 'Optional — overrides .env value'}
            </span>
          </div>
          <div className="model-section">
            <h4>Council Members</h4>
            {available.map(model => (
              <label key={model} className="model-option">
                <input
                  type="checkbox"
                  checked={selected.includes(model)}
                  onChange={() => toggle(model)}
                />
                {shortName(model)}
              </label>
            ))}
          </div>
          <div className="model-section">
            <h4>Chairman</h4>
            <select value={chairman} onChange={e => onChangeChairman(e.target.value)}>
              {available.map(model => (
                <option key={model} value={model}>{shortName(model)}</option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
