import { h } from 'preact';
import styles from './Loading.css';

export default function Loading() {
  return (
    <div className={[styles.container]}>
      <div className={[styles.wrapper]}>
        <svg className={[styles.svg]} viewBox="0 0 24 24">
          <circle className={[styles.circle]} cx="12" cy="12" r="10" />
        </svg>
      </div>
    </div>
  );
}
