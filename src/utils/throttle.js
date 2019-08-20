/**
 * Throttle function calls. Runs on trailing calls but not on leading
 */
export default function throttle(callback, wait) {
  let timeout;
  let next;
  const call = () => next();

  return function (...args) {
    // latest this and args
    next = () => {
      callback.apply(this, args);
      timeout = undefined;
    };

    if (!timeout) {
      timeout = setTimeout(call, wait);
    }
  }
}
