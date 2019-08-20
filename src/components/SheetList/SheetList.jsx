import { h } from 'preact';
import styles from './SheetList.css';
import Sheet from '../Sheet/Sheet.jsx';

export default function SheetList({ onClose, items, title, label }) {
  return (
    <Sheet onClose={onClose} label={label}>
      <div className={[styles.wrapper]} role="list">
        {title && <h2 id="modal_label" className={[styles.title]}>{title}</h2>}
        {items.map(item => (
          <div role="listitem" key={item.label}>
            <button
              className={[styles.button, item.disabled && styles.disabled]}
              onClick={event => item.onClick(event)}
              disabled={item.disabled}
            >{item.label}</button>
          </div>
        ))}
      </div>
    </Sheet>
  );
}
