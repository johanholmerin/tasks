import { h } from 'preact';
import { connect } from 'unistore/preact'
import { actions } from '../../store.js';
import styles from './TaskItem.css';
import Item from './Item.jsx';

const TaskItem = connect(undefined, actions)(({
  title,
  due,
  notes,
  id,
  completed,
  subtasks,
  updateTask
}) => {
  return (
    <div className={[styles.wrapper]} role="listitem">
      <Item
        title={title}
        due={due}
        notes={notes}
        id={id}
        completed={completed}
        onChange={change => updateTask(id, change)}
      />
      {subtasks && !!subtasks.length && <div role="list">
        {subtasks.map(subtask => (
          <div role="listitem" key={subtask.id}>
            <Item
              title={subtask.title}
              due={subtask.due}
              notes={subtask.notes}
              id={subtask.id}
              completed={subtask.completed}
              onChange={change => updateTask(subtask.id, change)}
              sub
            />
          </div>
        ))}
      </div>}
    </div>
  );
});

export default TaskItem;
