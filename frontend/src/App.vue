<template>
  <div>
    <LoadingScreen />
    <RouterView />
  </div>
</template>

<script setup>
import { RouterView } from "vue-router";
import LoadingScreen from "./components/common/LoadingScreen.vue";
</script>

<style scoped></style>
