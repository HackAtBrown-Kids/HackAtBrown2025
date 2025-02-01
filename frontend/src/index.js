import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'; // Global CSS
import App from './App'; // Import the main App component
import { BrowserRouter as Router } from 'react-router-dom'; // React Router

ReactDOM.render(
  <React.StrictMode>
    <Router>  {/* Wrapping App with Router to enable routing */}
      <App />
    </Router>
  </React.StrictMode>,
  document.getElementById('root') // Mount the app on the root DOM element
);