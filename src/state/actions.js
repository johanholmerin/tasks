import * as api from './api.js';
import { getSelectedTask, getInitialState, getErrorMessage } from './utils.js';
import { store, onError } from '../store.js';

/**
 * ======
 *  Auth
 * ======
 */
export { signIn, signOut } from './api.js';

export async function setSignin(state, signedIn) {
  if (!signedIn) {
    return getInitialState();
  }

  const profile = gapi.auth2.
    getAuthInstance().
    currentUser.get().
    getBasicProfile();

  store.setState({
    signedIn,
    profile: {
      email: profile.getEmail(),
      name: profile.getName(),
      imageUrl: profile.getImageUrl()
    }
  });

  return update(store.getState());
}


/**
 * ====================
 *  Read lists & tasks
 * ====================
 */
export async function update({ loading }) {
  if (loading) return;

  store.setState({ loading: true });

  const { lists, tasks } = await api.getAll();
  const { selectedList, selectedTask } = store.getState();
  const selectedListExists = selectedList &&
    lists.some(list => list.id === selectedList);
  const selectedTaskExists = selectedTask &&
    tasks.some(task => task.id === selectedTask);

  return {
    loading: false,
    lists,
    tasks,
    selectedList: selectedListExists ? selectedList : lists[0].id,
    ...(!selectedTaskExists && go(undefined, '/', true))
  };
}


/**
 * ======
 *  Task
 * ======
 */
export function updateTask({ tasks }, id, update) {
  return {
    tasks: tasks.map(task => {
      if (task.id === id) {
        // If task is marked as not completed and parent is completed,
        // move task from parent
        if (
          !update.completed &&
          task.parent &&
          tasks.find(t => t.id === task.parent).completed
        ) {
          api.moveTask(task.list, id).catch(onError);
          update = { ...update, parent: undefined };
        }

        // Update
        api.updateTask(task.list, id, update).catch(onError);

        return { ...task, ...update };
      }

      // Mark subtasks as completed if parent is completed
      if (task.parent === id && update.completed) {
        return {
          ...task,
          completed: true
        };
      }

      return task;
    })
  };
}

export function deleteCompletedTasks({ tasks }, listId) {
  const completed = tasks
    .filter(task => task.list === listId && task.completed)
    .map(task => task.id);

  api.batchDeleteTasks(listId, completed).catch(onError);

  return {
    tasks: tasks.filter(task => !completed.includes(task.id))
  };
}

export function deleteTask({ tasks, selectedTask }, listId, taskId) {
  api.deleteTask(listId, taskId).catch(onError);

  const changeURL = selectedTask === taskId;

  return {
    ...(changeURL && go(undefined, '/', true)),
    tasks: tasks.filter(task => task.id !== taskId)
  };
}

export async function createTask(state, listId, task) {
  const newTask = await api.createTask(listId, task);
  const { tasks } = store.getState();

  return {
    tasks: [...tasks, newTask]
  };
}

export function moveToList({ tasks }, taskId, listId) {
  moveTaskToList(taskId, listId).catch(onError);

  return {
    tasks: tasks.map(task => {
      if (task.id !== taskId && task.parent !== taskId) return task;

      // Move subtask without moving parent
      if (task.id === taskId && task.parent) {
        return {
          ...task,
          list: listId,
          parent: undefined
        };
      }

      return {
        ...task,
        list: listId
      };
    })
  };
}


/**
 * ======
 *  List
 * ======
 */
export function selectList(state, selectedList) {
  return { selectedList };
}

export async function createList(state, name) {
  const newList = await api.createList(name);
  const { lists } = store.getState();

  return {
    lists: [...lists, newList],
    selectedList: newList.id
  };
}

export function renameList({ lists }, id, title) {
  api.updateList(id, { title }).catch(onError);

  return {
    lists: lists.map(list => {
      if (list.id !== id) return list;
      return { ...list, title };
    })
  };
}

export function deleteList({ lists }, id) {
  api.deleteList(id).catch(onError);

  return {
    selectedList: lists[0].id,
    lists: lists.filter(list => list.id !== id)
  };
}


/**
 * ============
 *  Navigation
 * ============
 */
export function go(state, href, replace = false) {
  if (href !== location.href) {
    const method = `${replace ? 'replace' : 'push'}State`;
    history[method](undefined, undefined, href);
  }

  return {
    selectedTask: getSelectedTask(location.pathname)
  };
}


/**
 * =======
 *  Error
 * =======
 */
export function setError(state, error) {
  return { error: getErrorMessage(error) };
}

export function removeError() {
  return { error: undefined };
}



/**
 * There is no API to move a task to another list
 * Task will be deleted and recreated on the new list, and then the same will
 * happen with all subtasks
 */
function moveTaskToList(taskId, newListId, parent) {
  const oldTask = store.getState().tasks.find(task => task.id === taskId);

  return api.moveTaskToList({
    task: {
      ...oldTask,
      parent
    },
    newListId,
  }).then(newTask => {
    const { tasks, selectedTask } = store.getState();
    const changeURL = selectedTask === taskId;

    const subtaskMoves = [];

    store.setState({
      // Replace URL if the task is still selected
      ...(changeURL && go(undefined, `/task/${newTask.id}`, true)),
      tasks: tasks.map(task => {
        // Subtask of moved task
        if (task.parent === taskId) {
          subtaskMoves.push(moveTaskToList(task.id, newListId, newTask.id));
          return { ...task, parent: newTask.id };
        }

        if (task.id !== taskId) return task;

        return newTask;
      })
    });

    return Promise.all(subtaskMoves);
  });
}
