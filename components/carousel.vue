<template>
    <div class="w-full max-w-[1200px] max-h-[1200px]">
        <div class="relative w-full overflow-hidden">
            <!-- Carousel Container -->
            <div class="carousel-container">
                <div
                    class="carousel flex overflow-x-hidden scroll-smooth snap-x snap-mandatory gap-4"
                    ref="carouselRef"
                    @mousedown="handleMouseDown"
                    @mouseup="handleMouseUp"
                    @mouseleave="handleMouseUp"
                    @mousemove="handleMouseMove"
                    @touchstart="handleTouchStart"
                    @touchend="handleTouchEnd"
                    @touchmove="handleTouchMove"
                >
                    <div
                        v-for="movie in randomMovies"
                        :key="movie.id"
                        class="flex-none snap-start relative group w-full"
                    >
                        <div class="relative overflow-hidden rounded-lg shadow-lg flex">
                            <NuxtLink
                                :to="`/detail/${movie.id}`"
                                class="mt-4 text-white font-bold py-2 px-4 rounded"
                            >
                                <div
                                    class="absolute left-0 top-0 bottom-0 bg-black/80 p-8 z-10 flex flex-col justify-center"
                                >
                                    <div class="text-purple-500 text-sm mb-2">#{{ movie.rank }} Spotlight</div>
                                    <h3 class="text-white text-4xl font-bold mb-4">{{ movie.title }}</h3>
                                    <div class="flex items-center text-gray-400 text-sm mb-4">
                                        <i class="fas fa-tv mr-2"></i> TV
                                        <span class="mx-2">|</span>
                                        <i class="fas fa-clock mr-2"></i> {{ movie.Genre.name }}
                                        <span class="mx-2">|</span>
                                        <i class="fas fa-calendar-alt mr-2"></i> {{ new Date(movie.createdAt).toLocaleDateString() }}
                                    </div>
                                    <div class="flex items-center mb-4">
                                        <span class="bg-purple-500 text-black text-xs font-bold py-1 px-2 rounded mr-2">HD</span>
                                    </div>
                                    <p class="text-gray-400 mb-6">{{ movie.description }}</p>
                                    <div class="flex">
                                        <button class="bg-purple-500 text-black font-bold py-2 px-4 rounded mr-2 flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6 mr-2">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-5.197-3.018A1 1 0 008 9.082v5.836a1 1 0 001.555.832l5.197-3.018a1 1 0 000-1.664z" />
                                            </svg> Watch Now
                                        </button>
                                        <button class="bg-gray-700 text-white font-bold py-2 px-4 rounded flex items-center">
                                            <i class="fas fa-info-circle mr-2"></i> Detail
                                        </button>
                                    </div>
                                </div>
                            </NuxtLink>
                            <img
                                :src="movie.imgUrl"
                                :alt="movie.title"
                                class="w-full h-96 object-cover"
                                draggable="false"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <!-- Navigation buttons -->
            <div
                class="absolute left-0 top-0 bottom-0 w-16 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 z-10"
            >
                <button @click="prevSlide" class="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors duration-300 focus:outline-none">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        class="w-6 h-6"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                </button>
            </div>

            <div
                class="absolute right-0 top-0 bottom-0 w-16 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 z-10"
            >
                <button
                    @click="nextSlide"
                    class="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors duration-300 focus:outline-none"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 24 24"
                        stroke="currentColor"
                        class="w-6 h-6"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M9 5l7 7-7 7"
                        />
                    </svg>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";

const props = defineProps({
    movies: {
        type: Array,
        required: true,
    },
});

// Refs
const carouselRef = ref(null);
const currentIndex = ref(0);
const autoplayInterval = ref(null);
let isDragging = ref(false);
let startX = ref(0);
let scrollLeft = ref(0);

// Computed
const randomMovies = computed(() => {
    if (!props.movies || props.movies.length === 0) return [];
    const shuffled = [...props.movies].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 6); // Show 6 movies to have 6 slides with 1 movie each
});

// Router
const router = useRouter();

// Methods
const scrollToIndex = (index) => {
    if (!carouselRef.value) return;
    const itemWidth = carouselRef.value.offsetWidth; // Each item takes full width
    carouselRef.value.scrollTo({
        left: itemWidth * index,
        behavior: "smooth",
    });
};

const nextSlide = () => {
    currentIndex.value = (currentIndex.value + 1) % randomMovies.value.length;
    scrollToIndex(currentIndex.value);
    resetAutoplay();
};

const prevSlide = () => {
    currentIndex.value =
        currentIndex.value === 0
            ? randomMovies.value.length - 1
            : currentIndex.value - 1;
    scrollToIndex(currentIndex.value);
    resetAutoplay();
};

const startAutoplay = () => {
    autoplayInterval.value = setInterval(() => {
        nextSlide();
    }, 5000); // Change slide every 5 seconds
};

const resetAutoplay = () => {
    if (autoplayInterval.value) {
        clearInterval(autoplayInterval.value);
        startAutoplay();
    }
};

const goToDetail = (id) => {
    router.push({ name: "MovieDetail", params: { id } });
};

// Keyboard navigation
const handleKeydown = (event) => {
    if (event.key === "ArrowLeft") {
        prevSlide();
    } else if (event.key === "ArrowRight") {
        nextSlide();
    }
};

// Touch handling
let touchStartX = 0;
let touchEndX = 0;

const handleTouchStart = (event) => {
    touchStartX = event.touches[0].clientX;
};

const handleTouchEnd = (event) => {
    touchEndX = event.changedTouches[0].clientX;
    handleSwipe();
};

const handleTouchMove = (event) => {
    if (isDragging.value) {
        event.preventDefault();
    }
};

const handleSwipe = () => {
    const swipeThreshold = 50; 
    const swipeDistance = touchEndX - touchStartX;

    if (Math.abs(swipeDistance) > swipeThreshold) {
        if (swipeDistance > 0) {
            prevSlide();
        } else {
            nextSlide();
        }
    }
};

// Mouse handling
const handleMouseDown = (event) => {
    isDragging.value = true;
    startX.value = event.pageX - carouselRef.value.offsetLeft;
    scrollLeft.value = carouselRef.value.scrollLeft;
};

const handleMouseUp = () => {
    isDragging.value = false;
};

const handleMouseMove = (event) => {
    if (!isDragging.value) return;
    event.preventDefault();
    const x = event.pageX - carouselRef.value.offsetLeft;
    const walk = (x - startX.value) * 1.5; 
    carouselRef.value.scrollLeft = scrollLeft.value - walk;
};

// Lifecycle hooks
onMounted(() => {
    startAutoplay();
    window.addEventListener("keydown", handleKeydown);
});

onBeforeUnmount(() => {
    if (autoplayInterval.value) {
        clearInterval(autoplayInterval.value);
    }
    window.removeEventListener("keydown", handleKeydown);
});
</script>

<style scoped>
.carousel-container {
    position: relative;
    overflow: hidden;
}

.carousel {
    display: flex;
    overflow-x: auto;
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    transition: transform 0.5s ease-in-out; 
}

.carousel::-webkit-scrollbar {
    display: none; 
}

.carousel-item {
    flex: 0 0 auto;
}
</style>
