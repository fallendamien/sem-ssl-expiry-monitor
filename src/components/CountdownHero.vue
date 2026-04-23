<script setup lang="ts">
import { computed } from 'vue'
import { useCountdown } from '../composables/useCountdown'

const props = defineProps<{
  name: string
  productName?: string
  certificateType?: string
  issuer?: string
  pricing?: string
  billingCycle?: string
  expiryDate: string
}>()

const { timeRemaining } = useCountdown(props.expiryDate)

const timerBlocks = computed(() => ({
  months: timeRemaining.value.months,
  days: timeRemaining.value.days,
  hours: timeRemaining.value.hours,
  mins: timeRemaining.value.minutes,
  secs: timeRemaining.value.seconds,
}))
</script>

<template>
  <div class="relative py-16 px-8 text-center max-w-5xl mx-auto overflow-hidden">
    <!-- Subtle Background Glow -->
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-500/5 dark:bg-teal-400/5 blur-[120px] rounded-full -z-10 animate-pulse"></div>

    <!-- Urgent Badge -->
    <div class="flex justify-center mb-8">
      <span class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950/30 text-[10px] font-black text-rose-600 dark:text-rose-400 uppercase tracking-[0.2em] border border-rose-100 dark:border-rose-900/50 shadow-sm shadow-rose-500/5">
        <span class="w-2 h-2 rounded-full bg-rose-500 animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.6)]"></span>
        Next SSL Expiry
      </span>
    </div>

    <!-- Domain Info -->
    <h1 class="text-5xl sm:text-6xl lg:text-7xl font-display font-black text-zinc-900 dark:text-white tracking-tight mb-4 wrap-break-word leading-[0.9]">
      {{ name }}
    </h1>
    <p class="text-zinc-500 dark:text-zinc-400 font-bold mb-14 flex flex-wrap items-center justify-center gap-3 text-xs uppercase tracking-widest">
      <span class="text-teal-600 dark:text-teal-400">{{ productName || 'SSL Certificate' }}</span>
      <span class="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700"></span>
      <span>{{ issuer }}</span>
      <span class="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700"></span>
      <span class="text-zinc-400 dark:text-zinc-500">{{ certificateType }}</span>
    </p>

    <!-- Countdown Grid -->
    <div class="grid grid-cols-2 md:grid-cols-5 gap-4 lg:gap-6 mb-16 max-w-4xl mx-auto relative">
      <div v-for="(val, unit) in timerBlocks" :key="unit"
           class="bg-white/60 dark:bg-zinc-900/40 backdrop-blur-md rounded-4xl p-8 border border-white dark:border-zinc-800 shadow-[0_12px_40px_rgba(0,0,0,0.03)] flex flex-col items-center group hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
        <span class="text-5xl lg:text-6xl font-display font-black text-zinc-900 dark:text-white mb-3 tabular-nums leading-none tracking-tighter group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
          {{ String(val).padStart(2, '0') }}
        </span>
        <span class="text-[9px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.3em] group-hover:text-teal-500/60 transition-colors">
          {{ unit }}
        </span>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex flex-wrap items-center justify-center gap-4">
      <button class="px-8 py-3.5 bg-teal-500 hover:bg-teal-600 text-white rounded-xl shadow-xl shadow-teal-500/20 transition-all font-bold text-sm">
        Renew Certificate
      </button>
      <button class="px-8 py-3.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 rounded-xl transition-all font-bold text-sm">
        {{ pricing }} / {{ billingCycle }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.font-display {
  font-family: 'Space Grotesk', sans-serif;
}
</style>
