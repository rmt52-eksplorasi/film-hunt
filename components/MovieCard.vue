<template>
  <div class="card card-side bg-base-100 shadow-xl p-4 w-[90%] md:w-[45%] min-w-sm">
    <figure class="w-1/4">
      <img :src="movie.imgUrl" :alt="movie.title" class="rounded-lg"/>
    </figure>
    <div class="card-body w-3/4">
      <h2 class="card-title text-lg font-bold">{{ movie.title }}</h2>
      <p class="text-sm">Rating: {{ movie.rating }}</p>
      <p class="text-sm">Genre: {{ movie.Genre.name }}</p>
      <div class="card-actions justify-end">
        <NuxtLink :to="`/detail/${movie.id}`" class="btn btn-primary btn-sm">Detail</NuxtLink>
      </div>
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
