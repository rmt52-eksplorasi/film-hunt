export default defineNuxtRouteMiddleware((to, from) => {
  const req = useRequestHeaders();
  const token = getCookie("token", req);
//   if (process.client) {
    if (!token) {
      return navigateTo("/login");
    }
//   }
});
