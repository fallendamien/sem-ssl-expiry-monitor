import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Domain {
  id: string
  name: string
  expiryDate: string // ISO string or Date
}

export const useDomainStore = defineStore('domains', () => {
  const domains = ref<Domain[]>([
    { id: '1', name: 'nexus-cloud.io', expiryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 45 + 1000 * 60 * 60 * 3).toISOString() }, // 45 days, 3 hours
    { id: '2', name: 'internal.api.node', expiryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 120).toISOString() },
    { id: '3', name: 'vault.security.io', expiryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15 + 1000 * 60 * 60 * 2).toISOString() }, // 15 days, 2 hours
  ])

  const sortedDomains = computed(() => {
    return [...domains.value].sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime())
  })

  const mostUrgentDomain = computed(() => sortedDomains.value[0] || null)

  function addDomain(domain: Domain) {
    domains.value.push(domain)
  }

  return {
    domains,
    sortedDomains,
    mostUrgentDomain,
    addDomain,
  }
})

