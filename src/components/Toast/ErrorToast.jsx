import { h } from 'preact';
import { useEffect } from 'preact/hooks';
import { connect } from 'unistore/preact'
import { actions } from '../../store.js';
import Toast from './Toast.jsx';

const ErrorToast = connect('error', actions)(({ error, removeError }) => {
  useEffect(() => {
    const id = setTimeout(removeError, 3000);
    return () => clearTimeout(id);
  }, [error, removeError])

  if (!error) return null;
  return <Toast>{error}</Toast>;
});

export default ErrorToast;
