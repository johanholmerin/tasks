import { h, Fragment } from 'preact';
import { useEffect } from 'preact/hooks';
import { createPortal } from 'preact/compat';
import styles from './Modal.css';
import { ROOT_ELEMENT, PORTAL_ELEMENT } from '../../index.jsx';

export default function Modal({ children, onClose, label }) {
  useEffect(() => {
    ROOT_ELEMENT.inert = true;
    return () => ROOT_ELEMENT.inert = false;
  }, []);

  return createPortal(
    <>
      <div className={[styles.scrim]} onClick={onClose} />
      <div role="dialog" aria-labelledby="modal_label" aria-label={label}>
        {children}
      </div>
    </>,
    PORTAL_ELEMENT
  );
}
