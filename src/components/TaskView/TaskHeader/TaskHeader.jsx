import { h } from 'preact';
import { useState } from 'preact/hooks';
import styles from './TaskHeader.css';
import IconButton from '../../IconButton/IconButton.jsx';
import useEventListener from '@use-it/event-listener';
import Link from '../../Link/Link.jsx';

function Shadow() {
  const [offset, setOffset] = useState(0);
  useEventListener('scroll', () => {
    setOffset(Math.max(Math.min(document.scrollingElement.scrollTop, 12), 0));
  }, window);

  return (
    <div
      className={[styles.background, styles.shadow]}
      style={{ transform: `translateY(${offset}px)` }}
    />
  );
}

export default function TaskHeader({ onDelete }) {
  return (
    <nav className={[styles.wrapper]}>
      <Shadow />
      <div className={[styles.background]} />
      <IconButton aria-label="Back" tag={Link} href="/">
        <svg width="24" height="24">
          <path
            d="M17.775 4.975L15.65 2.85l-9.9 9.9 9.9 9.9 2.121-2.123-7.774-7.774 7.778-7.778z"
            fill="currentColor"
          />
        </svg>
      </IconButton>
      <IconButton onClick={onDelete} aria-label="Delete note">
        <svg width="24" height="24">
          <path
            d="M15 5V4H9v1H4v2h1v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7h1V5h-5zm2 2H7v13h10V7zM9 18V9h2v9H9zm4 0V9h2v9h-2z"
            fill="currentColor"
            fill-rule="evenodd"
          />
        </svg>
      </IconButton>
    </nav>
  );
}
