<template>
  <section>
    <DashMain
      @loaded="(isLoading) => (dashboardLoading = isLoading)"
      :name="name"
      title="Members"
    >
      <div class="flex flex-col gap-8 p-6 max-w-3xl mx-auto">
        <div
          class="border rounded-xl bg-white divide-y divide-gray-200 shadow-sm"
        >
          <div
            v-for="member in members"
            :key="member.id"
            class="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition"
          >
            <!-- Avatar Placeholder -->
            <div
              class="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-400 to-gray-300 flex items-center justify-center text-white font-semibold uppercase tracking-wide"
            >
              {{ member.name.charAt(0) }}
            </div>

            <!-- Member Info -->
            <div class="flex flex-col text-sm">
              <span class="font-medium text-gray-800">{{ member.name }}</span>
              <span class="text-gray-500">{{ member.email }}</span>
            </div>

            <div
              class="ml-auto text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full font-medium"
            >
              {{ member.role }}
            </div>
          </div>
        </div>
      </div>
    </DashMain>
  </section>
</template>

<script>
import DashMain from "../../fragments/DashMain.vue";

export default {
  name: "MemberPage",
  components: { DashMain },
  data() {
    return {
      dashboardLoading: true,
      name: "Members",
      members: [
        {
          id: 1,
          name: "Hary Prasetyo",
          email: "hary@example.com",
          role: "Admin",
        },
        {
          id: 2,
          name: "Alya Nabila",
          email: "alya@example.com",
          role: "Member",
        },
        {
          id: 3,
          name: "Bagas Pradipta",
          email: "bagas@example.com",
          role: "Member",
        },
      ],
    };
  },
  mounted() {
    document.title = "Members | Tuntask";
    // TODO: Fetch from backend by workspaceId
  },
};
</script>
