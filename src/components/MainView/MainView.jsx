import { h } from 'preact';
import TaskList from '../TaskList/TaskList.jsx';
import Menu from '../Menu/Menu.jsx';
import PullToRefresh from '../PullToRefresh/PullToRefresh.jsx';
import ErrorToast from '../Toast/ErrorToast.jsx';
import styles from './MainView.css';

export default function MainView() {
  return (
    <div className={[styles.wrapper]}>
      <PullToRefresh />
      <TaskList />
      <Menu />
      <ErrorToast />
    </div>
  );
}
