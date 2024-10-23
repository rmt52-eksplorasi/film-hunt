<template>
    <div v-if="isLoading" class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
        <div class="flex flex-col items-center">
            <div class="loader"></div>
            <p class="text-white mt-4 font-semibold">{{ message }}</p>
        </div>
    </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
    isLoading: {
        type: Boolean,
        required: true
    },
    message: {
        type: String,
        default: 'Loading...'
    }
})
</script>

<style>
.loader {
    border: 8px solid rgba(255, 255, 255, 0.3);
    border-top: 8px solid #ffffff;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>