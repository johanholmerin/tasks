/**
 * :focus-visible
 */
try {
  document.querySelector(':focus-visible');
} catch(_) {
  import('focus-visible');
}


/**
 * inert attribute
 */
if (!Element.prototype.hasOwnProperty('inert')) {
  import('wicg-inert');
}
