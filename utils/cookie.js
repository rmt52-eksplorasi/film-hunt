import Cookies from "universal-cookie";

export function setCookie(name, value, days) {
  const cookies = new Cookies();
  const options = days
    ? { path: "/", expires: new Date(Date.now() + days * 864e5) }
    : { path: "/" };
  cookies.set(name, value, options);
}

export function getCookie(name) {
  const cookies = new Cookies();
  return cookies.get(name);
}

export function deleteCookie(name) {
  const cookies = new Cookies();
  cookies.remove(name, { path: "/" });
}
