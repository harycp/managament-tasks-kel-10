<template>
  <div
    v-if="isLoading"
    class="w-full h-screen flex justify-center items-center z-[999] fixed left-0 top-0 bg-white"
  >
    <!-- <img class="w-14" :src="LoadingImage" alt="Loading..." /> -->
    <LogoLoading />
  </div>
</template>

<script>
import LoadingSrc from "../../assets/tenor.gif";
import LogoLoading from "../layout/LogoLoading.vue";
export default {
  components: { LogoLoading },
  props: {
    isLoading: Boolean,
  },
  data() {
    return {
      LoadingImage: LoadingSrc,
    };
  },
};
</script>
