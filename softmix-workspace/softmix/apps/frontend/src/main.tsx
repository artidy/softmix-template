import { StrictMode } from 'react';
import { Provider } from 'react-redux';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import "bootstrap/dist/css/bootstrap.min.css";
import 'react-toastify/dist/ReactToastify.css';
import "slick-carousel/slick/slick.css";
import "./plugins.css";
import "./styles.css";

import App from './app/app';
import { store } from './app/store';
import { verify } from './app/store/user-data/api-actions';
import { getCart } from './app/store/cart-data/api-actions';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

store.dispatch(verify());
store.dispatch(getCart());

root.render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ToastContainer/>
        <App/>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
