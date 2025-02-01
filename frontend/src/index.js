import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css'; // Global CSS
import App from './App'; // Import the main App component
import { BrowserRouter } from 'react-router-dom'; // React router

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);