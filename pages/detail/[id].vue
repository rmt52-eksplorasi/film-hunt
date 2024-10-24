<template>
  <div class="container mx-auto p-8 bg-gray-800 text-white font-sans relative">
    <div class="background-image" :style="{ backgroundImage: `url(${movie.imgUrl})` }"></div>
    <div class="overlay"></div>
    <transition name="fade">
      <div class="flex items-start relative z-10">
        <div class="w-1/3">
          <img :src="movie.imgUrl" :alt="movie.title" class="rounded-lg shadow-lg" width="300" height="450" />
          <div class="mt-2 text-center"></div>
        </div>
        <div class="w-2/3 ml-8">
          <div class="text-sm text-gray-400 mb-2">
            Home • TV • {{ movie.title }}
          </div>
          <h1 class="text-4xl font-bold mb-4">{{ movie.title }}</h1>
          <div class="flex items-center mb-4">
            <span class="bg-gray-700 text-white px-2 py-1 rounded mr-2">{{ movie.rating }}</span>
            <span class="bg-purple-500 text-black px-2 py-1 rounded mr-2">HD</span>
            <span class="bg-blue-500 text-black px-2 py-1 rounded mr-2">{{ movie.Genre.name }}</span>
            <span class="bg-gray-700 text-white px-2 py-1 rounded">TV</span>
            <span class="ml-2">• 23m</span>
          </div>
          <div class="flex items-center mb-4">
            <button href={{movie.trailerUrl}} class="bg-purple-500 text-white px-6 py-2 rounded-full mr-4">Watch now</button>
            <button class="bg-black-700 text-white px-6 py-2 rounded-full">+ Add to List</button>
          </div>
          <p class="text-gray-300 mb-4">
            {{ movie.synopsis }}
            <span class="text-yellow-500">+ More</span>
          </p>
          <div class="flex items-center mt-8">
            <img alt="User avatar" class="rounded-full mr-4" width="50" height="50" src="https://storage.googleapis.com/a1aa/image/lrBdW6KibmaYONG2sgkOVJOtlOdoPIHbK5n9Uw4Vx36Ucb6E.jpg" />
            <div>
              <div class="text-yellow-500 font-bold">Share</div>
              <div class="text-gray-400"> to your friends</div>
            </div>
          </div>
        </div>
      </div>
    </transition>
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
      return movie.value;
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

const metadata = await fetchMovie();
useHead({
  title: `${metadata.title} - Film Hunt`,
  meta: [
    { name: 'description', content: metadata.synopsis },
    { property: 'og:title', content: `${metadata.title} - Film Hunt` },
    { property: 'og:description', content: metadata.synopsis },
    { property: 'og:image', content: metadata.imgUrl },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:image', content: metadata.imgUrl }
  ]
});

onMounted(setMeta);
</script>

<style scoped>
.background-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  filter: blur(10px);
  z-index: 1;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 2;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 1s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}
</style>