import { useState, useEffect } from 'preact/hooks';

const INITIAL_STATE = {
  done: false
};

export default function usePromise(promise) {
  const [value, setValue] = useState(INITIAL_STATE);

  useEffect(() => {
    // Reset state if promise changes
    setValue(INITIAL_STATE);

    promise.then(result => {
      setValue({ result, done: true });
    }, error => {
      setValue({ error, done: true });
    });
  }, [promise]);

  return value;
}

