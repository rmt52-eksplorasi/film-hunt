export function setCookie(name, value, days) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie =
    name +
    "=" +
    encodeURIComponent(value) +
    "; expires=" +
    expires +
    "; path=/";
}

export function getCookie(name) {
  return document?.cookie.split("; ").reduce((r, c) => {
    const [key, ...v] = c.split("=");
    return key === name ? decodeURIComponent(v.join("=")) : r;
  }, "");
}

export function deleteCookie(name) {
  setCookie(name, "", -1);
}
