import { useUserStore } from "~/stores/user";

export default defineNuxtRouteMiddleware(() => {
    const userStore = useUserStore();
    // kalo token ada, redirect ke halaman utama
    if(userStore.token) {
        return navigateTo('/cms/movies/create');
    }
});