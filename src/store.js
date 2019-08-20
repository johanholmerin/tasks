import createStore from './state/create-store.js';
import { onAuthChange } from './state/api.js';
import * as actions from './state/actions.js';
import { getInitialState } from './state/utils.js';

export { actions };

export function onError(error) {
  store.action(actions.setError)(error);
}

export const store = createStore(getInitialState(), onError);


/**
 * ==========================
 *  External event listeners
 * ==========================
 */

window.addEventListener('popstate', () => {
  store.action(actions.go)(location.href);
});

onAuthChange(signedIn => {
  store.action(actions.setSignin)(signedIn);
});
