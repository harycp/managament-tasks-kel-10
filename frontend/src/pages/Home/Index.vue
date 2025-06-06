<template>
  <section>
    <Dashboard
      @loaded="(isLoading) => (dashboardLoading = isLoading)"
      :name="name"
      title="Home"
    >
      <div class="flex flex-col gap-8 p-6 max-w-5xl mx-auto">
        <!-- Intro -->
        <div
          class="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm flex items-center gap-4"
        >
          <div>
            <div class="flex items-center gap-4">
              <h2 class="text-2xl font-semibold text-gray-800">
                Welcome to Tuntask
              </h2>
              <svg
                class="w-8 h-8 hover:text-gray-500 transition"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
              >
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  <path
                    d="M5 3h14v2H5V3zm0 16H3V5h2v14zm14 0v2H5v-2h14zm0 0h2V5h-2v14zM10 8H8v2h2V8zm4 0h2v2h-2V8zm-5 6v-2H7v2h2zm6 0v2H9v-2h6zm0 0h2v-2h-2v2z"
                  ></path>
                </g>
              </svg>
            </div>
            <p class="text-gray-500 mt-1 text-sm">
              Your boards. Your team. One place to manage it all.
            </p>
          </div>
        </div>

        <!-- Recently Viewed Boards -->
        <div>
          <h3 class="text-lg font-semibold text-gray-800 mb-4">
            Recently Viewed Boards
          </h3>

          <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <div
              v-for="(board, index) in recentBoards"
              :key="index"
              class="p-5 bg-white border border-gray-200 rounded-xl hover:shadow-md transition cursor-pointer"
            >
              <div class="flex items-center gap-3 mb-2">
                <div
                  class="w-10 h-10 rounded-md bg-gray-100 text-gray-600 flex items-center justify-center font-semibold text-sm"
                >
                  {{ board.initial }}
                </div>
                <div>
                  <p class="text-gray-800 font-medium leading-tight">
                    {{ board.name }}
                  </p>
                  <p class="text-xs text-gray-500">{{ board.workspace }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Dashboard>
  </section>
</template>

<script>
import Dashboard from "../../fragments/Dashboard.vue";

export default {
  name: "Home",
  components: { Dashboard },
  data() {
    return {
      dashboardLoading: true,
      name: "Home",
      recentBoards: [
        {
          name: "Product Roadmap",
          workspace: "Tuntask Team",
          initial: "P",
          isTemplate: false,
        },
        {
          name: "Sprint Planning Q3",
          workspace: "Development",
          initial: "S",
          isTemplate: false,
        },
        {
          name: "Agile Board Template",
          workspace: "Templates",
          initial: "A",
          isTemplate: true,
        },
      ],
    };
  },
  mounted() {
    document.title = "Home | Tuntask";
  },
};
</script>
