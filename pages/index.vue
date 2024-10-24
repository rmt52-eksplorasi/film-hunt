<template>
  <div class="min-h-screen bg-base-100">
    <div class="container mx-auto px-4 py-8">
      <Carousel v-if="movies.length > 0" :movies="movies" class="mb-8" />

      <div class="flex flex-col sm:flex-row justify-between items-center mb-8">
        <h2 class="text-3xl font-bold mb-4 sm:mb-0">Movie List</h2>
        <button @click="openModal" class="btn btn-primary bg-purple-600 hover:bg-purple-700 text-white flex items-center">
          Filter Options
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5 h-5 ml-2">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 14.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-6.586L3.293 6.707A1 1 0 013 6V4z" />
          </svg>
        </button>
      </div>

      <!-- Modal for filter options -->
      <div v-if="isModalOpen" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div class="bg-gray-800 text-white p-6 rounded shadow-lg w-[90%] sm:w-auto">
          <div class="mb-4 flex flex-wrap gap-3 w-auto justify-center">
            <div class="min-w-[200px] w-[80%] sm:w-auto">
              <label for="genreFilter" class="text-lg font-semibold mr-2">Filter by Genre:</label>
              <select id="genreFilter" v-model="selectedGenreId" class="p-2 border border-gray-600 rounded w-full bg-gray-700 text-white">
                <option value="">All Genres</option>
                <option v-for="genre in genres" :key="genre.id">{{ genre.name }}</option>
              </select>
            </div>
            <div class="min-w-[200px] w-[80%] sm:w-auto">
              <label for="sortOrder" class="text-lg font-semibold mr-2">Sort by Rating:</label>
              <select id="sortOrder" v-model="sortOrder" class="p-2 border border-gray-600 rounded w-full bg-gray-700 text-white">
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
            <div class="min-w-[200px] w-[80%] sm:w-auto">
              <label for="searchQuery" class="text-lg font-semibold mr-2">Search:</label>
              <input v-model="searchQuery" type="text" id="searchQuery" placeholder="Search movies by title..." class="p-2 border border-gray-600 rounded w-full bg-gray-700 text-white" />
            </div>
          </div>
          <button @click="closeModal" class="btn btn-secondary mt-4">Close</button>
        </div>
      </div>

      <!-- Kondisi jika tidak ada film yang ditemukan -->
      <div v-if="movies.length === 0 && !isLoading" class="text-center text-gray-500 text-lg my-8">Movie not found</div>

      <!-- Loading indicator jika film masih loading -->
      <div v-if="movies.length === 0 && isLoading" class="text-center text-gray-500 text-lg my-8">Loading movies...</div>

      <!-- Menampilkan film jika ada -->
      <div v-else class="flex flex-wrap justify-center gap-3 my-3 w-full">
        <MovieCard v-for="movie in movies" :key="movie.id" :movie="movie"
          class="min-w-[200px] max-w-[300px] w-full sm:w-auto" />
      </div>

      <!-- Pagination -->
      <div class="flex justify-center mt-8">
        <div class="join">
          <button @click="prevPage" :disabled="page === 1"
            :class="['join-item btn', { 'btn-disabled': page === 1, 'btn-outline btn-primary': page !== 1 }]">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button v-for="p in siblingPages" :key="p" @click="goToPage(p)"
            :class="['join-item btn', { 'btn-primary': p === page, 'bg-base-300': p !== page }]">{{ p }}</button>
          <button @click="nextPage" :disabled="page === totalPages"
            :class="['join-item btn', { 'btn-disabled': page === totalPages, 'btn-outline btn-primary': page !== totalPages }]">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import Carousel from '~/components/carousel.vue';

const movies = ref([]);
const genres = ref([]);
const searchQuery = ref('');
const selectedGenreId = ref('');
const sortOrder = ref('asc');
const limit = ref(10);
const page = ref(1);
const totalPages = ref(0);
const isLoading = ref(false);
const isModalOpen = ref(false);

const { $axios } = useNuxtApp();

const fetchMovies = async () => {
  try {
    isLoading.value = true;
    const params = {
      q: searchQuery.value || '',
      i: selectedGenreId.value || '',
      limit: limit.value.toString(),
      page: page.value.toString(),
      sort: sortOrder.value,
    };
    const { data } = await $axios.get(`/pub/movie/movies`, { params });
    if (data.statusCode === 200) {
      movies.value = data.data.query;
      totalPages.value = data.data.pagination.totalPage;
    }
  } catch (error) {
    console.error("Error fetching movies:", error);
  } finally {
    isLoading.value = false;
  }
};

const fetchGenres = async () => {
  try {
    const { data } = await $axios.get('/pub/movie/genres');
    if (data.statusCode === 200) {
      genres.value = data.data;
    }
  } catch (error) {
    console.error("Error fetching genres:", error);
  }
};

const nextPage = () => {
  if (page.value < totalPages.value) {
    page.value += 1;
    fetchMovies();
  }
};

const prevPage = () => {
  if (page.value > 1) {
    page.value -= 1;
    fetchMovies();
  }
};

const goToPage = (p) => {
  if (p <= totalPages.value) {
    page.value = p;
    fetchMovies();
  }
};

const siblingPages = computed(() => {
  const siblings = 2;
  const start = Math.max(1, page.value - siblings);
  const end = Math.min(page.value + siblings, totalPages.value);
  const pages = [];
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
});

const openModal = () => {
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

watch([searchQuery, selectedGenreId, sortOrder], () => {
  page.value = 1;
  fetchMovies();
});

onMounted(() => {
  fetchMovies();
  fetchGenres();
});

useHead({
  title: 'Film Hunt - Discover Your Favorite Movies',
  meta: [
    { name: 'description', content: 'Explore a vast collection of movies, discover new favorites, and keep track of what you want to watch next with Film Hunt!' },
    { property: 'og:title', content: 'Discover Your Favorite Movies' },
    { property: 'og:description', content: 'Explore movies.' },
    { property: 'og:image', content: '/icon2.png' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:image', content: '/icon2.png' },
  ],
});
</script>
