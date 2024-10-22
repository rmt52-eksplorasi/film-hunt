<template>
    <div class="flex justify-center  min-h-screen bg-gray-300">
        <div class="w-full max-w-screen-lg my-6 p-4 space-y-4 bg-white shadow-md rounded-lg">
            <div class="p-4">
                <h1 class="text-2xl font-bold text-gray-700 mb-4 text-center">List Genres</h1>
                
                <!-- Add Genre Button -->
                <div class="flex justify-end mb-4">
                    <button @click="openAddModal" class="btn btn-primary">Add Genre</button>
                </div>

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

        <!-- Modal for Updating Genre -->
        <input type="checkbox" id="my_modal_6" class="modal-toggle" />
        <div class="modal" role="dialog">
            <div class="modal-box">
                <h3 class="text-lg text-center font-bold">Update Genre Id: {{ selectedGenre?.id }}</h3>
                <div class="form-control">
                    <form @submit.prevent="handleUpdate" class="my-4 font-[sans-serif] max-w-md">
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

        <!-- Modal for Adding New Genre -->
        <input type="checkbox" id="my_modal_add" class="modal-toggle" />
        <div class="modal" role="dialog">
            <div class="modal-box">
                <h3 class="text-lg text-center font-bold">Add New Genre</h3>
                <div class="form-control">
                    <form @submit.prevent="handleAddGenre" class="my-4 font-[sans-serif] max-w-md">
                        <input 
                            type="text"
                            v-model="newGenre.name"
                            placeholder="Genre Name"
                            class="px-4 py-3 w-full text-sm outline-none border-b-2 border-transparent focus:border-blue-500 rounded mb-4" />
                        
                        <button type="submit"
                            class="!mt-8 w-full px-4 py-2.5 mx-auto block text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                            Add Genre
                        </button>
                    </form>
                </div>
                <div class="modal-action">
                    <label for="my_modal_add" class="btn btn-primary">Close!</label>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import { useNuxtApp } from '#app';
import { useLoadingStore } from '~/stores/loading';

const genres = ref([]);
const selectedGenre = ref('');
const form = ref({ name: '' });
const newGenre = ref({ name: '' });
const toast = useToast();
const loadingStore = useLoadingStore();
const req = useRequestHeaders();
const token = getCookie("token", req);

const openModal = (genre) => {
    selectedGenre.value = { ...genre };
    form.value.name = genre.name;
    document.getElementById('my_modal_6').checked = true;
}

const openAddModal = () => {
    newGenre.value.name = ''; // Clear input field
    document.getElementById('my_modal_add').checked = true;
}

const handleUpdate = async () => {
    const {$axios} = useNuxtApp();
    try {
        loadingStore.startLoading('Updating genre, please wait...');
        const response = await $axios.put(`/movie/genres/${selectedGenre.value.id}`, {
            name: form.value.name
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        toast.success('Update genre success!');
        fetchGenres();
    } catch (error) {
        toast.error(error?.response?.error || 'Failed to update the genre.');
    } finally {
        loadingStore.stopLoading();
        document.getElementById('my_modal_6').checked = false;
    }
}

const handleAddGenre = async () => {
    const {$axios} = useNuxtApp();
    try {
        loadingStore.startLoading('Adding genre, please wait...');
        const response = await $axios.post('/movie/genres', {
            name: newGenre.value.name
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        toast.success('Genre added successfully!');
        fetchGenres(); // Refresh genre list
    } catch (error) {
        toast.error(error?.response?.error || 'Failed to add the genre.');
    } finally {
        loadingStore.stopLoading();
        document.getElementById('my_modal_add').checked = false;
    }
}

const fetchGenres = async () => {
    try {
        const response = await fetch('https://h8-phase2-gc.vercel.app/apis/pub/movie/genres');
        const result = await response.json();
        if (result.statusCode === 200) {
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
});
</script>
