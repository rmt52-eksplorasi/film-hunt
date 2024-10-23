// stores/loadingStore.js
import { defineStore } from "pinia";

export const useLoadingStore = defineStore("loading", {
  state: () => ({
    isLoading: false,
    message: "",
  }),
  actions: {
    startLoading(message = "Loading...") {
      this.isLoading = true;
      this.message = message;
    },
    stopLoading() {
      this.isLoading = false;
      this.message = "";
    },
  },
});
