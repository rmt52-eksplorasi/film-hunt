<template>
    <div class="flex justify-center items-center min-h-screen bg-base-100">
        <div class="w-full max-w-md p-8 space-y-4 shadow-md rounded-lg bg-base-300">
            <h2 class="text-2xl font-bold text-center">Create Movie</h2>
            <div class="form-control">
                <form @submit.prevent="handleCreate" class="space-y-4 font-[sans-serif] max-w-md mx-auto">
                    <input type="text" name="title" v-model="form.title" placeholder="Movie's Title"
                        class="px-4 py-3 w-full text-sm outline-none border-b-2 border-transparent focus:border-blue-500 rounded" />

                    <input type="text" name="imgUrl" v-model="form.imgUrl" placeholder="Image Url"
                        class="px-4 py-3 w-full text-sm outline-none border-b-2 border-transparent focus:border-blue-500 rounded" />
                    <input type="text" name="synopsis" v-model="form.synopsis" placeholder="Synopsis"
                        class="px-4 py-3 w-full text-sm outline-none border-b-2 border-transparent focus:border-blue-500 rounded" />

                    <input type="text" name="trailerUrl" v-model="form.trailerUrl" placeholder="Trailer Url"
                        class="px-4 py-3 w-full text-sm outline-none border-b-2 border-transparent focus:border-blue-500 rounded" />

                    <select v-model="selectedGenreId"
                        class="w-full px-4 py-3 text-sm border-b-2 border-transparent focus:border-blue-500 rounded">
                        <option value="">Select Genre</option>
                        <option v-for="genre in genres" :key="genre.id" :value="genre.id">{{ genre.name }}</option>
                    </select>

                    <input type="number" name="rating" v-model="form.rating" placeholder="Movie's Rating"
                        class="px-4 py-3  w-full text-sm outline-none border-b-2 border-transparent focus:border-blue-500 rounded" />

                    <button type="submit"
                        class="!mt-8 w-full px-4 py-2.5 mx-auto block text-sm bg-primary text-white rounded hover:bg-blue-600">Create</button>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>

import { ref } from 'vue'
import { useToast } from 'vue-toastification'
import { useNuxtApp } from '#app'
import { useLoadingStore } from "~/stores/loading";
import { useUserStore } from '~/stores/user';

const toast = useToast();
const router = useRouter();
const loadingsStore = useLoadingStore();
const selectedGenreId = ref(null);
const genres = ref([]);

const form = ref({
    title: '',
    imgUrl: '',
    synopsis: '',
    trailerUrl: '',
    rating: 0
});

const fetchGenres = async () => {
    try {
        const response = await fetch('https://h8-phase2-gc.vercel.app/apis/pub/movie/genres');
        const result = await response.json();
        // console.log(result);
        if (result.statusCode === 200) {
            genres.value = result.data;
        }
    } catch (error) {
        console.error("Error fetching genres:", error);
    }
}

const handleCreate = async () => {
    const { $axios } = useNuxtApp();
    const userStore = useUserStore();

    try {
        loadingsStore.startLoading('Creating movie, please wait...');

        const response = await $axios.post('/movie/movies', {
            title: form.value.title,
            imgUrl: form.value.imgUrl,
            synopsis: form.value.synopsis,
            trailerUrl: form.value.trailerUrl,
            genreId: selectedGenreId.value,
            rating: form.value.rating
        }, {
            headers: {
                Authorization: `Bearer ${userStore.token}`
            }
        })
        console.log(response);
        toast.success('Create Movie successful!');
        await router.push('/');
    } catch (error) {
        console.error("Error creating movie:", error.response.data.error);
        toast.error(error?.response?.data?.error || 'Failed to create the movie.');
    } finally {
        loadingsStore.stopLoading();
    }
}

onMounted(() => {
    fetchGenres();
    useHead({
        title: 'Create Movie - Film Hunt',
        meta: [
            { name: 'description', content: 'Explore a vast collection of movies, discover new favorites, and keep track of what you want to watch next with Film Hunt.' },
            { property: 'og:image', content: '/icon3.png' },
        ],
    });
});

definePageMeta({
    middleware: 'auth'
})

</script>