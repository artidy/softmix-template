import React from 'react';
import ReactDOM from 'react-dom/client';
import {Provider} from "react-redux";
import reportWebVitals from './reportWebVitals';
import {ToastContainer} from "react-toastify";

import App from './components/app';
import {store} from "./store";

import './css/ecommerce.css';
import './css/libs.css';
import './css/style.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') ||
  document.createElement('div')
);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ToastContainer />
      <App />
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
