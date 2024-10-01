// import React from 'react';
// import InputForm from './components/InputForm';

// function App() {
//   return (
//     <div className="app-container">
//       <h1>Stock Data Viewer</h1>
//       <InputForm />
//     </div>
//   );
// }

// export default App;

import React from 'react';
import InputForm from './components/InputForm';

function App() {
  return (
    <div className="app-container">
      {/* Link to the README Documentation */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <a href="https://github.com/danielkamenetsky/stockquery/blob/main/README.md" target="_blank" rel="noopener noreferrer">
          <button style={{ padding: '10px 20px', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            Click here for setup instructions
          </button>
        </a>
      </div>
      
      {/* Title and Input Form */}
      <h1>Stock Data Viewer</h1>
      <InputForm />
    </div>
  );
}

export default App;
