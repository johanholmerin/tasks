import { h, Fragment } from 'preact';
import styles from './ErrorView.css';
import Button from '../Button/Button.jsx';
import ErrorToast from '../Toast/ErrorToast.jsx';
import image from '../../images/offline_mobile.png';

export default function ErrorView({ message }) {
  return (
    <>
      <main className={[styles.wrapper]}>
        <img src={image} className={[styles.image]} alt="" />
        <h1 className={[styles.text]}>{message}</h1>
        <Button onClick={() => location.reload()}>Reload</Button>
      </main>
      <ErrorToast />
    </>
  );
}
