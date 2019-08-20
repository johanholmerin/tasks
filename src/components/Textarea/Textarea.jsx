import { h } from 'preact';
import { forwardRef } from 'preact/compat';
import { useRef, useEffect } from 'preact/hooks';

function onInput({ currentTarget }) {
  currentTarget.style.height = '';
  currentTarget.style.height = `${currentTarget.scrollHeight}px`;
}

function onKeypress(event) {
  if (event.which !== 13) return;
  event.preventDefault();
}

const Textarea = forwardRef(({
  autoFocus,
  value,
  onChange,
  preventEnter,
  ...rest
}, ref) => {
  const textarea = ref || useRef(null);
  const valuesDiffer = Boolean(
    textarea.current && value !== textarea.current.value
  );
  useEffect(() => {
    onInput({ currentTarget: textarea.current });
  }, [valuesDiffer, textarea]);

  useEffect(() => {
    if (autoFocus) textarea.current.focus();
  }, [autoFocus, textarea]);

  return (
    <textarea
      {...rest}
      onChange={e => (onInput(e), onChange(e))}
      onKeypress={preventEnter ? onKeypress : undefined}
      ref={textarea}
      rows="1"
      value={value}
    />
  );
});

export default Textarea;
