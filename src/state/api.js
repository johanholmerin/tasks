import { clientId, apiKey } from '../../.env.json';
import { mapTask, unmapTask } from './utils.js';

const DISCOVERY_DOCS = [
  'https://www.googleapis.com/discovery/v1/apis/tasks/v1/rest'
];
const SCOPES = 'https://www.googleapis.com/auth/tasks';

/**
 * API load/init promise
 */
export const loaded = new Promise(res => gapi.load('client:auth2', res))
  .then(() => gapi.client.init({
    apiKey,
    clientId,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  }));


/**
 * ======
 *  Auth
 * ======
 */

export async function onAuthChange(func) {
  await loaded;

  // Listen for sign-in state changes.
  gapi.auth2.getAuthInstance().isSignedIn.listen(func);

  // Handle the initial sign-in state.
  func(gapi.auth2.getAuthInstance().isSignedIn.get());
}

export async function signIn() {
  await gapi.auth2.getAuthInstance().signIn();
}

export async function signOut() {
  await gapi.auth2.getAuthInstance().signOut();
}


/**
 * ======
 *  Task
 * ======
 */

export async function createTask(tasklist, task) {
  return mapTask((await gapi.client.tasks.tasks.insert({
    tasklist,
    ...unmapTask(task)
  })).result, tasklist);
}

export async function getTasks(tasklist) {
  const { items = [] } = (await gapi.client.tasks.tasks.list({
    tasklist,
    showCompleted: true,
    showHidden: true,
    maxResults: 100
  })).result;

  return items.map(item => mapTask(item, tasklist));
}

export async function updateTask(listId, taskId, changes) {
  await gapi.client.tasks.tasks.patch({
    tasklist: listId,
    task: taskId,
    ...unmapTask(changes)
  });
}

export async function deleteTask(tasklist, task) {
  await gapi.client.tasks.tasks.delete({ tasklist, task });
}

export async function moveTask(listId, taskId, changes = {}) {
  await gapi.client.tasks.tasks.move({
    tasklist: listId,
    task: taskId,
    changes
  });
}


/**
 * ======
 *  List
 * ======
 */

export async function createList(title) {
  return (await gapi.client.tasks.tasklists.insert({ title })).result;
}

export async function getLists() {
  return (await gapi.client.tasks.tasklists.list()).result.items;
}

export async function updateList(tasklist, changes) {
  (await gapi.client.tasks.tasklists.patch({ tasklist, ...changes }));
}

export async function deleteList(tasklist) {
  await gapi.client.tasks.tasklists.delete({ tasklist });
}


/**
 * =======
 *  Batch
 * =======
 */

export async function batchGetTasks(listIds) {
  const batch = gapi.client.newBatch();

  listIds.forEach(id => {
    const req = gapi.client.request({
      path: `tasks/v1/lists/${id}/tasks`,
      params: {
        showCompleted: true,
        showHidden: true,
        maxResults: 100
      }
    });
    batch.add(req, { id });
  });

  const { result } = await batch;

  const mappedItems = [];
  for (const id in result) {
    const { items = [] } = result[id].result;
    for (const item of items) {
      mappedItems.push(mapTask(item, id));
    }
  }

  return mappedItems;
}

export async function batchDeleteTasks(listId, taskIds) {
  const batch = gapi.client.newBatch();

  taskIds.forEach(id => {
    const req = gapi.client.request({
      path: `tasks/v1/lists/${listId}/tasks/${id}`,
      method: 'DELETE'
    });
    batch.add(req);
  });

  await batch;
}


/**
 * Get lists and tasks
 */
export async function getAll() {
  const lists = await getLists();
  const tasks = await batchGetTasks(lists.map(list => list.id));
  return { lists, tasks };
}


export async function moveTaskToList({ task, newListId }) {
  const batch = gapi.client.newBatch();

  batch.add(gapi.client.request({
    path: `tasks/v1/lists/${task.list}/tasks/${task.id}`,
    method: 'DELETE'
  }));
  batch.add(gapi.client.request({
    path: `tasks/v1/lists/${newListId}/tasks`,
    method: 'POST',
    body: unmapTask(task),
    params: {
      parent: task.parent
    }
  }), { id: 'create' });

  const { result } = await batch;

  // Don't know why this doesn't throw
  if (result.create.result.error) {
    throw result.create.result.error;
  }

  return mapTask(result.create.result, newListId);
}
