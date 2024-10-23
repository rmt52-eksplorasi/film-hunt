<template>
    <div class="navbar bg-base-100">
        <!-- Start: Navbar for small screens (Hamburger menu) -->
        <div class="navbar-start">
            <div class="dropdown">
                <label tabIndex="0" class="btn btn-ghost lg:hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                    </svg>
                </label>
                <ul tabIndex="0"
                    class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                    <li v-for="(link, index) in links" :key="index">
                        <NuxtLink :to="link.url">{{ link.text }}</NuxtLink>
                    </li>
                    <li v-if="isLoggedIn" tabIndex="0">
                        <details>
                            <summary>Manage</summary>
                            <ul class="p-2">
                                <li v-for="(cmsLink, index) in cmsLinks" :key="index">
                                    <NuxtLink :to="cmsLink.url">{{ cmsLink.text }}</NuxtLink>
                                </li>
                            </ul>
                        </details>
                    </li>
                </ul>
            </div>
            <NuxtLink to="/">
                <NuxtImg src="/icon1.png" alt="Icon" class="drop-shadow-[0_0_1px_rgba(255,255,255,1)] w-[150px] sm:w-[250px] h-[50px] object-cover" />
            </NuxtLink>
        </div>
        <!-- End: Navbar for small screens -->

        <!-- Start: Navbar for large screens -->
        <div class="navbar-center hidden lg:flex">
            <ul class="menu menu-horizontal px-1">
                <li v-for="(link, index) in links" :key="index">
                    <NuxtLink :to="link.url">{{ link.text }}</NuxtLink>
                </li>
                <li v-if="isLoggedIn" class="dropdown">
                    <label tabIndex="0" class="flex items-center cursor-pointer">
                        Manage
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-2 transition-transform duration-200"
                            viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd"
                                d="M5.23 7.21a.75.75 0 011.06.02L10 10.93l3.7-3.7a.75.75 0 111.08 1.04l-4.24 4.25a.75.75 0 01-1.08 0L5.23 8.27a.75.75 0 01.02-1.06z"
                                clip-rule="evenodd" />
                        </svg>
                    </label>
                    <ul tabIndex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                        <li v-for="(cmsLink, index) in cmsLinks" :key="index">
                            <NuxtLink :to="cmsLink.url">{{ cmsLink.text }}</NuxtLink>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
        <!-- End: Navbar for large screens -->

        <!-- Start: Login/Logout buttons -->
        <div class="navbar-end">
            <template v-if="isLoggedIn">
                <div class="flex flex-col items-center font-semibold mr-2 text-xs sm:text-sm">
                    <span class="">Logged in as:</span>
                    <span>{{ email }}</span>
                </div>
                <button class="btn btn-error btn-outline" @click="handleLogout">Logout</button>
            </template>
            <template v-else>
                <NuxtLink class="btn btn-accent" to="/login">Login</NuxtLink>
            </template>
        </div>
        <!-- End: Login/Logout buttons -->
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useUserStore } from '~/stores/user';
import { useLoadingStore } from "~/stores/loading";

// Navbar links data
const links = ref([
    { text: 'Home', url: '/' }
]);

const cmsLinks = ref([
    { text: 'Add User', url: '/add-user' },
    { text: 'Movie List', url: '/cms/movies' },
    { text: 'Create New Movie', url: '/cms/movies/create' },
    { text: 'Genre List', url: '/cms/genres' },
    // { text: 'Create New Genre', url: '/cms/genres/create' }
]);

const toast = useToast()
const isLoggedIn = ref(false)
const router = useRouter()
const userStore = useUserStore()
const loadingStore = useLoadingStore()

const email = userStore.email

// Check if the user is logged in by verifying the token in cookies
onMounted(() => {
    const token = getCookie('token')
    if (token) {
        isLoggedIn.value = true
    }
})

// Handle logout and reset the login state
const handleLogout = async () => {
    try {
        // Start the loading
        loadingStore.startLoading('Logging out, please wait...');

        // Process of clearing token and user data from cookies
        deleteCookie('token');
        deleteCookie('userEmail');
        userStore.clearUserData();

        // Update the login state to false
        isLoggedIn.value = false;

        // Show success notification
        toast.success('Logout success, See you later!');

        // Redirect the user to the login page
        await router.push('/login');

    } catch (error) {
        // Handle any errors that occur during the logout process
        console.error('Logout failed:', error);
        toast.error('Something went wrong during logout. Please try again.');

    } finally {
        // Ensure loading overlay is stopped, even if there's an error
        loadingStore.stopLoading();
    }
}

</script>
