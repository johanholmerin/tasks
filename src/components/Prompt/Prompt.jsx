import { h } from 'preact';
import { useRef } from 'preact/hooks';
import styles from './Prompt.css';
import Modal from '../Modal/Modal.jsx';

export default function Prompt({ message, value, placeholder, onClose }) {
  const inputRef = useRef();
  const onCancel = () => onClose(null);
  const onSave = event => {
    event.preventDefault();
    onClose(inputRef.current.value);
  };

  return (
    <Modal onClose={onCancel}>
      <form className={[styles.outer]} onSubmit={onSave}>
        <h2 id="modal_label" className={[styles.message]}>{message}</h2>
        <input
          className={[styles.input]}
          autoFocus
          value={value}
          placeholder={placeholder}
          ref={inputRef}
        />
        <div className={[styles.footer]}>
          <button
            type="button"
            className={[styles.button]}
            onClick={onCancel}
          >Cancel</button>
          <button
            type="submit"
            className={[styles.button, styles.coloredButton]}
          >Done</button>
        </div>
      </form>
    </Modal>
  );
}
