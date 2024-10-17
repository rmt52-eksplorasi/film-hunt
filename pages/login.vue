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
import { ref } from 'vue'
import { useToast } from 'vue-toastification'
import { useNuxtApp } from '#app'

const toast = useToast()

const form = ref({
    email: '',
    password: ''
})

// Handle login
const handleLogin = async () => {
    // Get $axios from useNuxtApp
    const { $axios } = useNuxtApp()
    try {
        // Send login request
        const response = await $axios.post('/login', {
            email: form.value.email,
            password: form.value.password
        })
        // Show success message
        console.log('Login success:', response.data)
        toast.success('Login successful!')
        // Redirect to dashboard
    } catch (error) {
        // Show error message if login failed
        const errorMessage = error?.response?.data?.error || 'Login failed!'
        console.error('Error:', errorMessage)
        toast.error(errorMessage)
    }
}
</script>
