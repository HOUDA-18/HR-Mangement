import React from 'react';
import { createRoot } from 'react-dom/client';

// styles
import './index.scss';

// projct import
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ConfigProvider } from './contexts/ConfigContext';
import { AuthContextProvider } from 'contexts/authContext';

const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(
  
  <ConfigProvider>
    <AuthContextProvider>
        <App />
    </AuthContextProvider>
  </ConfigProvider>
);

reportWebVitals();
