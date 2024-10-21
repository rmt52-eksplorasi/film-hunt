<template>
    <div class="flex justify-center">
        <div class="mx-auto w-5/6 sm:w-2/3 md:w-1/2 lg:w-1/3 xl:w-1/4">
            <h2 class="text-2xl font-semibold my-6 text-center">Add New User</h2>

            <!-- Add User Form -->
            <form @submit.prevent="handleAddUser">
                <div class="mb-4">
                    <label class="block mb-2 font-medium" for="email">Email</label>
                    <input type="email" id="email" v-model="form.email" class="input input-bordered w-full"
                        placeholder="Enter user email" required />
                </div>

                <div class="mb-4">
                    <label class="block mb-2 font-medium" for="password">Password</label>
                    <input type="password" id="password" v-model="form.password" class="input input-bordered w-full"
                        placeholder="Enter user password" required />
                </div>

                <button type="submit" class="btn btn-primary w-full">Add User</button>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useNuxtApp } from '#app'
import { useToast } from 'vue-toastification'
import { useUserStore } from "~/stores/user";
import { useLoadingStore } from "~/stores/loading";
import { useRouter } from 'vue-router';

// Form state
const form = ref({
    email: '',
    password: ''
})

// Use Nuxt App for Axios
const { $axios } = useNuxtApp()
const toast = useToast()
const userStore = useUserStore()
const loadingStore = useLoadingStore()
const token = userStore.token
const router = useRouter()

// Handle Add User (Submit Form)
const handleAddUser = async () => {
    try {
        if (!token) {
            throw new Error('Unauthorized')
        }

        // Start loading with a custom message
        loadingStore.startLoading('Adding new user, please wait...');

        // Post request to /add-user
        const response = await $axios.post('/add-user', {
            email: form.value.email,
            password: form.value.password
        },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        // Show success toast
        toast.success(`${response.data.message}! Email: ${response.data.data.email}`)

        // Redirect to the home page
        await router.push('/cms');

    } catch (error) {
        console.log(error)
        // Error handling
        const errorMessage = error?.response?.data?.error || 'Failed to add user'

        // Show error toast
        toast.error(errorMessage)
    } finally {
        // Stop the loading overlay
        loadingStore.stopLoading();
    }
}
</script>