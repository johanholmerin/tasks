/**
 * @example
 * scopedClassnames('x0-1 x1-0', 'btn', undefined, ['x0-2']) // 'btn x0-2 x1-0'
 */

/**
 * @param {...(string|string[]|undefined|null|false)} values
 * @returns {string}
 */
export default function scopedClassnames(...values) {
  let classes = '';
  /** @type {string[]} */
  const used = [];

  function addCls(cls) {
    const index = cls.indexOf('-');
    if (index === -1) {
      classes += cls + ' ';
    } else {
      const scope = cls.slice(0, index);
      if (!used.includes(scope)) {
        used.push(scope);
        classes += cls + ' ';
      }
    }
  }

  // Apply right-to-left
  values.reverse().forEach(value => {
    // Ignore falsy values
    if (!value) return;

    const arr = Array.isArray(value) ? value.slice() : value.split(' ');
    arr.reverse().forEach(addCls);
  });

  // remove trailing space
  return classes.slice(0, -1);
}
