<script setup lang="ts">
import { computed } from 'vue'
import { useCountdown } from '../composables/useCountdown'

const props = defineProps<{
  name: string
  expiryDate: string
}>()

const { timeRemaining } = useCountdown(props.expiryDate)

const units = computed(() => [
  { label: 'Months', value: timeRemaining.value.months },
  { label: 'Days', value: timeRemaining.value.days },
  { label: 'Hours', value: timeRemaining.value.hours },
  { label: 'Minutes', value: timeRemaining.value.minutes },
  { label: 'Seconds', value: timeRemaining.value.seconds },
])
</script>

<template>
  <div class="hero-section flex flex-col items-center justify-center py-24 text-center">
    <span class="text-sm font-medium text-teal-600 mb-4 tracking-widest uppercase">Next Expiry</span>
    <h1 class="text-4xl md:text-5xl font-bold mb-12 tracking-tight text-zinc-900">{{ name }}</h1>
    
    <div class="grid grid-cols-5 gap-4 md:gap-8">
      <div v-for="unit in units" :key="unit.label" class="flex flex-col items-center">
        <div class="glass-box p-4 md:p-6 rounded-2xl bg-white/50 backdrop-blur-xl border border-white/20 shadow-sm w-20 md:w-28">
          <span class="text-3xl md:text-5xl font-bold font-mono tracking-tighter tabular-nums text-zinc-800">
            {{ String(unit.value).padStart(2, '0') }}
          </span>
        </div>
        <span class="text-[10px] md:text-xs font-bold text-zinc-400 mt-3 uppercase tracking-widest">{{ unit.label }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.glass-box {
  transition: all 0.3s ease;
}
.hero-section:hover .glass-box {
  transform: translateY(-4px);
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 20px 40px rgba(0,0,0,0.03);
}
</style>
