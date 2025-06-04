import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

console.log('🔥 main.jsx loading...');

// Ensure the root element exists
const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('❌ Root element not found!');
  document.body.innerHTML = '<div style="text-align: center; padding: 2rem;"><h1>Error: Root element not found</h1></div>';
} else {
  console.log('✅ Root element found, mounting React app...');
  
  try {
    const root = createRoot(rootElement);
    root.render(
      <StrictMode>
        <App />
      </StrictMode>
    );
    console.log('✅ React app mounted successfully');
  } catch (error) {
    console.error('❌ Error mounting React app:', error);
    rootElement.innerHTML = `<div style="text-align: center; padding: 2rem;">
      <h1>Error loading app</h1>
      <p>${error.message}</p>
    </div>`;
  }
}