<template>
    <div>
        <Navbar v-if="!isLoginPage" />
        <NuxtPage />
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import Navbar from '~/components/navbar.vue';

const route = useRoute()
const isLoginPage = route.name === 'login'
console.log(isLoginPage)
</script>
