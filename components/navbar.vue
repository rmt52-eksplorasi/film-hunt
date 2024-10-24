<template>
    <nav class="bg-base-100 shadow-md">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center py-2">
          <!-- Logo -->
          <NuxtLink to="/" class="flex-shrink-0">
            <NuxtImg
              src="/icon1.png"
              alt="Icon"
              class="drop-shadow-[0_0_1px_rgba(255,255,255,1)] w-[150px] sm:w-[250px] h-[50px] object-cover"
            />
          </NuxtLink>
  
          <!-- Desktop Menu -->
          <div class="hidden lg:flex items-center space-x-6">
            <NuxtLink
              v-for="(link, index) in links"
              :key="index"
              :to="link.url"
              class="text-base-content hover:text-primary transition-colors duration-200"
            >
              {{ link.text }}
            </NuxtLink>
            
            <div v-if="isLoggedIn" class="dropdown dropdown-hover">
              <label tabIndex="0" class="flex items-center cursor-pointer">
                Manage
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </label>
              <ul tabIndex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                <li v-for="(cmsLink, index) in cmsLinks" :key="index">
                  <NuxtLink :to="cmsLink.url">{{ cmsLink.text }}</NuxtLink>
                </li>
              </ul>
            </div>
  
            <div class="dropdown dropdown-end">
              <label tabIndex="0" class="btn btn-ghost btn-circle avatar">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 12a5 5 0 100-10 5 5 0 000 10zm-7 8a7 7 0 0114 0H3z"
                    clip-rule="evenodd"
                  />
                </svg>
              </label>
              <ul tabIndex="0" class="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                <template v-if="isLoggedIn">
                  <li>
                    <a class="justify-between">
                      {{ email }}
                    </a>
                  </li>
                  <li><a @click="handleLogout">Logout</a></li>
                </template>
                <template v-else>
                  <li><NuxtLink to="/login">Login</NuxtLink></li>
                </template>
              </ul>
            </div>
          </div>
  
          <!-- Mobile Menu Button -->
          <div class="lg:hidden dropdown dropdown-end">
            <label tabIndex="0" class="btn btn-ghost">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" />
              </svg>
            </label>
            <ul tabIndex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              <li v-for="(link, index) in links" :key="index">
                <NuxtLink :to="link.url">{{ link.text }}</NuxtLink>
              </li>
              <li v-if="isLoggedIn" class="menu-title">
                <span>Manage</span>
              </li>
              <li v-if="isLoggedIn" v-for="(cmsLink, index) in cmsLinks" :key="`cms-${index}`">
                <NuxtLink :to="cmsLink.url">{{ cmsLink.text }}</NuxtLink>
              </li>
              <li v-if="isLoggedIn" class="menu-title">
                <span>User</span>
              </li>
              <li v-if="isLoggedIn">
                <a>{{ email }}</a>
              </li>
              <li v-if="isLoggedIn">
                <a @click="handleLogout">Logout</a>
              </li>
              <li v-else>
                <NuxtLink to="/login">Login</NuxtLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import { useRouter } from "vue-router";
  import { toast } from "vue-sonner";
  import { useUserStore } from "~/stores/user";
  import { useLoadingStore } from "~/stores/loading";
  
  // Navbar links data
  const links = ref([]);
  
  const cmsLinks = ref([
    { text: "Add User", url: "/add-user" },
    { text: "Movie List", url: "/cms/movies" },
    { text: "Create New Movie", url: "/cms/movies/create" },
    { text: "Genre List", url: "/cms/genres" },
    // { text: 'Create New Genre', url: '/cms/genres/create' }
  ]);
  
  const isLoggedIn = ref(false);
  const router = useRouter();
  const userStore = useUserStore();
  const loadingStore = useLoadingStore();
  
  const email = userStore.email;
  
  // Check if the user is logged in by verifying the token in cookies
  onMounted(() => {
    const token = getCookie("token");
    if (token) {
      isLoggedIn.value = true;
    }
  });
  
  // Handle logout and reset the login state
  const handleLogout = async () => {
    try {
      // Start the loading
      loadingStore.startLoading("Logging out, please wait...");
  
      // Process of clearing token and user data from cookies
      deleteCookie("token");
      deleteCookie("userEmail");
      userStore.clearUserData();
  
      // Update the login state to false
      isLoggedIn.value = false;
  
      // Show success notification
      toast.success("Logout success, See you later!");
  
      // Redirect the user to the login page
      await router.push("/login");
    } catch (error) {
      // Handle any errors that occur during the logout process
      console.error("Logout failed:", error);
      toast.error("Something went wrong during logout. Please try again.");
    } finally {
      // Ensure loading overlay is stopped, even if there's an error
      loadingStore.stopLoading();
    }
  };
  </script>
  <style scoped>
  .dropdown-hover:hover .dropdown-content {
    display: block;
  }
  </style>