import { h } from 'preact';
import { connect } from 'unistore/preact'
import { actions } from '../../store.js';
import styles from './TaskList.css';
import TaskItem from '../TaskItem/TaskItem.jsx';
import TaskListExpand from '../TaskListExpand/TaskListExpand.jsx';
import NoTasks from '../NoTasks/NoTasks.jsx';
import emptyState from '../../images/empty_state.png';

function getTasks(tasks, selectedList) {
  const subtasks = [];
  const tasksById = {};
  let completedCount = 0;

  // Nest
  tasks.forEach(task => {
    if (task.list !== selectedList) return;

    // Completed tasks aren't nested
    if (task.parent && !task.completed) {
      const parent = tasksById[task.parent];
      if (parent) {
        parent.subtasks[parseInt(task.position)] = task;
        if (task.completed) completedCount++;
      } else {
        // Parent not added yet
        subtasks.push(task);
      }
    } else {
      tasksById[task.id] = { ...task, subtasks: [] };
      if (task.completed) completedCount++;
    }
  });

  subtasks.forEach(task => {
    const parent = tasksById[task.parent];
    if (!parent) return; // Deeply nested tasks are not supported
    parent.subtasks[parseInt(task.position)] = task;
    if (task.completed) completedCount++;
  });

  const nestedAndSortedTasks = Object.values(tasksById).sort((a, b) => {
    return a.position.localeCompare(b.position);
  });

  return {
    tasks: nestedAndSortedTasks,
    completedCount
  };
}

function mapStateToProps({ lists, tasks, selectedList }) {
  const list = lists.find(({ id }) => id === selectedList);
  if (!list) return {};

  return {
    title: list.title,
    ...getTasks(tasks, selectedList)
  };
}

function UnfinishedTasks({ tasks, completedCount }) {
  if (!tasks.length) return <NoTasks />;
  if (tasks.length - completedCount === 0) return null;

  return (
     <div className={[styles.tasks]} role="list">
      {tasks.map(task => (
        !task.completed && <TaskItem key={task.id} {...task} />
      ))}
    </div>
  );
}

const TaskList = connect(mapStateToProps, actions)(
  ({ title, tasks, completedCount }) => {
    if (!title) return null;

    return (
      <main className={[styles.wrapper]}>
        <h1 className={[styles.title]}>{title}</h1>
        <UnfinishedTasks tasks={tasks} completedCount={completedCount} />
        {!!completedCount &&
          <TaskListExpand
            className={[styles.tasks]}
            title={`Completed (${completedCount})`}
          >
            {tasks.map(task => (
              task.completed && <TaskItem key={task.id} {...task} />
            ))}
          </TaskListExpand>
        }
        {tasks.length === completedCount && !!tasks.length && (
          <div className={[styles.doneWrapper]}>
            <img src={emptyState} className={[styles.doneImage]} alt="" />
            <div className={[styles.doneTitle]}>Nicely done!</div>
            <div className={[styles.doneText]}>
              {`You've finished all your tasks.`}<br />
              Take a second to recharge.
            </div>
          </div>
        )}
      </main>
    );
  }
);

export default TaskList;
