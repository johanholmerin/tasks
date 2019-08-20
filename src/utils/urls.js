// Simple URL regex
const URL_REGEX = /(?:http(s)?:\/\/.)?(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b(?:[-a-zA-Z0-9@:%_+.~#?&//=]*)/g;

/**
 * Returns an array of strings with URLs at even positions
 */
export function findURLs(str) {
  const split = str.split(URL_REGEX);
  const matches = str.match(URL_REGEX);

  return split.map((part, index) => {
    if (index % 2) return matches.shift();
    return part;
  });
}

export function getAbsoluteURL(str) {
  try {
    // will fail if missing protocol
    new URL(str);
    return str;
  } catch(_) {
    return `//${str}`;
  }
}
