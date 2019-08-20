import { h, Fragment } from 'preact';
import { connect } from 'unistore/preact'
import styles from './LoginView.css';
import { actions } from '../../store.js';
import ErrorToast from '../Toast/ErrorToast.jsx';
import welcomeImage from '../../images/warm_welcome.png';

const LoginView = connect(undefined, actions)(({ signIn }) => {
  return (
    <>
      <main className={[styles.container]}>
        <img src={welcomeImage} className={[styles.image]} alt="" />
        <h1 className={[styles.title]}>Welcome to Tasks</h1>
        <h2 className={[styles.text]}>
          Keep track of important things that you
          <br />
          need to get done in one place.
        </h2>
        <button
          className={[styles.button]}
          onClick={signIn}
        >Get started</button>
      </main>
      <ErrorToast />
    </>
  );
});

export default LoginView;
