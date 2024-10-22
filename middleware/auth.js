export default defineNuxtRouteMiddleware((to, from) => {
  const req = useRequestHeaders();
  const token = getCookie("token", req);
    if (!token) {
      return navigateTo("/login");
    }
});
