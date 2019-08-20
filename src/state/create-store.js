import _createStore from 'unistore';

/**
 * Add support for top level error handler
 */
export default function createStore(initialState, onerror) {
  const store = _createStore(initialState);

  const { action } = store;
  store.action = function(...args) {
    const fn = action.apply(this, args);
    return async function (...args) {
      try {
        return await fn.apply(this, args);
      } catch(error) {
        onerror(error);
      }
    };
  }

  return store;
}
