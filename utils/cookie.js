export function setCookie(name, value, days) {
  const options = days
  ? { maxAge: days * 86400, path: "/" } // maxAge in seconds, not milliseconds
  : { path: "/" };
  const cookie = useCookie(name,options);
  // Set the cookie value and options
  cookie.value = value;
}

export function getCookie(name) {
  const cookie = useCookie(name);
  return cookie.value;
}

export function deleteCookie(name) {
  const cookie = useCookie(name);
  cookie.value = null; // Setting value to null deletes the cookie
}
