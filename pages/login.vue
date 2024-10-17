<template>
    <div class="flex justify-center items-center min-h-screen bg-gray-100">
        <div class="w-full max-w-md p-8 space-y-4 bg-white shadow-md rounded-lg">
            <h2 class="text-2xl font-bold text-center text-gray-700">Login</h2>

            <form @submit.prevent="handleLogin">
                <div class="form-control">
                    <label class="label">
                        <span class="label-text">Email</span>
                    </label>
                    <input v-model="form.email" type="email" placeholder="example@email.com"
                        class="input input-bordered" required />
                </div>

                <div class="form-control">
                    <label class="label">
                        <span class="label-text">Password</span>
                    </label>
                    <input v-model="form.password" type="password" placeholder="********" class="input input-bordered"
                        required />
                </div>

                <div class="form-control mt-6">
                    <button class="btn btn-primary">Login</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
// definePageMeta({
//     layout
//         : false,
// });
import { ref } from 'vue'
import { useToast } from 'vue-toastification'
import { useNuxtApp } from '#app'
import { useRouter } from 'vue-router'

const toast = useToast()

const form = ref({
    email: '',
    password: ''
})

const router = useRouter()

// Handle login
const handleLogin = async () => {
    const { $axios } = useNuxtApp()
    try {
        const response = await $axios.post('/login', {
            email: form.value.email,
            password: form.value.password
        })
        // Save token and user email to cookie
        setCookie('token', response.data.data.access_token, 7)
        setCookie('userEmail', form.value.email, 7)
        toast.success('Login successful!')

        // Redirect to /
        await router.push('/')
    } catch (error) {
        const errorMessage = error?.response?.data?.error || 'Login failed!'
        console.error('Error:', errorMessage)
        toast.error(errorMessage)
    }
}
</script>