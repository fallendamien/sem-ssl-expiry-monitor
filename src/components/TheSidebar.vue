<script setup lang="ts">
import { computed } from 'vue';
import { useDomainStore } from '../stores/domains';

const domainStore = useDomainStore();
const activeMonitorCount = computed(() => domainStore.domains.length);
const expiringSoonCount = computed(() => {
  return domainStore.domains.filter((domain) => {
    if (!domain.expiryDate) return false;
    const daysUntilExpiry = Math.ceil(
      (new Date(domain.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
    );
    return daysUntilExpiry < 30;
  }).length;
});

const navItems = [
  { name: 'Dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z', active: true },
  { name: 'Expiring Soon', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', count: expiringSoonCount },
  { name: 'Domain Inventory', icon: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9' },
  { name: 'Reports', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
];
</script>

<template>
  <aside class="hidden lg:flex w-64 shrink-0 bg-white dark:bg-zinc-950 border-r border-zinc-100 dark:border-zinc-800 flex-col h-full overflow-y-auto transition-colors duration-300">
    <!-- Logo/Project Section -->
    <div class="p-6 border-b border-zinc-50 dark:border-zinc-900 mb-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center text-white shadow-lg shadow-teal-500/20">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <div>
          <h2 class="font-display font-bold text-zinc-900 dark:text-zinc-100 leading-tight">Project Alpha</h2>
          <p class="text-xs text-zinc-400 dark:text-zinc-500 font-medium">{{ activeMonitorCount }} Active Monitors</p>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 px-4 space-y-1">
      <a 
        v-for="item in navItems" 
        :key="item.name"
        href="#"
        class="flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 group"
        :class="item.active ? 'bg-teal-50/50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400' : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100'"
      >
        <div class="flex items-center gap-3">
          <svg class="w-5 h-5" :class="item.active ? 'text-teal-500' : 'text-zinc-400 dark:text-zinc-600 group-hover:text-zinc-600 dark:group-hover:text-zinc-400'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="item.icon" />
          </svg>
          <span class="text-sm font-semibold tracking-tight">{{ item.name }}</span>
        </div>
        <span v-if="item.count" class="text-[10px] bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 px-1.5 py-0.5 rounded-md font-bold">{{ item.count }}</span>
      </a>
    </nav>

    <!-- Bottom Actions -->
    <div class="p-4 mt-auto space-y-4">
      <button class="w-full py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-xl shadow-lg shadow-teal-500/20 transition-all font-bold text-sm flex items-center justify-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        New Domain
      </button>

      <div class="pt-4 border-t border-zinc-100 dark:border-zinc-900 space-y-1">
        <button class="w-full flex items-center gap-3 px-3 py-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors text-sm font-semibold">
          <svg class="w-5 h-5 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          Help
        </button>
        <button class="w-full flex items-center gap-3 px-3 py-2 text-zinc-400 dark:text-zinc-500 hover:text-rose-500 transition-colors text-sm font-semibold">
          <svg class="w-5 h-5 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          Logout
        </button>
      </div>
    </div>
  </aside>
</template>
