<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  name: string;
  productName: string;
  certificateType: string;
  issuer?: string;
  pricing: string;
  billingCycle: string;
  status: 'Active' | 'Warning' | 'Critical' | 'Expired' | 'Unknown';
  expiryDate: string | null;
  daysLeft?: number | null;
  timeFormat?: 'days' | 'detailed';
  isRunnerUp?: boolean;
}>();

const daysRemaining = computed(() => {
  if (props.daysLeft !== undefined) return props.daysLeft;
  if (!props.expiryDate) return null;
  const diff = new Date(props.expiryDate).getTime() - new Date().getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
});

const percentage = computed(() => {
  if (daysRemaining.value === null) return 0;
  const renewalWindow = 365;
  return Math.max(0, Math.min(100, (daysRemaining.value / renewalWindow) * 100));
});

const isWarning = computed(() => daysRemaining.value !== null && daysRemaining.value < 90);
const isExpired = computed(() => daysRemaining.value !== null && daysRemaining.value < 0);
const isUnknown = computed(() => daysRemaining.value === null);
const dayCount = computed(() => daysRemaining.value !== null ? Math.abs(daysRemaining.value) : '—');
const dayLabel = computed(() => (isExpired.value ? 'Days Overdue' : isUnknown.value ? 'Unknown' : 'Days Left'));
const dueDateLabel = computed(() => {
  if (!props.expiryDate) return 'N/A';
  return new Intl.DateTimeFormat('en-MY', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kuala_Lumpur',
  }).format(new Date(props.expiryDate));
});
// useRed: true for actual warning/critical domains AND the runner-up position
const useRed = computed(() => isWarning.value || !!props.isRunnerUp);

const statusLabel = computed(() => {
  if (isUnknown.value) return 'Unknown';
  if (isExpired.value) return 'Expired';
  if (isWarning.value) return props.status === 'Critical' ? 'Critical' : 'Expiring Soon';
  if (props.isRunnerUp) return 'Up Next';
  return 'Active';
});

const detailedTime = computed(() => {
  if (!props.expiryDate) return null;
  const diff = new Date(props.expiryDate).getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    months: Math.floor(diff / (1000 * 60 * 60 * 24 * 30.44)),
    days: Math.floor((diff / (1000 * 60 * 60 * 24)) % 30.44),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
  };
});
</script>

<template>
  <div class="backdrop-blur-sm p-5 rounded-2xl border transition-all"
       :class="[
         useRed && !isWarning
           ? 'bg-rose-50/60 dark:bg-rose-950/10 border-rose-200/60 dark:border-rose-900/40'
           : 'bg-white/40 dark:bg-zinc-900/40 border-white/60 dark:border-zinc-800',
         !isRunnerUp && 'group shadow-[0_4px_20px_rgb(0,0,0,0.01)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.03)]',
         !isRunnerUp && !(useRed && !isWarning) && 'dark:hover:bg-zinc-900/60',
         !isRunnerUp && useRed && !isWarning && 'hover:bg-rose-50/80',
       ]">
    <div class="flex flex-col gap-5 md:flex-row md:items-center md:justify-between md:gap-6">
      <!-- Domain Info -->
      <div class="flex items-center gap-4 flex-1">
        <div class="w-12 h-12 rounded-xl flex items-center justify-center transition-colors"
             :class="useRed ? 'bg-rose-50 dark:bg-rose-950/30 text-rose-500' : 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500'">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
        </div>

        <div>
          <h3 class="font-bold text-zinc-900 dark:text-zinc-100 transition-colors" :class="!isRunnerUp && 'group-hover:text-teal-600 dark:group-hover:text-teal-400'">{{ name }}</h3>
          <p class="mt-0.5 text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
            {{ productName }} - {{ issuer }} {{ certificateType }}
          </p>
          <div class="flex flex-wrap items-center gap-2 mt-2">
            <span class="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                  :class="useRed ? 'bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400' : 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400'">
              {{ statusLabel }}
            </span>
            <span class="text-[11px] text-zinc-400 dark:text-zinc-500 font-medium">
              {{ pricing }} / {{ billingCycle }}
            </span>
            <span class="inline-flex items-center gap-1 text-[10px] text-zinc-400/80 dark:text-zinc-500/80 font-semibold">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Due {{ dueDateLabel }}
            </span>
          </div>
        </div>
      </div>

      <!-- Expiry Stat -->
      <div class="flex flex-col items-end gap-2 min-w-[140px]">

        <!-- Days format -->
        <div v-if="timeFormat !== 'detailed' || isExpired || isUnknown || !detailedTime" class="flex items-baseline gap-1">
          <span class="text-lg font-bold tabular-nums transition-colors" :class="useRed ? 'text-rose-500' : 'text-zinc-900 dark:text-zinc-100'">
            {{ dayCount }}
          </span>
          <span class="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">{{ dayLabel }}</span>
        </div>

        <!-- Detailed format: Xm Xd Xh -->
        <div v-else class="flex items-baseline gap-2">
          <span v-if="detailedTime.months > 0" class="tabular-nums font-bold transition-colors" :class="useRed ? 'text-rose-500' : 'text-zinc-900 dark:text-zinc-100'">
            {{ detailedTime.months }}<span class="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 ml-0.5">m</span>
          </span>
          <span class="tabular-nums font-bold transition-colors" :class="useRed ? 'text-rose-500' : 'text-zinc-900 dark:text-zinc-100'">
            {{ detailedTime.days }}<span class="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 ml-0.5">d</span>
          </span>
          <span class="tabular-nums font-bold transition-colors" :class="useRed ? 'text-rose-500' : 'text-zinc-900 dark:text-zinc-100'">
            {{ detailedTime.hours }}<span class="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 ml-0.5">h</span>
          </span>
        </div>

        <!-- Progress Bar -->
        <div class="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
          <div class="h-full transition-all duration-1000 ease-out"
               :class="useRed ? 'bg-rose-400' : 'bg-emerald-400'"
               :style="{ width: `${percentage}%` }">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
