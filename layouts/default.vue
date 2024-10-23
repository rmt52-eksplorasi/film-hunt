<template>
    <div>
        <Navbar v-if="!isLoginPage" />
        <NuxtPage :key="route.fullPath" />
        <Loading :isLoading="loadingStore.isLoading" :message="loadingStore.message" />
        <Toaster richColors/>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from '#app'
import { useLoadingStore } from '~/stores/loading';
import { Toaster } from 'vue-sonner'

const route = useRoute()
const loadingStore = useLoadingStore()

const isLoginPage = computed(() => route.name === 'login')
</script>
