import { h } from 'preact';
import { useState } from 'preact/hooks';
import styles from './TaskListExpand.css';

export default function TaskListExpand({ children, className, title }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={[className]}>
      <button
        className={[styles.button]}
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        aria-label="Toggle completed tasks"
      >
        <div className={[styles.title]}>{title}</div>
        <svg width="24" height="24">
          <path
            className={[styles.icon, expanded && styles.iconExpanded]}
            d="M6.74447 7.92413L12.0001 13.17L17.257 7.92358L18.667 9.33358L12.0001 16L5.33447 9.33413L6.74447 7.92413Z"
          />
        </svg>
      </button>
      <div hidden={!expanded} role="list">
        {children}
      </div>
    </div>
  );
}
