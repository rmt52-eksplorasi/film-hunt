<template>
    <div class="flex justify-center items-center min-h-screen bg-gray-100">
        <div class="w-full max-w-md p-8 space-y-4 bg-white shadow-md rounded-lg">
            <h2 class="text-2xl font-bold text-center text-gray-700">Create New User</h2>

            <form @submit.prevent="handleCreateUser">
                <div class="form-control">
                    <label class="label">
                        <span class="label-text">Username</span>
                    </label>
                    <input v-model="form.username" type="text" placeholder="User123" class="input input-bordered"
                        required />
                </div>

                <div class="form-control">
                    <label class="label">
                        <span class="label-text">Email</span>
                    </label>
                    <input v-model="form.email" type="email" placeholder="user@mail.com" class="input input-bordered"
                        required />
                </div>

                <div class="form-control">
                    <label class="label">
                        <span class="label-text">Password</span>
                    </label>
                    <input v-model="form.password" type="password" placeholder="********" class="input input-bordered"
                        required />
                </div>

                <div class="form-control mt-6">
                    <button class="btn btn-primary">Create User</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            form: {
                username: '',
                email: '',
                password: ''
            }
        }
    },
    methods: {
        async handleCreateUser() {
            const { $axios } = useNuxtApp();
            try {
                const response = await $axios.post('/add-user', {
                    username: this.form.username,
                    email: this.form.email,
                    password: this.form.password
                });
                console.log("User created:", response.data);
                // Tampilkan pesan sukses atau redirect
            } catch (error) {
                console.error('Error:', error?.response);
            }
        }
    }
}
</script>

<style scoped>
</style>