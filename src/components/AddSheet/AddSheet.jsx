import { h } from 'preact';
import { useState } from 'preact/hooks';
import styles from './AddSheet.css';
import { connect } from 'unistore/preact'
import { actions } from '../../store.js';
import Textarea from '../Textarea/Textarea.jsx';
import Sheet from '../Sheet/Sheet.jsx';
import IconButton from '../IconButton/IconButton.jsx';
import Button from '../Button/Button.jsx';
import DateSheet from '../DateSheet/DateSheet.jsx';
import DateChip from '../DateChip/DateChip.jsx';

const AddSheet = connect('selectedList', actions)(({
  selectedList,
  createTask,
  onClose
}) => {
  const [showNotes, setShowNotes] = useState(false);
  const [showDateSheet, setShowDateSheet] = useState(false);
  const [task, setTask] = useState({
    title: '',
    notes: '',
    due: undefined
  });

  function createTaskFromState() {
    onClose();

    if (!task.title && !task.notes && !task.due) return;

    createTask(selectedList, task);
  }

  if (showDateSheet) {
    return (
      <DateSheet
        date={task.due}
        onClose={() => setShowDateSheet(false)}
        onSave={due => setTask({ ...task, due })}
      />
    );
  }

  return (
    <Sheet onClose={createTaskFromState} label="Add task">
      <div className={[styles.wrapper]}>
        <Textarea
          autoFocus
          preventEnter
          placeholder="New task"
          value={task.title}
          onChange={e => setTask({ ...task, title: e.currentTarget.value })}
          className={[styles.title]}
        />

        {showNotes && <Textarea
          autoFocus
          placeholder="Add details"
          value={task.notes}
          onChange={e => setTask({ ...task, notes: e.currentTarget.value })}
          className={[styles.notes]}
        />}
        {task.due && <DateChip
          className={[styles.dateChip]}
          date={task.due}
          relative={false}
          onClick={() => setShowDateSheet(true)}
          clearButton
          onClear={() => setTask({ ...task, due: undefined })}
        />}

        <div className={[styles.bottom]}>
          <IconButton
            aria-label="Toggle notes"
            onClick={() => setShowNotes(true)}
          >
            <svg className={[styles.icon, showNotes && styles.iconActive]}>
              <path
                d="M3 18h12v-2H3v2zM3 6v2h18V6H3zm0 7h18v-2H3v2z"
                fill="currentColor"
              />
            </svg>
          </IconButton>
          <IconButton
            aria-label="Select date"
            onClick={() => setShowDateSheet(true)}
          >
            <svg className={[styles.icon]}>
              <path
                d="M19 4H18V2L16 2V4L8 4V2H6V4H5C3.89 4 3.01 4.9 3.01 6L3 20C3 21.1 3.89 22 5 22H19C20.1 22 21 21.1 21 20V6C21 4.9 20.1 4 19 4ZM19 20H5L5 9H19V20Z M16.777 12.1668L15.3635 10.7532L10.8402 15.2765L8.36766 12.804L6.95411 14.2175L10.8402 18.1036L16.777 12.1668Z"
                fill="currentColor"
              />
            </svg>
          </IconButton>

          <div className={[styles.spacer]} />

          <Button onClick={createTaskFromState} className={[styles.button]}>
            Save
          </Button>
        </div>
      </div>
    </Sheet>
  );
});

export default AddSheet;
