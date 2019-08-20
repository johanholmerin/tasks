import { h } from 'preact';
import { connect } from 'unistore/preact'
import { actions } from '../../store.js';
import styles from './ChangeListSheet.css';
import SheetList from '../SheetList/SheetList.jsx';

const ChangeListSheet = connect('lists', actions)(({
  taskId,
  listId,
  lists,
  onClose,
  moveToList
}) => {
  const items = lists.map(list => ({
    label: (
      <div className={[styles.item]} key={list.id}>
        {list.title} {list.id === listId && (
          <svg width="24" height="24" className={[styles.icon]}>
            <path
              d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
              fill="currentColor"
            />
          </svg>
        )}
      </div>
    ),
    onClick() {
      onClose();
      // Don't need to move to current list
      if (listId === list.id) return;

      moveToList(taskId, list.id);
    }
  }));

  return (
    <SheetList
      onClose={onClose}
      title="Move task to"
      items={items}
    />
  );
});

export default ChangeListSheet;
