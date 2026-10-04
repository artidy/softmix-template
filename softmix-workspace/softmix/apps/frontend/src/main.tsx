import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';

import '@fontsource-variable/inter';
import './index.css';

import App from './app/app';
import { store } from './app/store';
import { verify } from './app/store/user-data/api-actions';
import { getCart } from './app/store/cart-data/api-actions';
import { Toaster } from './app/ui/toaster';

store.dispatch(verify());
store.dispatch(getCart());

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <Toaster />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
);
