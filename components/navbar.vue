<template>
    <div class="navbar bg-base-100">
        <div class="navbar-start">
            <div class="dropdown">
                <div tabIndex={0} role="button" class="btn btn-ghost lg:hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                    </svg>
                </div>
                <ul tabIndex={0}
                    class="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                    <li><a>Item 1</a></li>
                    <li>
                        <a>Parent</a>
                        <ul class="p-2">
                            <li><a>Submenu 1</a></li>
                            <li><a>Submenu 2</a></li>
                        </ul>
                    </li>
                    <li><a>Item 3</a></li>
                </ul>
            </div>
            <NuxtLink to='/' class="btn btn-ghost text-xl">Film Hunt</NuxtLink>
        </div>
        <div class="navbar-center hidden lg:flex">
            <ul class="menu menu-horizontal px-1">
                <li><a>Item 1</a></li>
                <li>
                    <details>
                        <summary>Parent</summary>
                        <ul class="p-2">
                            <li><a>Submenu 1</a></li>
                            <li><a>Submenu 2</a></li>
                        </ul>
                    </details>
                </li>
                <li><a>Item 3</a></li>
            </ul>
        </div>
        <div class="navbar-end">
            <template v-if="isLoggedIn">
                <p class="text-gray-700 font-semibold mr-2">Logged in as: </p>
                <button class="btn btn-error btn-outline" @click="handleLogout">Logout</button>
            </template>
            <template v-else>
                <NuxtLink class="btn btn-accent" to="/login">Login</NuxtLink>
            </template>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

const toast = useToast()
const isLoggedIn = ref(false)
const router = useRouter()

onMounted(() => {
    const token = getCookie('token')
    if (token) {
        isLoggedIn.value = true
    }
})

const handleLogout = () => {
    deleteCookie('token')
    deleteCookie('userEmail')
    isLoggedIn.value = false
    toast.success('Logout success, See you later!')
    router.push('/login')
}
</script>
