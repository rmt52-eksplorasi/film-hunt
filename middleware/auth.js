import { useUserStore } from "~/stores/user";

export default defineNuxtRouteMiddleware(() => {
    const userStore = useUserStore();
    console.log(userStore, "<<<<<<");
    if(!userStore.token) {
        return navigateTo('/login');
    }
});