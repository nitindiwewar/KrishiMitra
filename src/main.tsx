import {StrictMode} from 'react';
import {AuthProvider} from './auth/authContext.tsx';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
<AuthProvider>
    <App />
  </AuthProvider>
  </StrictMode>,
);
