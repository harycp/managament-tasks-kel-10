<template>
  <div class="flex min-h-screen">
    <!-- Sidebar -->
    <SideBar> </SideBar>

    <main
      class="flex-1 p-4 overflow-y-scroll h-screen flex flex-col gap-4"
    ></main>
  </div>
</template>

<script>
import NavDropdown from "../components/dashboard/NavDropdown.vue";
import Logo from "../components/layout/Logo.vue";
import NavItem from "../components/dashboard/NavItem.vue";
import SideBar from "../components/dashboard/SideBar.vue";

export default {
  components: {
    Logo,
    NavItem,
    SideBar,
    NavDropdown,
  },
  data() {
    return {
      isLoading: true,
    };
  },
  props: {
    title: String,
    name: String,
  },
  async mounted() {
    this.isLoading = false;
    this.$emit("user", this.user);
    this.$emit("loaded", this.isLoading);
  },
};
</script>
