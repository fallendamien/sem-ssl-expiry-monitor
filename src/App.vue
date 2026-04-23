<script setup lang="ts">
import { onMounted } from 'vue';
import TheNavbar from './components/TheNavbar.vue';
import { useDomainStore } from './stores/domains';

const store = useDomainStore();
onMounted(() => store.loadFromFile());
</script>

<template>
  <div class="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans selection:bg-teal-50 dark:selection:bg-teal-900/30 selection:text-teal-700 dark:selection:text-teal-300 flex flex-col transition-colors duration-300">
    <!-- Top Navbar -->
    <TheNavbar />

    <!-- Main Content Area -->
    <main class="flex-1 overflow-y-auto overflow-x-hidden dark:scrollbar-zinc">
      <router-view v-slot="{ Component }">
        <transition
          name="fade"
          mode="out-in"
        >
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Custom scrollbar for main area */
main::-webkit-scrollbar {
  width: 6px;
}
main::-webkit-scrollbar-track {
  background: transparent;
}
main::-webkit-scrollbar-thumb {
  background: #e5e7eb;
  border-radius: 10px;
}
.dark main::-webkit-scrollbar-thumb {
  background: #3f3f46;
}
main::-webkit-scrollbar-thumb:hover {
  background: #d1d5db;
}
.dark main::-webkit-scrollbar-thumb:hover {
  background: #52525b;
}
</style>
