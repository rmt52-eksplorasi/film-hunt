<template>
    <div class="container mx-auto py-10">
        <h1 class="text-3xl font-bold mb-6 text-center">Movies List</h1>

        <!-- Search Bar -->
        <div class="mb-4 flex">
            <div class="sm:w-1/4 w-3/4 mx-auto">
                <input type="text" v-model="searchQuery" placeholder="Search by title or synopsis..."
                    class="input input-bordered w-full text-center" />
            </div>
        </div>

        <!-- DaisyUI Table -->
        <div class="overflow-x-auto sm:overflow-auto">
            <table class="table table-zebra w-full sm:w-auto">
                <thead>
                    <tr class="text-center">
                        <!-- <th >ID</th> -->
                        <th @click="sortMovies('id')" class="cursor-pointer">
                            ID <span>{{ getSortIcon('id') }}</span>
                        </th>
                        <th @click="sortMovies('title')" class="cursor-pointer">
                            Title <span>{{ getSortIcon('title') }}</span>
                        </th>
                        <th>Synopsis</th>
                        <th @click="sortMovies('rating')" class="cursor-pointer">
                            Rating <span>{{ getSortIcon('rating') }}</span>
                        </th>
                        <th>Trailer</th>
                        <th>Image</th>
                        <th>Author Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- Loop through paginated and sorted movies and display each in a table row -->
                    <tr v-for="movie in filteredPaginatedMovies" :key="movie.id" class="text-center items-center">
                        <td class="whitespace-nowrap">{{ movie.id }}</td>
                        <td>{{ movie.title }}</td>

                        <!-- Synopsis Column with expanding height and truncation -->
                        <td>
                            <div class="overflow-y-hidden max-h-32 line-clamp-6">
                                {{ movie.synopsis }}
                            </div>
                        </td>

                        <td class="whitespace-nowrap">{{ movie.rating }}</td>

                        <!-- Trailer Link -->
                        <td class="whitespace-nowrap">
                            <a :href="movie.trailerUrl" target="_blank" class="link link-primary">Trailer</a>
                        </td>

                        <!-- Image Column with Change Image Button -->
                        <td class="flex flex-col items-center">
                            <img :src="movie.imgUrl" alt="Movie Poster" class="w-32 h-32 object-contain rounded-md" />
                            <button @click="openChangeImageModal(movie)"
                                class="btn btn-sm btn-outline btn-secondary mt-1">Change Image</button>
                        </td>

                        <td class="whitespace-nowrap">{{ movie.User.email }}</td>

                        <!-- Edit and Delete Buttons -->
                        <td class="text-center">
                            <!-- Edit Button with Pencil Icon -->
                            <button @click="openEditModal(movie)"
                                class="btn btn-sm btn-primary mb-2 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor" class="w-5 h-5">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M15.232 5.232l3.536 3.536M16.764 3.514a2.121 2.121 0 010 3l-9.193 9.192-4.243 1.061 1.06-4.243 9.193-9.192a2.121 2.121 0 013 0z" />
                                </svg>
                            </button>

                            <!-- Delete Button with Trash Icon -->
                            <button @click="openDeleteModal(movie.id)"
                                class="btn btn-sm btn-error flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor" class="w-5 h-5">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M19 7l-1 12.04A2.121 2.121 0 0115.88 21H8.12a2.121 2.121 0 01-2.12-1.96L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1H9a1 1 0 00-1 1v3m12 0H4" />
                                </svg>
                            </button>
                        </td>

                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Pagination Controls -->
        <div class="mt-6 flex justify-center items-center">
            <button class="btn btn-sm" :disabled="currentPage === 1" @click="changePage(currentPage - 1)">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            <!-- Sibling Pages -->
            <div class="flex items-center mx-4">
                <!-- Display Page 1 if not on the first page -->
                <span @click="changePage(1)" :class="{ 'btn-primary text-white': 1 === currentPage }"
                    class="btn btn-sm mx-1">
                    1
                </span>

                <!-- Show ellipsis if current page is greater than 4 -->
                <span v-if="currentPage > 3">...</span>

                <!-- Sibling pages -->
                <span v-for="page in siblingPages" :key="page" @click="changePage(page)"
                    :class="{ 'btn-primary text-white': page === currentPage, 'cursor-pointer': page !== currentPage }"
                    class="btn btn-sm mx-1">
                    {{ page }}
                </span>

                <!-- Show ellipsis if there are more than 4 pages after the current -->
                <span v-if="currentPage < totalPages - 3">...</span>

                <!-- Display the last page number if not on the last page -->
                <span v-if="currentPage <= totalPages" @click="changePage(totalPages)"
                    :class="{ 'btn-primary text-white': totalPages === currentPage }" class="btn btn-sm mx-1">
                    {{ totalPages }}
                </span>
            </div>

            <button class="btn btn-sm" :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
            </button>
        </div>

    </div>

    <!-- Modal for Changing Image -->
    <div v-if="selectedMovie" class="fixed inset-0 z-50 flex items-center justify-center">
        <!-- Overlay -->
        <div class="fixed inset-0 bg-black opacity-50 z-40"></div>

        <!-- Modal Box -->
        <div class="relative bg-base-100 p-6 rounded-lg z-50 w-96">
            <h3 class="text-lg font-bold">Change Image for {{ selectedMovie.title }}</h3>
            <form @submit.prevent="submitImage">
                <div class="form-control my-4">
                    <label class="label">
                        <span class="label-text">Upload New Image</span>
                    </label>
                    <input type="file" class="file-input file-input-bordered w-full" @change="handleFileChange"
                        accept="image/*" />
                </div>
                <div class="modal-action">
                    <button type="submit" class="btn btn-primary mr-2">Submit</button>
                    <a @click="closeModal" class="btn">Cancel</a>
                </div>
            </form>
        </div>
    </div>

    <!-- Modal for Editing Movie -->
    <div v-if="showEditModal" class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="fixed inset-0 bg-black opacity-50"></div>
        <div class="relative bg-base-100 p-6 rounded-lg z-50 w-96">
            <h3 class="text-lg font-bold mb-4">Edit Movie</h3>

            <!-- Form for Editing Movie -->
            <form @submit.prevent="submitEditMovie">
                <!-- Title -->
                <div class="form-control mb-4">
                    <label class="label">
                        <span class="label-text">Title</span>
                    </label>
                    <input type="text" v-model="editMovieData.title" class="input input-bordered w-full" />
                </div>

                <!-- Synopsis -->
                <div class="form-control mb-4">
                    <label class="label">
                        <span class="label-text">Synopsis</span>
                    </label>
                    <textarea v-model="editMovieData.synopsis" class="textarea textarea-bordered w-full"></textarea>
                </div>

                <!-- Trailer URL -->
                <div class="form-control mb-4">
                    <label class="label">
                        <span class="label-text">Trailer URL</span>
                    </label>
                    <input type="text" v-model="editMovieData.trailerUrl" class="input input-bordered w-full" />
                </div>

                <!-- Rating -->
                <div class="form-control mb-4">
                    <label class="label">
                        <span class="label-text">Rating</span>
                    </label>
                    <input type="number" v-model="editMovieData.rating" class="input input-bordered w-full" min="0"
                        max="10" />
                </div>

                <!-- Modal Action Buttons -->
                <div class="modal-action">
                    <button type="submit" class="btn btn-primary mr-2">Save Changes</button>
                    <button @click="closeEditModal" class="btn">Cancel</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Modal for delete confirmation -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="fixed inset-0 bg-black opacity-50"></div>

        <div class="relative bg-base-100 p-6 rounded-lg z-50 w-96">
            <h3 class="text-lg font-bold mb-4">Confirm Deletion</h3>
            <p>Are you sure you want to delete this movie?</p>
            <div class="modal-action">
                <button @click="confirmDelete" class="btn btn-error mr-2">Delete</button>
                <button @click="cancelDelete" class="btn">Cancel</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '~/stores/user';
import { toast } from 'vue-sonner'
import { useNuxtApp } from '#app';
import { useLoadingStore } from "~/stores/loading";

const movies = ref([]);  // State to store movie data
const selectedMovie = ref(null);  // State to store selected movie for changing image
const newImage = ref(null);  // State to store the uploaded image
const userStore = useUserStore();
const loadingStore = useLoadingStore()
const { $axios } = useNuxtApp();

// Pagination States
const currentPage = ref(1);
const itemsPerPage = 10;
const totalPages = computed(() => Math.ceil(filteredMovies.value.length / itemsPerPage));

// Search Query
const searchQuery = ref('');

// Computed property for filtered movies based on search
const filteredMovies = computed(() => {
    if (!searchQuery.value) return movies.value;
    return movies.value.filter(movie =>
        movie.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        movie.synopsis.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
});

// Computed property to handle sorted and paginated movies
const filteredPaginatedMovies = computed(() => {
    // Sort movies
    const sortedMovies = [...filteredMovies.value].sort((a, b) => {
        let modifier = sortOrder.value === 'asc' ? 1 : -1;
        if (a[sortKey.value] < b[sortKey.value]) return -1 * modifier;
        if (a[sortKey.value] > b[sortKey.value]) return 1 * modifier;
        return 0;
    });

    // Paginate movies
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return sortedMovies.slice(start, end);
});

// Computed property to get sibling pages
const siblingPages = computed(() => {
    const siblings = [];
    const total = totalPages.value;

    // Determine start and end for siblings
    let start = Math.max(2, currentPage.value - 1);
    let end = Math.min(total - 1, currentPage.value + 1);

    // Ensure there are always 3 siblings displayed if possible
    if (currentPage.value === 1) {
        end = Math.min(start + 2, total - 1); // Show pages 2 and 3
    } else if (currentPage.value === total) {
        start = Math.max(end - 2, 2); // Show the last three pages
    } else {
        if (end - start < 2) {
            if (start === 2) {
                end = Math.min(start + 2, total - 1);
            } else if (end === total - 1) {
                start = Math.max(2, end - 2);
            }
        }
    }

    for (let i = start; i <= end; i++) {
        siblings.push(i);
    }

    return siblings;
});

// Sorting States
const sortKey = ref('id');  // Key to sort by
const sortOrder = ref('desc');  // 'asc' or 'desc'

// Function to change the page
const changePage = (page) => {
    if (page > 0 && page <= totalPages.value) {
        currentPage.value = page;
    }
};

// Function to handle sorting
const sortMovies = (key) => {
    if (sortKey.value === key) {
        // Toggle the sort order if the same key is clicked
        sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
    } else {
        // Set the sort key and default to ascending order
        sortKey.value = key;
        sortOrder.value = 'asc';
    }
};

// Function to get the appropriate sort icon
const getSortIcon = (key) => {
    if (sortKey.value !== key) return '';
    return sortOrder.value === 'asc' ? '▲' : '▼';
};

// Fetch movies from the API
const fetchMovies = async () => {
    try {
        loadingStore.startLoading('Fetching movies, please wait...');

        const token = userStore.token;
        const response = await $axios.get('/movie/movies', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        movies.value = response.data.data;  // Assign the fetched data to movies state
    } catch (error) {
        const errorMessages = error?.response?.data?.error || 'Failed to fetch movies.';
        toast.error(errorMessages);  // Display error message
    } finally {
        loadingStore.stopLoading();
    }
};

const openChangeImageModal = (movie) => {
    selectedMovie.value = movie;  // Set the selected movie for which the image is being changed
    newImage.value = null;         // Reset the newImage state in case the modal is opened again
};

const handleFileChange = (event) => {
    newImage.value = event.target.files[0];  // Capture the uploaded file
};

const closeModal = () => {
    selectedMovie.value = null;  // Reset the selected movie when closing the modal
    newImage.value = null;       // Clear the new image input when closing the modal
};

const submitImage = async () => {
    if (!newImage.value || !selectedMovie.value) return;  // Ensure a new image and selected movie are present

    try {
        loadingStore.startLoading('Submiting new image, please wait...');

        const formData = new FormData();
        formData.append('file', newImage.value);  // Append the new image to FormData

        // Send a PATCH request to update the movie image
        await $axios.patch(`/movie/movies/${selectedMovie.value.id}`, formData, {
            headers: {
                Authorization: `Bearer ${userStore.token}`,  // Include the authorization token
                'Content-Type': 'multipart/form-data',      // Set content type for form data
            },
        });

        toast.success('Image updated successfully.');  // Display success message
        closeModal();  // Close the modal after successful image update
        fetchMovies();  // Refresh the movie list to show updated image
    } catch (error) {
        const errorMessages = error?.response?.data?.error || 'Failed to update image.';
        toast.error(errorMessages);  // Display error message
    } finally {
        loadingStore.stopLoading();  // Stop the loading overlay
    }
};

const showEditModal = ref(false);
const editMovieData = ref({
    id: null,
    title: '',
    synopsis: '',
    trailerUrl: '',
    rating: null
});

const openEditModal = (movie) => {
    editMovieData.value = { ...movie }; // Copy the movie data to the editMovieData state
    showEditModal.value = true;
};

const closeEditModal = () => {
    showEditModal.value = false;
    editMovieData.value = { id: null, title: '', synopsis: '', trailerUrl: '', rating: null };
};

const submitEditMovie = async () => {
    try {
        loadingStore.startLoading('Updating movie, please wait...');

        // Prepare the updated movie data
        const updatedMovieData = {
            title: editMovieData.value.title,
            synopsis: editMovieData.value.synopsis,
            trailerUrl: editMovieData.value.trailerUrl,
            rating: editMovieData.value.rating,
            genreId: editMovieData.value.genreId,  // Include genreId
            imgUrl: editMovieData.value.imgUrl     // Include imgUrl
        };

        // Send a PUT request to update the movie
        await $axios.put(`/movie/movies/${editMovieData.value.id}`, updatedMovieData, {
            headers: {
                Authorization: `Bearer ${userStore.token}`,  // Include the authorization token
            },
        });

        toast.success('Movie updated successfully.');
        closeEditModal(); // Close the modal after successful update
        fetchMovies();   // Refresh the movie list to show updated movie
    } catch (error) {
        const errorMessages = error?.response?.data?.error || 'Failed to update movie.';
        toast.error(errorMessages);  // Display error message
    } finally {
        loadingStore.stopLoading();  // Stop the loading overlay
    }
};


const showDeleteModal = ref(false);  // State to show/hide delete confirmation modal
const movieToDelete = ref(null);     // Holds the movie to delete

// Function to open the modal and set the movie to delete
const openDeleteModal = (movieId) => {
    movieToDelete.value = movieId;
    showDeleteModal.value = true;
};

// Function to cancel deletion and close the modal
const cancelDelete = () => {
    showDeleteModal.value = false;
    movieToDelete.value = null;
};

const confirmDelete = async () => {
    showDeleteModal.value = false;  // Hide modal

    try {
        loadingStore.startLoading('Deleting movie, please wait...');

        // Send a DELETE request to delete the movie
        await $axios.delete(`/movie/movies/${movieToDelete.value}`, {
            headers: {
                Authorization: `Bearer ${userStore.token}`,  // Include the authorization token
            },
        });

        toast.success('Movie deleted successfully.');  // Display success message
        fetchMovies();  // Refresh the movie list after successful deletion
    } catch (error) {
        const errorMessages = error?.response?.data?.error || 'Failed to delete movie.';
        toast.error(errorMessages);  // Display error message
    } finally {
        loadingStore.stopLoading();  // Stop the loading overlay
    }
};

// Fetch movies on component mount
onMounted(() => {
    fetchMovies();
    sortMovies('id');
    useHead({
        title: 'Movies List - Film Hunt',
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
