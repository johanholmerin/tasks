import { h, render } from 'preact';
import { loaded as loadedApi } from './state/api.js';
import { Provider } from 'unistore/preact'
import { store } from './store.js';
import App from './components/App/App.jsx';
import './utils/polyfills.js';

export const ROOT_ELEMENT = document.querySelector('#root');
export const PORTAL_ELEMENT = document.querySelector('#portal');

render(
  <Provider store={store}>
    <App ready={loadedApi} />
  </Provider>,
  ROOT_ELEMENT
);
