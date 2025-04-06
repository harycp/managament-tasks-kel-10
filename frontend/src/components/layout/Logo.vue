<template>
  <a href="/" class="flex items-center group space-x-1">
    <p
      :class="[
        'jacquarda-bastarda-9-regular text-4xl font-semibold group-hover:translate-y-[-2px] transition-all duration-300 ease-in-out',
        ClassImg,
      ]"
    >
      T
    </p>
    <p
      :class="[
        'averia-serif-libre-regular font-semibold text-xl flex',
        ClassTitle,
      ]"
    >
      <span
        v-for="(char, index) in 'untask'"
        :key="index"
        class="group-hover:translate-y-[-2px] transition-all duration-300 ease-in-out"
        :style="{ transitionDelay: `${index * 100}ms` }"
      >
        {{ char }}
      </span>
    </p>
  </a>
</template>

<script>
export default {
  name: "Logo",
  props: {
    ClassImg: { type: String, default: "" },
    ClassTitle: { type: String, default: "" },
  },
};
</script>

<style scoped>
.jacquarda-bastarda-9-regular {
  font-family: "Jacquarda Bastarda 9", serif;
  font-weight: 400;
  font-style: normal;
}

.averia-serif-libre-regular {
  font-family: "Averia Serif Libre", serif;
  font-style: normal;
}
</style>
