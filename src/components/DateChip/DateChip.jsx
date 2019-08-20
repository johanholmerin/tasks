import { h } from 'preact';
import styles from './DateChip.css';
import { relativeDate, formatDate, beforeToday } from '../../utils/date.js';

export default function DateChip({
  date,
  onClick,
  className,
  relative = true,
  clearButton = false,
  onClear
}) {
  const dateObj = new Date(date);

  return (
    <div className={[styles.wrapper, className]}>
      <button
        className={[styles.button, clearButton && styles.buttonPadding]}
        onClick={onClick}
      >
        <svg
          className={[
            styles.icon,
            relative && beforeToday(dateObj) && styles.late
          ]}
          viewBox="0 0 24 24"
        >
          <path
            d="M19 4H18V2L16 2V4L8 4V2H6V4H5C3.89 4 3.01 4.9 3.01 6L3 20C3 21.1 3.89 22 5 22H19C20.1 22 21 21.1 21 20V6C21 4.9 20.1 4 19 4ZM19 20H5L5 9H19V20Z M16.777 12.1668L15.3635 10.7532L10.8402 15.2765L8.36766 12.804L6.95411 14.2175L10.8402 18.1036L16.777 12.1668Z"
            fill="currentColor"
          />
        </svg>
        {relative ? relativeDate(dateObj) : formatDate(dateObj)}
      </button>
      {clearButton && <button
        className={[styles.clearButton]}
        onClick={onClear}
        aria-label="Clear date"
      >
        <svg width="24" height="24">
          <path
            d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
            fill="currentColor"
          />
        </svg>
      </button>}
    </div>
  );
}
