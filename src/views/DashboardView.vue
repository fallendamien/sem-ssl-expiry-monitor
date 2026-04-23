<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useDomainStore } from '../stores/domains'
import CountdownHero from '../components/CountdownHero.vue'
import DomainCard from '../components/DomainCard.vue'

const domainStore = useDomainStore()
const { nextExpiringDomain, secondaryDomains, isLoading, loadError, domains, lastRefreshed } = storeToRefs(domainStore)

type TimeFormat = 'days' | 'detailed'
const timeFormat = ref<TimeFormat>('days')
</script>

<template>
  <div class="p-8 space-y-12 transition-colors duration-300">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex flex-col items-center justify-center py-24 gap-4 text-zinc-400">
      <div class="w-8 h-8 border-2 border-zinc-200 dark:border-zinc-800 border-t-teal-500 rounded-full animate-spin"></div>
      <p class="text-sm font-medium">Loading certificates…</p>
    </div>

    <!-- Error State -->
    <div v-else-if="loadError" class="max-w-2xl mx-auto bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/50 rounded-2xl p-6 text-sm text-red-600 dark:text-red-400">
      <strong class="font-semibold">Could not load ssl-data.json.</strong>
      <span class="ml-1 text-red-400">{{ loadError }}</span>
      <p class="text-xs text-red-400 mt-1">Run <code class="font-mono bg-red-100 dark:bg-red-900/40 px-1 rounded">npm run check-ssl</code> to regenerate it.</p>
    </div>

    <template v-else>
      <!-- Hero Section -->
      <section v-if="nextExpiringDomain?.expiryDate" class="max-w-5xl mx-auto">
        <CountdownHero
          :name="nextExpiringDomain.name"
          :product-name="nextExpiringDomain.productName"
          :certificate-type="nextExpiringDomain.certificateType"
          :issuer="nextExpiringDomain.issuer"
          :pricing="nextExpiringDomain.pricing"
          :billing-cycle="nextExpiringDomain.billingCycle"
          :expiry-date="nextExpiringDomain.expiryDate ?? ''"
        />
      </section>

      <!-- Secondary Domain List -->
      <section class="max-w-5xl mx-auto">
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-xl font-display font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Monitored Domains</h2>
          <div class="flex items-center gap-4">
            <span v-if="lastRefreshed" class="text-[10px] text-zinc-400 font-medium hidden sm:block">
              Updated {{ lastRefreshed ? new Date(lastRefreshed).toLocaleString('en-MY') : '' }}
            </span>
            <span class="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
              {{ domains.length }} Total
            </span>
            <!-- Time format toggle -->
            <div class="flex items-center gap-0.5 bg-zinc-100 dark:bg-zinc-800 p-0.5 rounded-lg">
              <button
                class="px-2.5 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer"
                :class="timeFormat === 'days' ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm' : 'text-zinc-400 hover:text-zinc-600'"
                @click="timeFormat = 'days'"
              >Days</button>
              <button
                class="px-2.5 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer"
                :class="timeFormat === 'detailed' ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm' : 'text-zinc-400 hover:text-zinc-600'"
                @click="timeFormat = 'detailed'"
              >m · d · h</button>
            </div>
          </div>
        </div>

        <div class="grid gap-4">
          <DomainCard
            v-for="(domain, index) in secondaryDomains"
            :key="domain.id"
            v-bind="domain"
            :time-format="timeFormat"
            :is-runner-up="index === 0"
          />
        </div>
      </section>
    </template>

    <!-- Footer Stats -->
    <section class="max-w-5xl mx-auto pt-12">
      <!-- Network Health -->
      <div class="bg-white/40 dark:bg-zinc-900/40 backdrop-blur-sm p-8 rounded-3xl border border-white/60 dark:border-zinc-800 flex items-center justify-between group cursor-default">
        <div>
          <p class="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-4">Network Health</p>
          <h3 class="text-4xl font-display font-bold text-teal-500 mb-1">99.9%</h3>
          <p class="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Uptime Certificate Path</p>
        </div>
        <div class="flex items-end gap-1.5 h-12">
          <div v-for="h in [20, 40, 30, 60, 50, 80]" :key="h"
               class="w-1.5 bg-teal-200 dark:bg-zinc-700 rounded-full transition-all group-hover:bg-teal-500"
               :style="{ height: `${h}%` }">
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.font-display {
  font-family: 'Space Grotesk', sans-serif;
}
</style>
