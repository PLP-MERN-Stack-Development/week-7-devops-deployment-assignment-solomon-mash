import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Toaster } from 'react-hot-toast';
import App from './App.jsx'
import AuthProvider from './context/AuthProvider'; 
import { BrowserRouter } from 'react-router-dom';


import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://ddf2a9a73b23d7fcdb7bf1be613c8c79@o4509671443267584.ingest.de.sentry.io/4509671445561424",
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true
});
createRoot(document.getElementById('root')).render(
  <StrictMode>
        <BrowserRouter>
    
        <AuthProvider>
        <Sentry.ErrorBoundary fallback={<p>An error occurred</p>}>
                <App />
        </Sentry.ErrorBoundary>
        </AuthProvider>
    <Toaster position="top-right" />
    </BrowserRouter>
  </StrictMode>,
)
