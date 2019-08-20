import { useEffect, useState } from 'preact/hooks';

/**
 * State hook for element focus with support for delaying setting blur state
 */
export default function useFocus(ref, delay = 0) {
  const [state, setState] = useState(false);

  useEffect(() => {
    const onFocus = () => setState(true);
    const onBlur = delay ?
      () => setTimeout(setState, delay, false) :
      () => setState(false);
    const { current } = ref;
    current.addEventListener('focus', onFocus);
    current.addEventListener('blur', onBlur);

    return () => {
      current.removeEventListener('focus', onFocus);
      current.removeEventListener('blur', onBlur);
    };
  }, [ref, delay]);

  return state;
}
