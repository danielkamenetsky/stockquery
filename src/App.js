import React from 'react';
import InputForm from './components/InputForm';
import { ModernButton } from './components/ModernContainer';

function App() {
  return (
    <div className="trading-view-container">
      <div className="top-bar">
        {/* README link in top right */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%'
        }}>
          {/* Empty div for left side balance */}
          <div></div>

          {/* Centered title */}
          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: '500',
            color: 'var(--tv-text-color)',
            margin: 0,
          }}>
            Stock Data Viewer
          </h1>

          {/* README button on right */}
          <a
            href="https://github.com/danielkamenetsky/stockquery/blob/main/README.md"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none' }}
          >
            <ModernButton>
              README
            </ModernButton>
          </a>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        <InputForm />
      </div>
    </div>
  );
}

export default App;