import { useState } from 'react';
import './ModelSelector.css';

export default function ModelSelector({ available, selected, chairman, onChangeCouncil, onChangeChairman }) {
  const [open, setOpen] = useState(false);

  const toggle = (model) => {
    if (selected.includes(model)) {
      onChangeCouncil(selected.filter(m => m !== model));
    } else {
      onChangeCouncil([...selected, model]);
    }
  };

  const shortName = (model) => model.replace('bedrock/', '').replace('us.', '');

  return (
    <div className="model-selector">
      <button className="model-selector-toggle" onClick={() => setOpen(!open)}>
        ⚙ Models ({selected.length} council + chairman)
      </button>
      {open && (
        <div className="model-selector-panel">
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
