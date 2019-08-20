import { h } from 'preact';
import { useState } from 'preact/hooks';
import styles from './Menu.css';
import IconButton from '../IconButton/IconButton.jsx';
import MenuSheet from '../MenuSheet/MenuSheet.jsx';
import AddSheet from '../AddSheet/AddSheet.jsx';
import SortSheet from '../SortSheet/SortSheet.jsx';

// Oversized to cover screen
const SVG_SIZE = window.screen.width + window.screen.height;
const INSET = 56 + 4 * 2;

export default function Menu() {
  const [showListsSheet, toggleListsSheet] = useState(false);
  const [showAddSheet, toggleAddSheet] = useState(false);
  const [showSortSheet, toggleSortSheet] = useState(false);

  return (
    <nav className={[styles.container]}>
      {/* Background with cutout for FAB */}
      <svg width={SVG_SIZE} height={SVG_SIZE} className={[styles.background]}>
        <path
          d={
            'M0,0 L' +
            (SVG_SIZE - INSET) / 2 +
            ',0 a1 1 0 0 0 ' +
            INSET +
            ' 0 L0,0 L' +
            SVG_SIZE +
            ',0 L' +
            SVG_SIZE +
            ',' +
            SVG_SIZE +
            ' L0,' +
            SVG_SIZE +
            ' Z'
          }
        />
      </svg>

      <IconButton
        aria-label="Lists & settings"
        onClick={() => toggleListsSheet(!showListsSheet)}
      >
        <svg width="24" height="24">
          <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
        </svg>
      </IconButton>
      {showListsSheet && <MenuSheet onClose={() => toggleListsSheet(false)} />}

      <button
        aria-label="Create task"
        className={[styles.add]}
        onClick={() => toggleAddSheet(!showAddSheet)}
      />
      {showAddSheet && <AddSheet onClose={() => toggleAddSheet(false)} />}

      <IconButton
        aria-label="List options"
        onClick={() => toggleSortSheet(!showSortSheet)}
      >
        <svg width="24" height="24">
          <path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
        </svg>
      </IconButton>
      {showSortSheet && <SortSheet onClose={() => toggleSortSheet(false)} />}
    </nav>
  );
}
