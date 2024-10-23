<template>
    <div class="flex justify-center min-h-screen">
        <div class="w-full max-w-screen-lg p-4 space-y-4 shadow-md">
            <div class="p-4">
                <h1 class="text-2xl font-bold mb-4 text-center">List Genres</h1>

                <!-- Add Genre Button -->
                <div class="flex justify-end mb-4">
                    <button @click="openAddModal" class="btn btn-primary">Add Genre</button>
                </div>

                <table class="table-auto table-zebra w-full ">
                    <thead>
                        <tr class="bg-base-200 ">
                            <th class="px-4 py-2 ">ID</th>
                            <th class="px-4 py-2 ">Name</th>
                            <th class="px-4 py-2 ">Created Date</th>
                            <th class="px-4 py-2 ">Action</th>
                        </tr>
                    </thead>
                    <tbody class="text-center">
                        <tr v-if="genres.length === 0">
                            <td class="border px-4 py-2 text-center " colspan="4">There's no table content yet</td>
                        </tr>
                        <tr v-for="genre in genres" :key="genre.id">
                            <td class=" px-4 py-2  font-bold">{{ genre.id }}</td>
                            <td class=" px-4 py-2 ">{{ genre.name }}</td>
                            <td class=" px-4 py-2 ">{{ genre.createdAt.split('T')[0] }}</td>
                            <td class=" px-4 py-2">
                                <button @click="openModal(genre)" class="btn btn-primary btn-outline">
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
                        <input type="text" v-model="form.name" placeholder="Genre Name"
                            class="px-4 py-3 w-full text-sm outline-none border-b-2 border-transparent focus:border-blue-500 rounded mb-4" />

                        <button type="submit"
                            class="!mt-8 w-full px-4 py-2.5 mx-auto block text-sm btn btn-primary rounded hover:bg-success">
                            Update
                        </button>
                    </form>
                </div>
                <div class="modal-action">
                    <label for="my_modal_6" class="btn btn-error btn-outline">Close</label>
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
                        <input type="text" v-model="newGenre.name" placeholder="Genre Name"
                            class="px-4 py-3 w-full text-sm outline-none border-b-2 border-transparent focus:border-blue-500 rounded mb-4" />

                        <button type="submit" class="!mt-8 w-full px-4 py-2.5 mx-auto block text-sm btn btn-primary">
                            Add Genre
                        </button>
                    </form>
                </div>
                <div class="modal-action">
                    <label for="my_modal_add" class="btn btn-error btn-outline">Close</label>
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
const { $axios } = useNuxtApp();

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
        toast.error(error?.response?.data?.error || 'Failed to update the genre.');
    } finally {
        loadingStore.stopLoading();
        document.getElementById('my_modal_6').checked = false;
    }
}

const handleAddGenre = async () => {
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
        toast.error(error?.response?.data?.error || 'Failed to add the genre.');
    } finally {
        loadingStore.stopLoading();
        document.getElementById('my_modal_add').checked = false;
    }
}

const fetchGenres = async () => {
    try {
        const response = await $axios.get('/pub/movie/genres');
        genres.value = response.data.data;
    } catch (error) {
        const errorMessage = error?.response?.data?.error || 'Failed to fetch genres.';
        toast.error(errorMessage);
    }
}

onMounted(() => {
    fetchGenres();
    useHead({
        title: 'Genres List - Film Hunt',
        meta: [
            { name: 'description', content: 'Explore a vast collection of movies, discover new favorites, and keep track of what you want to watch next with Film Hunt.' },
            { property: 'og:image', content: '/icon3.png' },
        ],
    });
});

definePageMeta({
    middleware: 'auth'
});
</script>
