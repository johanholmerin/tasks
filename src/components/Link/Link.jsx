import { h } from 'preact';
import { actions, store } from '../../store.js';

const go = store.action(actions.go);

function onClick(event) {
  if (
    event.altKey ||
    event.ctrlKey ||
    event.metaKey ||
    event.shiftKey ||
    event.button !== 0
  ) return;

  if (event.currentTarget.origin !== location.origin) return;

  event.preventDefault();

  go(event.currentTarget.href);
}

export default function Link({ children, ...rest }) {
  return (
    <a {...rest} onClick={onClick}>
      {children}
    </a>
  );
}
