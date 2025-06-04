import React from 'react'
import ReactDOM from 'react-dom/client'

// Simple inline component for testing
function TestApp() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>🕌 React is Working!</h1>
      <p>This is a test component</p>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TestApp />
  </React.StrictMode>,
)