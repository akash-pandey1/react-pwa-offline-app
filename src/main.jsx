import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux';
import App from './App.jsx'
import './index.css'
import { store } from './store/store.js';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}> {/* Wrap App with Provider */}
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  </Provider>
)
