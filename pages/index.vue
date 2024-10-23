<template>
  <div class="flex flex-col items-center min-h-screen bg-base-100">
    <h1 class="text-3xl font-bold text-center mb-6 mt-3">Welcome to Film Hunt!</h1>

    <div class="mb-4 w-auto">
      <input v-model="searchQuery" type="text" placeholder="Search movies by title..."
        class="p-2 border border-gray-300 rounded w-full md:w-96" />
    </div>

    <div class="mb-4 flex flex-wrap gap-3 w-auto justify-center">
      <div class="min-w-[200px] w-[80%] sm:w-auto">
        <label for="genreFilter" class="text-lg font-semibold mr-2">Filter by Genre:</label>
        <select id="genreFilter" v-model="selectedGenreId" class="p-2 border border-gray-300 rounded w-full">
          <option value="">All Genres</option>
          <option v-for="genre in genres" :key="genre.id">{{ genre.name }}</option>
        </select>
      </div>
      <div class="min-w-[200px] w-[80%] sm:w-auto">
        <label for="sortOrder" class="text-lg font-semibold mr-2">Sort by Rating:</label>
        <select id="sortOrder" v-model="sortOrder" class="p-2 border border-gray-300 rounded w-full">
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
    </div>

    <!-- Kondisi jika tidak ada film yang ditemukan -->
    <div v-if="movies.length === 0 && !isLoading" class="text-center text-gray-500">Movie not found</div>

    <!-- Loading indicator jika film masih loading -->
    <div v-if="movies.length === 0 && isLoading" class="text-center text-gray-500">Loading movies...</div>

    <!-- Menampilkan film jika ada -->
    <div v-else class="flex flex-wrap justify-center gap-3 my-3 w-full sm:w-auto">
      <MovieCard v-for="movie in movies" :key="movie.id" :movie="movie"
        :class="[{ 'flex-1': movies.length === 1 }, 'min-w-[200px]']" />
    </div>

    <div class="my-6 flex gap-2 sm:gap-4">
      <button @click="prevPage" :disabled="page === 1"
        :class="['rounded btn', { 'btn-disabled': page === 1, 'btn-outline btn-primary': page !== 1 }]">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button v-for="p in siblingPages" :key="p" @click="goToPage(p)"
        :class="['rounded btn', { 'btn-primary': p === page, 'bg-base-300': p !== page }]">{{ p }}</button>
      <button @click="nextPage" :disabled="page === totalPages"
        :class="['rounded btn', { 'btn-disabled': page === totalPages, 'btn-outline btn-primary': page !== totalPages }]">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';

const movies = ref([]);
const genres = ref([]);
const searchQuery = ref('');
const selectedGenreId = ref('');
const sortOrder = ref('asc');
const limit = ref(10);
const page = ref(1);
const totalPages = ref(0);
const isLoading = ref(false);

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

watch([searchQuery, selectedGenreId, sortOrder], () => {
  page.value = 1;
  fetchMovies();
});

onMounted(() => {
  fetchMovies();
  fetchGenres();
});

definePageMeta({
  title: 'Home',
})
</script>
