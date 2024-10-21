<template>
    <div>
        <Navbar v-if="!isLoginPage" />
        <NuxtPage :key="route.fullPath" />
        <Loading :isLoading="loadingStore.isLoading" />
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from '#app'
import { useLoadingStore } from '~/stores/loading';

const route = useRoute()
const loadingStore = useLoadingStore()

const isLoginPage = computed(() => route.name === 'login')
</script>
