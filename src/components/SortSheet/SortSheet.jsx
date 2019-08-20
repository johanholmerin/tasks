import { h } from 'preact';
import { useState } from 'preact/hooks';
import { connect } from 'unistore/preact'
import { actions } from '../../store.js';
import SheetList from '../SheetList/SheetList.jsx';
import Prompt from '../Prompt/Prompt.jsx';

function mapStateToProps({ lists, tasks, selectedList }) {
  return {
    selectedList,
    selectedListName: lists.find(list => list.id === selectedList).title,
    // Can't delete main list
    deletable: lists.findIndex(list => list.id === selectedList) !== 0,
    hasCompletedTasks: tasks.some(task => {
      return task.list === selectedList && task.completed;
    })
  };
}

const SortSheet = connect(mapStateToProps, actions)(({
  selectedList,
  selectedListName,
  deletable,
  hasCompletedTasks,
  onClose,
  renameList,
  deleteList,
  deleteCompletedTasks
}) => {
  const [showPrompt, setShowPrompt] = useState(false);

  function onPromptClose(name) {
    onClose();
    if (!name) return;
    renameList(selectedList, name);
  }

  if (showPrompt) {
    return (
      <Prompt
        message="Rename list"
        placeholder="Enter list title"
        value={selectedListName}
        onClose={onPromptClose}
      />
    );
  }

  const items = [{
    label: 'Rename list',
    onClick: () => setShowPrompt(true)
  }, {
    label: 'Delete list',
    onClick: () => (onClose(), deleteList(selectedList)),
    disabled: !deletable
  }, {
    label: 'Delete all completed tasks',
    onClick: () => (onClose(), deleteCompletedTasks(selectedList)),
    disabled: !hasCompletedTasks
  }];

  return (
    <SheetList
      onClose={onClose}
      items={items}
      label="List options"
    />
  );
});

export default SortSheet;
