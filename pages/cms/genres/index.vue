<template>
    <div class="flex justify-center  min-h-screen bg-gray-300">
        <div class="w-full max-w-screen-lg my-6 p-4 space-y-4 bg-white shadow-md rounded-lg">
            <div class="p-4">
                <h1 class="text-2xl font-bold text-gray-700 mb-4 text-center">List Genres</h1>

                <table class="table-auto w-full ">
                    <thead>
                        <tr class="text-gray-700 bg-slate-200">
                            <th class="px-4 py-2">ID</th>
                            <th class="px-4 py-2">Name</th>
                            <th class="px-4 py-2">Created Date</th>
                            <th class="px-4 py-2">Action</th>
                        </tr>
                    </thead>
                    <tbody class="text-center">
                        <tr v-if="genres.length === 0">
                            <td class="border px-4 py-2 text-center text-gray-700" colspan="4">There's no table content yet</td>
                        </tr>
                        <tr v-for="genre in genres" :key="genre.id">
                            <td class="border px-4 py-2 text-gray-700 font-bold">{{ genre.id }}</td>
                            <td class="border px-4 py-2 text-gray-700">{{ genre.name }}</td>
                            <td class="border px-4 py-2 text-gray-700">{{ genre.createdAt.split('T')[0] }}</td>
                            <td class="border px-4 py-2">
                                <button 
                                    @click="openModal(genre)"
                                    class="btn btn-accent">
                                    Update Genre
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <!-- Modal -->
        <input type="checkbox" id="my_modal_6" class="modal-toggle" />
            <div class="modal" role="dialog">
                <div class="modal-box">
                    <h3 class="text-lg text-center font-bold">Update Genre Id: {{ selectedGenre?.id }}</h3>
                    <div class="form-control">
                        <form
                            @submit.prevent="handleUpdate"
                            class="my-4 font-[sans-serif] max-w-md">
                            <input 
                                type="text"
                                v-model="form.name"
                                placeholder="Genre Name"
                                class="px-4 py-3 w-full text-sm outline-none border-b-2 border-transparent focus:border-blue-500 rounded mb-4" />
                            
                            <button type="submit"
                                class="!mt-8 w-full px-4 py-2.5 mx-auto block text-sm bg-green-600 text-white rounded hover:bg-success">
                                Update
                            </button>
                        </form>
                    </div>
                    <div class="modal-action">
                        <label for="my_modal_6" class="btn btn-primary">Close!</label>
                    </div>
                </div>
            </div>
            <!-- modal border -->
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useToast } from 'vue-toastification'
import { useNuxtApp } from '#app'
import { useLoadingStore } from '~/stores/loading';

const genres = ref([]);
const selectedGenre = ref('');
const form = ref({
    name: ''
});
const toast = useToast();
const loadingsStore = useLoadingStore();
const req = useRequestHeaders();
const token = getCookie("token", req);

const openModal = async (genre) => {
    selectedGenre.value = { ...genre };
    form.value.name = genre.name;
    document.getElementById('my_modal_6').checked = true;
    console.log(selectedGenre.value.id, form.value.name);
}

const handleUpdate = async () => {
    const {$axios} = useNuxtApp();
    try {
        loadingsStore.startLoading('Updating genre, please wait...');
        const response = await $axios.put(`/movie/genres/${selectedGenre.value.id}`, {
            name: form.value.name
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        console.log(response.data);
        toast.success('Update genre success!');
        fetchGenres();
    } catch (error) {
        console.error("Error updating genre:", error.response);
        toast.error(error?.response?.error || 'Failed to update the genre.');
    } finally {
        loadingsStore.stopLoading();
        document.getElementById('my_modal_6').checked = false;
    }
}

const fetchGenres = async () => {
    try {
        const response = await fetch('https://h8-phase2-gc.vercel.app/apis/pub/movie/genres');
        const result = await response.json();
        if(result.statusCode === 200) {
            genres.value = result.data;
        }
    } catch (error) {
        console.error("Error fetching genres:", error);
    }
}

onMounted(() => {
    fetchGenres();
});

definePageMeta({
    middleware: 'auth'
})
</script>
