<template>
  <div :class="['card-container w-[90%] md:w-[45%] min-w-sm relative overflow-hidden rounded-lg shadow-xl bg-gray-900 text-white', { 'animate-slide-in': isVisible }]">
    <figure class="w-full h-64 relative">
      <img :src="movie.imgUrl" :alt="movie.title" class="w-full h-full object-contain transition-transform duration-300 ease-in-out transform hover:scale-110"/>
      <div class="overlay absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 transition-opacity duration-300 ease-in-out hover:opacity-100">
        <NuxtLink :to="`/detail/${movie.id}`" class="play-icon text-white text-6xl">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-12 h-12">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </NuxtLink>
      </div>
    </figure>
    <div class="card-body p-4 bg-gray-800">
      <h2 class="card-title text-lg font-bold">{{ movie.title.substring(0,20) + "..." }}</h2>
      <p class="text-sm">Rating: {{ movie.rating }}</p>
      <p class="text-sm">Genre: {{ movie.Genre.name }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MovieCard',
  props: {
    movie: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.overlay {
  backdrop-filter: blur(5px);
}
</style>
