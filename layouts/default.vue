<template>
    <div>
        <Navbar v-if="!isLoginPage" />
        <NuxtPage :key="route.fullPath" />
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from '#app'

const route = useRoute()

const isLoginPage = computed(() => route.name === 'login')
</script>
