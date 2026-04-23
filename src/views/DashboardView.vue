<script setup lang="ts">
import { useDomainStore } from '../stores/domains'
import CountdownHero from '../components/CountdownHero.vue'
import DomainCard from '../components/DomainCard.vue'

const domainStore = useDomainStore()
</script>

<template>
  <div class="dashboard-container min-h-screen bg-[#fdfdfd] selection:bg-teal-100">
    <div class="max-w-5xl mx-auto px-6">
      <!-- Hero Section for the Most Urgent Domain -->
      <transition name="fade-slide" appear>
        <CountdownHero 
          v-if="domainStore.mostUrgentDomain"
          :name="domainStore.mostUrgentDomain.name"
          :expiry-date="domainStore.mostUrgentDomain.expiryDate"
        />
      </transition>

      <!-- Secondary Section for other domains -->
      <section v-if="domainStore.sortedDomains.length > 1" class="mt-12 pb-24">
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-xs font-bold text-zinc-400 uppercase tracking-[0.2em]">Monitored Domains</h2>
          <div class="h-[1px] flex-grow mx-6 bg-zinc-100"></div>
          <span class="text-xs font-bold text-zinc-400 tabular-nums">
            {{ domainStore.sortedDomains.length }} Total
          </span>
        </div>

        <div class="grid grid-cols-1 gap-4">
          <transition-group name="list">
            <DomainCard 
              v-for="domain in domainStore.sortedDomains.slice(1)" 
              :key="domain.id"
              :name="domain.name"
              :expiry-date="domain.expiryDate"
            />
          </transition-group>
        </div>
      </section>

      <!-- Empty State -->
      <div v-if="domainStore.domains.length === 0" class="flex flex-col items-center justify-center py-48 opacity-30">
        <div class="w-12 h-12 rounded-full border-2 border-zinc-200 border-dashed animate-[spin_10s_linear_infinite]"></div>
        <p class="mt-6 text-sm font-medium">Listening for certificates...</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-container {
  font-family: 'Inter', sans-serif;
}

/* Animations */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateX(-10px);
}

.list-move {
  transition: transform 0.5s ease;
}
</style>

