import { h } from 'preact';
import styles from './NoTasks.css';
import zerostate from '../../images/zerostate_mobile.png';

export default function NoTasks() {
  return (
    <div className={[styles.wrapper]}>
      <img src={zerostate} alt="" className={[styles.image]} />
      <span className={[styles.title]}>A fresh start</span>
      <span className={[styles.subtitle]}>Anything to add?</span>
    </div>
  );
}
