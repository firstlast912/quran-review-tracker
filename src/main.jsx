import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

console.log('🔥 main.jsx loading...');
console.log('📦 App component:', App);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

console.log('✅ React app mounted');