<template>
  <div class="flex items-center space-x-1">
    <p
      class="jacquarda-bastarda-9-regular text-5xl font-semibold animate-float"
    >
      T
    </p>
    <p class="font-semibold text-xl flex">
      <span class="animate-float delay-0">u</span>
      <span class="animate-float delay-100">n</span>
      <span class="animate-float delay-200">t</span>
      <span class="animate-float delay-300">a</span>
      <span class="animate-float delay-400">s</span>
      <span class="animate-float delay-500">k</span>
    </p>
  </div>
</template>

<script>
export default {
  name: "LogoLoading",
};
</script>

<style scoped>
@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-6px);
  }
}

.animate-float {
  animation: float 1s ease-in-out infinite;
}

.delay-0 {
  animation-delay: 0ms;
}
.delay-100 {
  animation-delay: 100ms;
}
.delay-200 {
  animation-delay: 200ms;
}
.delay-300 {
  animation-delay: 300ms;
}
.delay-400 {
  animation-delay: 400ms;
}
.delay-500 {
  animation-delay: 500ms;
}

.jacquarda-bastarda-9-regular {
  font-family: "Jacquarda Bastarda 9", serif;
  font-weight: 400;
  font-style: normal;
}
</style>
