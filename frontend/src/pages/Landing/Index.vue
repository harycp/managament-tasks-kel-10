<template>
  <div class="relative w-full h-full bg-white">
    <Navbar />
    <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <Hero />
      <Demo />
      <FeatureContent />
    </div>
    <FeatureContentTwo />
    <FeatureContentThree />
    <section>
      <Footer />
    </section>
  </div>
</template>

<script>
import Navbar from "../../fragments/Navbar.vue";
import Footer from "../../fragments/Footer.vue";
import PrimaryButton from "../../components/common/PrimaryButton.vue";
import Hero from "../../components/layout/Hero.vue";
import Demo from "../../components/sections/Demo.vue";
import FeatureContent from "../../components/sections/FeatureContent.vue";
import FeatureContentTwo from "../../components/sections/FeatureContentTwo.vue";
import FeatureContentThree from "../../components/sections/FeatureContentThree.vue";

export default {
  components: {
    Navbar,
    Footer,
    PrimaryButton,
    Hero,
    Demo,
    FeatureContent,
    FeatureContentTwo,
    FeatureContentThree,
  },
};
</script>
