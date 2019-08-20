import { h } from 'preact';
import { useState } from 'preact/hooks';
import styles from './TaskItem.css';
import Checkbox from '../Checkbox/Checkbox.jsx';
import Link from '../Link/Link.jsx';
import DateChip from '../DateChip/DateChip.jsx';
import DateSheet from '../DateSheet/DateSheet.jsx';
import { findURLs, getAbsoluteURL } from '../../utils/urls.js';

function getNotes(notes) {
  return findURLs(notes).map((str, index) => {
    if (index % 2) {
      return (
        <a
          href={getAbsoluteURL(str)}
          className={[styles.link]}
          target="_blank"
          rel="noopener noreferrer"
        >{str}</a>
      );
    }

    return str;
  })
}

export default function Item({
  title,
  due,
  notes,
  id,
  completed,
  sub = false,
  onChange
}) {
  const [showDateSheet, setShowDateSheet] = useState(false);

  function onDateClick(event) {
    event.preventDefault();
    setShowDateSheet(true);
  }

  return (
    <div
      className={[
        styles.task,
        sub && styles.subtask,
        completed && styles.taskCompleted
      ]}
    >
      {sub && <div className={[styles.subtaskLine]}></div>}
      <div className={[styles.checkbox, sub && styles.subCheckbox]}>
        <Checkbox
          checked={completed}
          onChange={() => onChange({ completed: !completed })}
          aria-label="Toggle completed"
        />
      </div>
      <div className={[styles.content]}>
        <Link
          href={`task/${id}`}
          className={[styles.title]}
          style={{
            /* is removed by autoprefixer */
            '-webkit-box-orient': 'vertical'
          }}
        >
          <div className={[styles.titleFocus]} />
          <div className={[styles.titleText]}>{title}</div>
        </Link>
        {notes && <p
          className={[styles.notes]}
          style={{
            /* is removed by autoprefixer */
            '-webkit-box-orient': 'vertical'
          }}
        >{getNotes(notes)}</p>}
        {due && <DateChip date={due} onClick={onDateClick} />}
      </div>
      {showDateSheet && <DateSheet
        date={due}
        onClose={() => setShowDateSheet(false)}
        onSave={newDue => onChange({ due: newDue })}
      />}
    </div>
  );
}
