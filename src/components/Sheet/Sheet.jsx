import { h, Fragment } from 'preact';
import { useState, useRef, useEffect, useLayoutEffect } from 'preact/hooks';
import styles from './Sheet.css';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import Modal from '../Modal/Modal.jsx';

export default function Sheet({ children, onClose, label }) {
  const ref = useRef();

  useEffect(() => {
    const { current } = ref;
    disableBodyScroll(current);
    return () => enableBodyScroll(current);
  }, [ref]);

  const [atTop, setAtTop] = useState(false);
  useLayoutEffect(() => {
    setAtTop(ref.current.getBoundingClientRect().top === 0);
  }, [atTop]);

  return (
    <Modal onClose={onClose} label={label}>
      <div className={[styles.outer]}>
        <div className={[styles.wrapper, atTop && styles.atTop]} ref={ref}>
          {children}
        </div>
      </div>
    </Modal>
  );
}
