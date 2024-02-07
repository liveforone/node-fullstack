export function getLastParam() {
  const url = window.location.pathname;
  return url.substring(url.lastIndexOf('/') + 1);
}
