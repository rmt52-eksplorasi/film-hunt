import axios from "axios";

export default defineNuxtPlugin((nuxtApp) => {
  const api = axios.create({
    baseURL: "https://h8-phase2-gc.vercel.app/apis",
  });

  nuxtApp.provide("axios", api);
});
