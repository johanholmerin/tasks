import { h } from 'preact';
import styles from './Button.css';

export default function Button({ className, children, ...rest }) {
  return (
    <button className={[styles.button, className]} {...rest}>
      {children}
    </button>
  );
}
