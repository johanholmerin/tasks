import { h } from 'preact';
import { memo } from 'preact/compat';
import { useRef, useCallback } from 'preact/hooks';
import styles from './Subtask.css';
import Checkbox from '../../Checkbox/Checkbox.jsx';
import Textarea from '../../Textarea/Textarea.jsx';
import useFocus from '../../../utils/use-focus.js';
import throttle from '../../../utils/throttle.js';

const Subtask = memo(({
  id,
  list,
  completed,
  title,
  updateTask,
  deleteTask
}) => {
  const inputRef = useRef();
  const deleteRef = useRef();
  const inputFocused = useFocus(inputRef, 100)
  const deleteFocused = useFocus(deleteRef);
  const isFocused = inputFocused || deleteFocused;

  const updateTaskThrottled = useCallback(throttle(updateTask, 1000), []);

  return (
    <div className={[styles.subtask]} role="listitem">
      <Checkbox
        checked={completed}
        onChange={() => updateTask(id, {
          completed: !completed
        })}
        className={[styles.checkbox]}
        small
        aria-label="Toggle completed"
      />
      <Textarea
        ref={inputRef}
        placeholder="Enter title"
        className={[styles.title]}
        value={title}
        onChange={e => {
          updateTaskThrottled(id, { title: e.currentTarget.value })
        }}
      />
      <button
        ref={deleteRef}
        className={[styles.deleteButton, !isFocused && styles.hide]}
        aria-label="Delete subtask"
        onClick={() => deleteTask(list, id)}
      >
        <svg width="21" height="21" >
          <path
            d="M16.625 5.609l-1.234-1.234L10.5 9.266 5.609 4.375 4.375 5.609 9.266 10.5l-4.891 4.891 1.234 1.234 4.891-4.891 4.891 4.891 1.234-1.234-4.891-4.891 4.891-4.891z"
            fill="currentColor"
          />
        </svg>
      </button>
    </div>
  );
});

export default Subtask;
