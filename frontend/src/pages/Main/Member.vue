<template>
  <section>
    <DashMain
      @loaded="(isLoading) => (dashboardLoading = isLoading)"
      :name="name"
      title="Members"
    >
      <div class="flex flex-col gap-8 p-6 max-w-2xl mx-auto">
        <!-- Add Member Button -->
        <div class="flex justify-end">
          <button
            @click="showAddMemberModal = true"
            class="px-4 py-2 bg-black text-white text-sm rounded-md hover:bg-white hover:!text-black transition"
          >
            + Add Member
          </button>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="text-center text-neutral-400 text-sm">
          Loading members...
        </div>

        <!-- Members List -->
        <div
          v-else-if="members.length > 0"
          class="rounded-md border border-neutral-200 bg-white shadow-sm divide-y divide-neutral-100"
        >
          <div
            v-for="member in members"
            :key="member.id"
            class="flex items-center gap-4 px-4 py-3"
          >
            <!-- Avatar -->
            <div
              class="w-9 h-9 rounded-md bg-neutral-100 text-neutral-600 flex items-center justify-center text-sm font-medium"
            >
              {{ member.name.charAt(0) }}
            </div>

            <!-- Info -->
            <div class="flex flex-col text-sm">
              <span class="font-medium text-neutral-800">{{
                member.name
              }}</span>
              <span class="text-neutral-500">{{ member.email }}</span>
            </div>

            <!-- Role -->
            <div
              class="ml-auto text-xs text-neutral-600 bg-neutral-100 px-2 py-1 rounded-md font-medium"
            >
              {{ member.role }}
            </div>

            <!-- Remove Button -->
            <button
              v-if="member.role !== 'owner'"
              @click="promptToRemoveMember(member)"
              class="ml-4 text-red-500 hover:text-red-600"
              title="Remove"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>

        <!-- Empty State -->
        <div
          v-else
          class="text-center text-neutral-400 border border-dashed border-neutral-300 rounded-md p-6 text-sm"
        >
          No members found in this workspace.
        </div>
      </div>

      <!-- Add Member Modal -->
      <div
        v-if="showAddMemberModal"
        class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      >
        <div
          class="bg-white p-6 rounded-md shadow-md border border-neutral-200 w-full max-w-md"
        >
          <h3 class="text-base font-medium mb-4 text-neutral-800">
            Add New Member
          </h3>

          <form @submit.prevent="handleAddMember" class="space-y-4">
            <div>
              <label
                for="email"
                class="block text-sm font-medium text-neutral-700"
              >
                Member's Email
              </label>
              <input
                v-model="newMember.email"
                type="email"
                id="email"
                required
                class="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
              />
            </div>

            <div>
              <label
                for="role"
                class="block text-sm font-medium text-neutral-700"
              >
                Role
              </label>
              <select
                v-model="newMember.role"
                id="role"
                class="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div class="flex justify-end gap-3 pt-4">
              <button
                type="button"
                @click="showAddMemberModal = false"
                class="px-4 py-2 bg-neutral-100 text-neutral-700 text-sm rounded-md hover:bg-neutral-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="px-4 py-2 bg-black text-white text-sm rounded-md hover:bg-neutral-800 transition"
              >
                Add Member
              </button>
            </div>
          </form>
        </div>
      </div>
      <ConfirmationModal
        :show="showRemoveConfirmModal"
        title="Remove Member"
        :message="removeConfirmationMessage"
        confirmText="Yes, Remove"
        cancelText="Cancel"
        @confirm="executeRemoveMember"
        @close="closeRemoveModal"
      />
    </DashMain>
  </section>
</template>

<script>
import axios from "axios";
import DashMain from "../../fragments/DashMain.vue";
import PrimaryButton from "../../components/common/PrimaryButton.vue";
import ConfirmationModal from "../../components/common/ConfirmationModal.vue";

export default {
  name: "MemberPage",
  components: { DashMain, PrimaryButton, ConfirmationModal },
  data() {
    return {
      name: "Members",
      members: [],
      isLoading: true,
      workspaceId: null,
      showAddMemberModal: false,
      newMember: {
        email: "",
        role: "member",
      },
      showRemoveConfirmModal: false,
      memberToRemove: null,
    };
  },
  computed: {
    removeConfirmationMessage() {
      if (!this.memberToRemove) return "";
      return `Are you sure you want to remove "${this.memberToRemove.name}" from this workspace? This action cannot be undone.`;
    },
  },
  async created() {
    document.title = "Members | Tuntask";
    this.workspaceId = this.$route.params.workspaceId;
    if (this.workspaceId) {
      await this.fetchMembers();
    } else {
      console.error("Workspace ID is missing from route params.");
      this.isLoading = false;
    }
  },
  methods: {
    async fetchMembers() {
      this.isLoading = true;
      try {
        const response = await axios.get(
          `http://localhost:5002/api/workspaceMembers/${this.workspaceId}`,
          { withCredentials: true }
        );
        this.members = response.data.data;
      } catch (error) {
        console.error("Error fetching members:", error);
        this.members = [];
      } finally {
        this.isLoading = false;
      }
    },

    async handleAddMember() {
      if (!this.newMember.email) return;
      try {
        await axios.post(
          `http://localhost:5002/api/workspaces/${this.workspaceId}/members`,
          this.newMember,
          { withCredentials: true }
        );

        // Reset form, tutup modal, dan refresh data
        this.newMember.email = "";
        this.newMember.role = "member";
        this.showAddMemberModal = false;
        await this.fetchMembers(); // Muat ulang daftar member
        // Tambahkan notifikasi sukses jika perlu
      } catch (error) {
        console.error("Error adding member:", error.response.data);
        alert(`Failed to add member: ${error.response.data.message}`);
      }
    },

    promptToRemoveMember(member) {
      this.memberToRemove = member;
      this.showRemoveConfirmModal = true;
    },

    closeRemoveModal() {
      this.showRemoveConfirmModal = false;
      this.memberToRemove = null;
    },
    executeRemoveMember() {
      if (!this.memberToRemove) return;
      this.handleRemoveMember(this.memberToRemove.id);
      this.closeRemoveModal();
    },

    async handleRemoveMember(userId) {
      try {
        await axios.delete(
          `http://localhost:5002/api/workspaces/${this.workspaceId}/members/${userId}`,
          { withCredentials: true }
        );
        await this.fetchMembers(); // Muat ulang daftar member
        // Tambahkan notifikasi sukses jika perlu
      } catch (error) {
        console.error("Error removing member:", error.response.data);
        alert(`Failed to remove member: ${error.response.data.message}`);
      }
    },
  },
};
</script>
