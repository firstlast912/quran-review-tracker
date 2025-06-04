import React from 'react';

export default function App() {
  console.log('✅ React App component rendered!');
  
  return (
    <div style={{ 
      padding: '2rem', 
      textAlign: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1>🕌 Quran Tracker</h1>
      <p>✅ React is working!</p>
      <p>🔧 Temporary test version</p>
      <button onClick={() => alert('Button works!')}>
        Test Button
      </button>
    </div>
  );
}