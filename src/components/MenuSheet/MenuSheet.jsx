import { h } from 'preact';
import { useState } from 'preact/hooks';
import styles from './MenuSheet.css';
import { connect } from 'unistore/preact'
import { actions } from '../../store.js';
import Sheet from '../Sheet/Sheet.jsx';
import Prompt from '../Prompt/Prompt.jsx';

const MenuSheet = connect(['lists', 'selectedList', 'profile'], actions)(({
  profile,
  lists,
  selectedList,
  selectList,
  createList,
  onClose,
  signOut
}) => {
  const [showPrompt, setShowPrompt] = useState(false);

  function onPromptClose(name) {
    onClose();
    if (!name) return;
    createList(name);
  }

  if (showPrompt) {
    return (
      <Prompt
        message="Create new list"
        placeholder="Enter list title"
        onClose={onPromptClose}
      />
    );
  }

  return (
    <Sheet onClose={onClose} label="Menu">
      <div className={[styles.profile]}>
        <img src={profile.imageUrl} className={[styles.image]} alt="" />
        <div>
          <h2 className={[styles.name]}>{profile.name}</h2>
          <h3 className={[styles.email]}>{profile.email}</h3>
          <button className={[styles.signOut]} onClick={signOut}>
            Sign out
          </button>
        </div>
      </div>
      <div className={[styles.wrapper]}>
        {lists.map(list => (
          <button
            key={list.id}
            onClick={() => (selectList(list.id), onClose())}
            className={[styles.item, list.id === selectedList && styles.active]}
          >
            <div className={[styles.icon]} />
            {list.title}
          </button>
        ))}
        <div className={[styles.line]} />
        <button
          onClick={() => setShowPrompt(true)}
          className={[styles.item]}
        >
          <svg className={[styles.icon]}>
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="currentColor" />
          </svg>
          Create new list
        </button>
      </div>
    </Sheet>
  );
});

export default MenuSheet;
