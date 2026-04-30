<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

const isDark = ref(false)

// Watch for changes and update DOM/Storage
watch(isDark, (val) => {
  if (val) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}, { immediate: true })

const toggleDark = () => {
  isDark.value = !isDark.value
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    isDark.value = true
  } else {
    isDark.value = false
  }
})
</script>

<template>
  <header class="h-16 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-800 sticky top-0 z-30 transition-colors duration-300">
    <div class="max-w-5xl mx-auto px-4 sm:px-8 h-full flex items-center justify-between">
      <div class="flex items-center gap-10">
        <div class="flex items-center gap-3 group cursor-pointer">
          <div class="w-9 h-9 shrink-0 bg-linear-to-br from-teal-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2L3 6.5v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12v-5L12 2z" />
              <circle cx="12" cy="12" r="4" stroke-width="1.5" />
              <line x1="12" y1="12" x2="12" y2="9.5" stroke-width="1.5" stroke-linecap="round" />
              <line x1="12" y1="12" x2="14" y2="13" stroke-width="1.5" stroke-linecap="round" />
            </svg>
          </div>
          <div class="flex flex-col">
            <h1 class="text-sm font-black text-zinc-900 dark:text-white tracking-tighter leading-none flex items-center gap-1.5">
              SEM <span class="w-1 h-1 bg-teal-500 rounded-full hidden sm:inline-block"></span>
              <span class="text-zinc-400 font-bold uppercase text-[10px] tracking-widest hidden sm:inline">SSL Expiry Monitor</span>
            </h1>
            <span class="text-zinc-400 font-bold uppercase text-[8px] tracking-widest sm:hidden">SSL Expiry Monitor</span>
          </div>
        </div>
        
        <nav class="hidden lg:flex items-center gap-8">
          <a href="#" class="text-xs font-bold text-teal-600 border-b-2 border-teal-500 pb-5 translate-y-[12px] uppercase tracking-widest">Dashboard</a>
          <a href="#" class="text-xs font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 pb-5 translate-y-[12px] transition-colors uppercase tracking-widest">Expiring Soon</a>
          <a href="#" class="text-xs font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 pb-5 translate-y-[12px] transition-colors uppercase tracking-widest">Inventory</a>
        </nav>
      </div>

      <div class="flex items-center gap-2 sm:gap-4">
        <!-- Dark Mode Toggle -->
        <button @click="toggleDark" class="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors focus:outline-none cursor-pointer" title="Toggle Theme">
          <svg v-if="!isDark" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
          </svg>
        </button>

        <button class="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors relative cursor-pointer">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span class="absolute top-2 right-2 w-2 h-2 bg-rose-500 border-2 border-white dark:border-zinc-900 rounded-full"></span>
        </button>
        
        <button class="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer hidden sm:block">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>

        <div class="w-8 h-8 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-700">
          <img src="https://ui-avatars.com/api/?name=PM+User&background=14b8a6&color=fff" alt="User Profile" class="w-full h-full object-cover">
        </div>
      </div>
    </div>
  </header>
</template>
