import { h } from 'preact';
import { useState, useCallback } from 'preact/hooks';
import { connect } from 'unistore/preact'
import styles from './TaskView.css';
import { actions } from '../../store.js';
import TaskHeader from './TaskHeader/TaskHeader.jsx';
import Button from '../Button/Button.jsx';
import Textarea from '../Textarea/Textarea.jsx';
import { formatDate } from '../../utils/date.js';
import ChangeListSheet from '../ChangeListSheet/ChangeListSheet.jsx';
import DateSheet from '../DateSheet/DateSheet.jsx';
import Subtask from './Subtask/Subtask.jsx';
import ErrorToast from '../Toast/ErrorToast.jsx';
import throttle from '../../utils/throttle.js';

function withSubtasks(task, tasks) {
  // Completed tasks don't display subtasks
  if (task.completed) return task;

  return {
    ...task,
    subtasks: tasks.filter(subtask => {
      return subtask.parent === task.id && !subtask.completed;
    }).sort((a, b) => {
      return a.position.localeCompare(b.position);
    })
  };
}

function mapStateToProps({ lists, tasks, selectedTask }) {
  const task = tasks.find(({ id }) => id === selectedTask);
  // Loading
  if (!task) return {};

  const list = lists.find(({ id }) => id === task.list);
  return {
    list,
    task: withSubtasks(task, tasks)
  };
}

const TaskView = connect(mapStateToProps, actions)(({
  list,
  task,
  deleteTask,
  updateTask,
  createTask
}) => {
  // Loading
  if (!task) return null;

  const [showListsSheet, toggleListsSheet] = useState(false);
  const [showDateSheet, setShowDateSheet] = useState(false);

  const updateTaskThrottled = useCallback(throttle(updateTask, 1000), []);

  function addSubtask() {
    createTask(list.id, {
      parent: task.id,
      previous: (task.subtasks[task.subtasks.length - 1] || {}).id
    });
  }

  return (
    <div className={[styles.wrapper]}>
      <TaskHeader onDelete={() => deleteTask(list.id, task.id)} />
      <main>
        <Button
          onClick={() => toggleListsSheet(true)}
          className={[styles.listButton, task.completed && styles.disable]}
          disabled={task.completed}
          aria-label="Move task"
        >
          {list.title}
          <svg width="24" height="24">
            <path d="M7 10l5 5 5-5z" fill="currentColor" />
          </svg>
        </Button>
        {showListsSheet && <ChangeListSheet
          onClose={() => toggleListsSheet(false)}
          taskId={task.id}
          listId={task.list}
        />}

        <Textarea
          placeholder="Enter title"
          value={task.title}
          preventEnter
          onChange={event => {
            updateTaskThrottled(task.id, { title: event.currentTarget.value })
          }}
          className={[
            styles.title,
            task.completed && styles.disable,
            task.completed && styles.disableTitle
          ]}
          disabled={task.completed}
        />

        <div
          className={[
            styles.row,
            styles.notesRow,
            task.completed && styles.disable
          ]}
        >
          <svg className={[styles.icon]}>
            <path
              d="M3 18h12v-2H3v2zM3 6v2h18V6H3zm0 7h18v-2H3v2z"
              fill="currentColor"
            />
          </svg>
          <Textarea
            placeholder="Add details"
            className={[styles.notes]}
            value={task.notes}
            onChange={event => {
              updateTaskThrottled(task.id, { notes: event.currentTarget.value })
            }}
            disabled={task.completed}
          />
        </div>

        <div
          className={[
            styles.row,
            styles.notesRow,
            task.completed && styles.disable
          ]}
        >
          <svg className={[styles.icon]}>
            <path
              d="M19 4H18V2L16 2V4L8 4V2H6V4H5C3.89 4 3.01 4.9 3.01 6L3 20C3 21.1 3.89 22 5 22H19C20.1 22 21 21.1 21 20V6C21 4.9 20.1 4 19 4ZM19 20H5L5 9H19V20Z M16.777 12.1668L15.3635 10.7532L10.8402 15.2765L8.36766 12.804L6.95411 14.2175L10.8402 18.1036L16.777 12.1668Z"
              fill="currentColor"
            />
          </svg>
          {task.due ?
            <div className={[styles.dateButtonWrapper]}>
              <button
                className={[styles.dateButton]}
                onClick={() => setShowDateSheet(true)}
              >{formatDate(new Date(task.due))}</button>
              <button
                className={[styles.clearDate]}
                onClick={() => updateTask(task.id, { due: null })}
                aria-label="Clear date"
              >
                <svg width="20" height="20">
                  <path
                    d="M15.834 5.342l-1.175-1.175L10 8.825 5.342 4.167 4.167 5.342 8.825 10l-4.658 4.658 1.175 1.175L10 11.175l4.659 4.658 1.175-1.175L11.175 10l4.659-4.658z"
                    fill="currentColor"
                  />
                </svg>
              </button>
            </div> :
            <Button
              onClick={() => setShowDateSheet(true)}
              disabled={task.completed}
            >Add date/time</Button>}
          {showDateSheet && <DateSheet
            date={task.due}
            onClose={() => setShowDateSheet(false)}
            onSave={due => updateTask(task.id, { due })}
          />}
        </div>

        {!task.completed && !task.parent && <div className={[styles.row]}>
          <svg className={[styles.icon]}>
            <path
              d="M20 13l-6 6-1.42-1.42L16.17 14H5V2h2v10h9.17l-3.59-3.58L14 7l6 6z"
              fill="currentColor"
            />
          </svg>
          <div
            className={[styles.subtasks]}
            role="list"
            aria-label="Subtasks"
          >
            {task.subtasks.map(subtask => {
              if (subtask.completed) return null;
              return (
                <Subtask
                  key={subtask.id}
                  {...subtask}
                  updateTask={updateTask}
                  deleteTask={deleteTask}
                />
              );
            })}
            <Button onClick={addSubtask}>Add subtasks</Button>
          </div>
        </div>}
      </main>
      <ErrorToast />
    </div>
  );
});

export default TaskView;
