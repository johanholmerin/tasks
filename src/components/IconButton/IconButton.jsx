import { h } from 'preact';
import styles from './IconButton.css';

export default function IconButton({
  children,
  className,
  tag: Tag = 'button',
  ...rest
}) {
  return (
    <Tag type="button" className={[styles.button, className]} {...rest}>
      {children}
    </Tag>
  );
}
