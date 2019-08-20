import { h } from 'preact';
import styles from './Toast.css';

export default function Toast({ children }) {
  return (
    <div className={[styles.toast]} role="alert">{children}</div>
  );
}
