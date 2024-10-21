import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    token: null,
    email: null,
  }),
  actions: {
    setUserData(token, email) {
      this.token = token;
      this.email = email;
    },
    clearUserData() {
      this.token = null;
      this.email = null;
    },
  },
  getters: {
    isLoggedIn: (state) => !!state.token,
  },
});
