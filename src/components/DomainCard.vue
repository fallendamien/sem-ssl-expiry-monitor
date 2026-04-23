<script setup lang="ts">
import { useCountdown } from '../composables/useCountdown'

const props = defineProps<{
  name: string
  expiryDate: string
}>()

const { timeRemaining } = useCountdown(props.expiryDate)
</script>

<template>
  <div class="flex items-center justify-between p-6 bg-white rounded-2xl border border-zinc-100 hover:border-teal-100 transition-all group shadow-sm hover:shadow-md">
    <div class="flex flex-col">
      <span class="text-lg font-semibold text-zinc-800">{{ name }}</span>
      <span class="text-xs text-zinc-400 mt-1 uppercase tracking-wider font-medium">Monitoring active</span>
    </div>
    
    <div class="flex gap-4 items-baseline tabular-nums">
      <div class="flex flex-col items-end">
        <span class="text-xl font-bold text-zinc-700">{{ timeRemaining.months }}m {{ timeRemaining.days }}d</span>
        <span class="text-[10px] text-zinc-400 uppercase font-bold tracking-tighter">Remaining</span>
      </div>
      
      <div :class="[
        'w-2 h-2 rounded-full',
        timeRemaining.total > 1000 * 60 * 60 * 24 * 30 ? 'bg-teal-500 shadow-[0_0_10px_rgba(20,184,166,0.5)] animate-pulse' : 'bg-coral-500 shadow-[0_0_10px_rgba(251,113,133,0.5)]'
      ]"></div>
    </div>
  </div>
</template>

<style scoped>
.bg-coral-500 {
  background-color: #fb7185;
}
</style>
