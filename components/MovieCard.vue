<template>
  <div class="card card-side bg-base-100 shadow-xl p-4 sm:w-[640px] w-[370px] h-72">
    <figure class="w-[160px]">
      <img :src="movie.imgUrl" :alt="movie.title" class="rounded-lg"/>
    </figure>
    <div class="card-body w-[480px] sm:py-auto py-0">
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
