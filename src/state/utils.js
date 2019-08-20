export function getSelectedTask(path) {
  const [, task] = path.match(/\/task\/([^/]+)$/) || [];
  return task;
}

export function getInitialState() {
  return {
    profile: {
      email: undefined,
      name: undefined,
      imageUrl: undefined
    },
    loading: false,
    signedIn: false,
    selectedList: undefined,
    selectedTask: getSelectedTask(location.pathname),
    lists: [],
    tasks: [],
    error: undefined
  };
}

/**
 * Map task from local to API format
 */
export function unmapTask(task) {
  return {
    id: task.id,
    position: task.position,
    status: task.completed ? 'completed' : 'needsAction',
    title: task.title,
    notes: task.notes,
    due: task.due,
    parent: task.parent,
    previous: task.previous
  };
}

/**
 * Map task from API to local format
 */
export function mapTask(task, list) {
  return {
    id: task.id,
    position: task.position,
    parent: task.parent,
    title: task.title,
    notes: task.notes,
    completed: task.status === 'completed',
    due: task.due,
    list
  };
}

/**
 * Get error message from API error
 */
export function getErrorMessage(error) {
  if (error.message) return error.message;
  if (error.details) return error.details;
  if (error.error) return getErrorMessage(error.error);
  if (error.result) return getErrorMessage(error.result);
}
