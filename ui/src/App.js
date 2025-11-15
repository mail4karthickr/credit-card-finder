/**
 * App.js - Placeholder component (not used in MCP widget bundle)
 * 
 * This file exists for development purposes but is not included in the production
 * widget bundles (card-list.js, card-compare.js). The actual widgets are mounted
 * directly from CardList.jsx and CardCompare.jsx.
 */

import React from 'react';

function App() {
  return (
    <div style={{ 
      padding: '2rem', 
      textAlign: 'center',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <h1>Wells Fargo Credit Card Finder</h1>
      <p>This is a placeholder. The actual widgets are bundled separately.</p>
      <ul style={{ textAlign: 'left', maxWidth: '600px', margin: '2rem auto' }}>
        <li><strong>CardList Widget:</strong> Built as <code>dist/card-list.js</code></li>
        <li><strong>CardCompare Widget:</strong> Built as <code>dist/card-compare.js</code></li>
      </ul>
      <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '2rem' }}>
        Run <code>npm run build</code> to generate widget bundles.
      </p>
    </div>
  );
}

export default App;
