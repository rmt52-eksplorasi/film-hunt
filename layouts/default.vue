<template>
    <div>
        <Navbar v-if="!isLoginPage" />
        <NuxtPage :key="route.fullPath" />
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from '#app'
import Navbar from '~/components/navbar.vue'

const route = useRoute()
const isLoginPage = ref(route.name === 'login')

watch(route, (newRoute) => {
    isLoginPage.value = newRoute.name === 'login'
})
</script>
