import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { msalInstance } from './context/authConfig';
import { MsalProvider } from '@azure/msal-react';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <MsalProvider instance={msalInstance}>
    <App />
  </MsalProvider>
);
