<template>
  <div class="container mx-auto p-4">
    <div class="card shadow-xl p-4 mx-[10%]" v-if="movie">
      <h1 class="text-2xl font-bold mb-4 text-center">{{ movie.title }}</h1>
      <div class="flex flex-col md:flex-row">
        <figure class="w-1/2 md:w-1/3 mx-auto md:mx-0">
          <img :src="movie.imgUrl" :alt="movie.title" class="rounded-lg" />
        </figure>
        <div class="card-body md:w-2/3 flex flex-col">
          <div>
            <a class="text-lg rounded-lg bg-base-300 p-1.5 font-bold">{{ movie.Genre.name }}</a>
          </div>
          <div>
            <p class="text-lg">{{ movie.synopsis }}</p>
            <p class="text-lg"><strong>Rating:</strong> {{ movie.rating }}⭐</p>
            <p class="text-lg mt-2">
              <a :href="movie.trailerUrl" target="_blank"> Watch Trailer Here!</a>
            </p>
          </div>
          <div class="mt-4">
            <NuxtLink to="/" class="text-lg rounded-md btn btn-outline btn-primary p-2 font-bold">Go back</NuxtLink>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="text-center">No Movie</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useNuxtApp } from '#app';

const route = useRoute();
const id = route.params.id;
const movie = ref(null);
const { $axios } = useNuxtApp();

async function fetchMovie() {
  try {
    const response = await $axios.get(`/pub/movie/movies/${id}`);
    if (response.data.statusCode === 200) {
      movie.value = response.data.data;
    } else {
      console.error("Error fetching movie:", response.data.message);
    }
  } catch (error) {
    console.error("Error fetching movie:", error);
  }
}

// Set meta values dynamically after fetching movie data
async function setMeta() {
  await fetchMovie();
  if (movie.value) {
    useHead({
      title: `${movie.value.title} - Film Hunt`,
      meta: [
        { name: 'description', content: movie.value.synopsis },
        { property: 'og:title', content: `${movie.value.title} - Film Hunt` },
        { property: 'og:description', content: movie.value.synopsis },
        { property: 'og:image', content: movie.value.imgUrl },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:image', content: movie.value.imgUrl }
      ]
    });
  }
}

// Set initial meta values before the movie data is fetched
useHead({
  title: 'Loading Movie - Film Hunt',
  meta: [
    { name: 'description', content: 'Movie details coming soon' },
    { property: 'og:title', content: 'Loading Movie - Film Hunt' },
    { property: 'og:description', content: 'Movie details coming soon' },
    { property: 'og:image', content: '/../../icon3.png' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:image', content: '/../../icon3.png' }
  ]
});

onMounted(setMeta);
</script>
