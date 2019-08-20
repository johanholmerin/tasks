import { h } from 'preact';
import styles from './Checkbox.css';

export default function Checkbox({ className, small = false, ...rest }) {
  return (
    <input
      type="checkbox"
      className={[styles.checkbox, small && styles.small, className]}
      {...rest}
    />
  );
}
