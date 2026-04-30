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

const formattedDueDate = computed(() => {
  if (!props.expiryDate) return ''
  return new Intl.DateTimeFormat('en-MY', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kuala_Lumpur',
  }).format(new Date(props.expiryDate))
})

const timerBlocks = computed(() => ({
  months: timeRemaining.value.months,
  days: timeRemaining.value.days,
  hours: timeRemaining.value.hours,
  mins: timeRemaining.value.minutes,
  secs: timeRemaining.value.seconds,
}))
</script>

<template>
  <div class="relative py-10 sm:py-16 px-4 sm:px-8 text-center max-w-5xl mx-auto overflow-hidden">
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
    <h1 class="text-[1.6rem] sm:text-5xl md:text-6xl lg:text-7xl font-display font-black text-zinc-900 dark:text-white tracking-tight mb-4 break-all sm:break-words leading-[0.95]">
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
    <div class="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4 lg:gap-6 mb-12 sm:mb-16 max-w-4xl mx-auto relative">
      <div v-for="(val, unit) in timerBlocks" :key="unit"
           class="bg-white/60 dark:bg-zinc-900/40 backdrop-blur-md rounded-3xl sm:rounded-4xl p-5 sm:p-8 border border-white dark:border-zinc-800 shadow-[0_12px_40px_rgba(0,0,0,0.03)] flex flex-col items-center group hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
        <span class="text-4xl sm:text-5xl lg:text-6xl font-display font-black text-zinc-900/70 dark:text-white/70 mb-2 sm:mb-3 tabular-nums leading-none tracking-tighter transition-colors">
          {{ String(val).padStart(2, '0') }}
        </span>
        <span class="text-[9px] font-black text-teal-500/60 dark:text-teal-400/50 uppercase tracking-[0.3em] transition-colors">
          {{ unit }}
        </span>
      </div>
    </div>

    <!-- Due Date -->
    <div v-if="formattedDueDate" class="flex justify-center mb-12">
      <span class="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-teal-50/80 dark:bg-teal-950/20 border border-teal-200/60 dark:border-teal-800/40 shadow-sm shadow-teal-500/5">
        <svg class="w-4 h-4 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span class="text-xs font-bold text-teal-700 dark:text-teal-300 tracking-wide">Expires {{ formattedDueDate }}</span>
      </span>
    </div>

    <!-- Action Buttons -->
    <div class="flex flex-wrap items-center justify-center gap-4">
      <button class="px-8 py-3.5 bg-teal-500 hover:bg-teal-600 text-white rounded-xl shadow-xl shadow-teal-500/20 transition-all font-bold text-sm cursor-pointer">
        Renew Certificate
      </button>
      <button class="px-8 py-3.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 rounded-xl transition-all font-bold text-sm cursor-pointer">
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
