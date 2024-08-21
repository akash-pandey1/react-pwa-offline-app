import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux';
import App from './App.jsx'
import './index.css'
import { store } from './store/store.js';

// index.js or main.js (main entry point of your React app)

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').then(registration => {
      console.log('Service Worker registered with scope:', registration.scope);

      // Register Background Sync
      if ('sync' in registration) {
        registration.sync.register('sync-post-requests').then(() => {
          console.log('Background sync registered');
        }).catch(err => {
          console.error('Background sync failed:', err);
        });
      }

    }).catch(registrationError => {
      console.log('Service Worker registration failed:', registrationError);
    });
  });
}


ReactDOM.createRoot(document.getElementById('root')).render(

  

  <Provider store={store}> {/* Wrap App with Provider */}
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  </Provider>
)
