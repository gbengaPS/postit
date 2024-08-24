import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import axios from 'axios';
import { Provider } from 'react-redux';
import Routes from './components/Routes';
import store from './store';
import './assets/scss/postit.scss';

if (localStorage.getItem('postitToken')) {
  axios.defaults.headers.common['x-access-token'] =
    localStorage.getItem('postitToken');
}

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

createRoot(document.getElementById('app')).render(
  <StrictMode>
    <Provider store={store}>
      <Routes />
    </Provider>
  </StrictMode>
);
