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
import PrimaryButton from "../../components/PrimaryButton.vue";
import Hero from "../../components/Hero.vue";
import Demo from "../../components/Demo.vue";
import FeatureContent from "../../components/FeatureContent.vue";
import FeatureContentTwo from "../../components/FeatureContentTwo.vue";
import FeatureContentThree from "../../components/FeatureContentThree.vue";

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
