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
    timeZone: 'Asia/Kuala_Lumpur',
    year: 'numeric',
  }).format(new Date(props.expiryDate));
});
const statusLabel = computed(() => {
  if (isUnknown.value) return 'Unknown';
  if (isExpired.value) return 'Expired';
  if (isWarning.value) return props.status === 'Critical' ? 'Critical' : 'Expiring Soon';
  return 'Active';
});
</script>

<template>
  <div class="bg-white/40 dark:bg-zinc-900/40 backdrop-blur-sm p-5 rounded-2xl border border-white/60 dark:border-zinc-800 shadow-[0_4px_20px_rgb(0,0,0,0.01)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.03)] dark:hover:bg-zinc-900/60 transition-all group">
    <div class="flex flex-col gap-5 md:flex-row md:items-center md:justify-between md:gap-6">
      <!-- Domain Info -->
      <div class="flex items-center gap-4 flex-1">
        <div class="w-12 h-12 rounded-xl flex items-center justify-center transition-colors"
             :class="isWarning ? 'bg-rose-50 dark:bg-rose-950/30 text-rose-500' : 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500'">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
        </div>

        <div>
          <h3 class="font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">{{ name }}</h3>
          <p class="mt-0.5 text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
            {{ productName }} - {{ issuer }} {{ certificateType }}
          </p>
          <div class="flex flex-wrap items-center gap-2 mt-2">
            <span class="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                  :class="isWarning ? 'bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400' : 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400'">
              {{ statusLabel }}
            </span>
            <span class="text-[11px] text-zinc-400 dark:text-zinc-500 font-medium">
              {{ pricing }} / {{ billingCycle }}
            </span>
            <span class="text-[11px] text-zinc-400 dark:text-zinc-500 font-medium">
              Due {{ dueDateLabel }}
            </span>
          </div>
        </div>
      </div>

      <!-- Expiry Stat -->
      <div class="flex flex-col items-end gap-2 min-w-[140px]">
        <div class="flex items-baseline gap-1">
          <span class="text-lg font-bold tabular-nums transition-colors" :class="isWarning ? 'text-rose-500' : 'text-zinc-900 dark:text-zinc-100'">
            {{ dayCount }}
          </span>
          <span class="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">{{ dayLabel }}</span>
        </div>

        <!-- Progress Bar -->
        <div class="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
          <div class="h-full transition-all duration-1000 ease-out"
               :class="isWarning ? 'bg-rose-400' : 'bg-emerald-400'"
               :style="{ width: `${percentage}%` }">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
