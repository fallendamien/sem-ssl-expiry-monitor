import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export interface Domain {
  id: string;
  name: string;
  productName: string;
  certificateType: string;
  issuer: string;
  pricing: string;
  billingCycle: string;
  status: 'Active' | 'Warning' | 'Critical' | 'Expired' | 'Unknown';
  expiryDate: string | null;
  daysLeft: number | null;
  lastChecked: string;
  checkHost: string;
  source: 'live' | 'fallback' | 'error';
  error: string | null;
}

export interface SslDataFile {
  generatedAt: string;
  successCount: number;
  failCount: number;
  domains: Domain[];
}

export const useDomainStore = defineStore('domains', () => {
  const domains = ref<Domain[]>([]);
  const isLoading = ref(false);
  const loadError = ref<string | null>(null);
  const lastRefreshed = ref<string | null>(null);

  // ─── Computed ────────────────────────────────────────────────────────────

  const sortedDomains = computed(() =>
    [...domains.value].sort((a, b) => {
      // Null dates (errors) go to the bottom
      if (!a.expiryDate) return 1;
      if (!b.expiryDate) return -1;
      return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
    }),
  );

  const mostUrgentDomain = computed(() => sortedDomains.value[0] || null);

  const nextExpiringDomain = computed(() => {
    return (
      sortedDomains.value.find((domain) => {
        if (!domain.expiryDate) return false;
        if (domain.daysLeft !== null) return domain.daysLeft > 0;

        return new Date(domain.expiryDate).getTime() > Date.now();
      }) || mostUrgentDomain.value
    );
  });

  const secondaryDomains = computed(() =>
    sortedDomains.value.filter((domain) => domain.id !== nextExpiringDomain.value?.id),
  );

  // ─── Actions ─────────────────────────────────────────────────────────────

  /**
   * Loads domain data from the pre-generated public/ssl-data.json.
   * Call this on app mount. Re-call anytime to refresh.
   */
  async function loadFromFile() {
    isLoading.value = true;
    loadError.value = null;

    try {
      // Add a cache-buster so the browser always fetches the latest file
      const res = await fetch(`/ssl-data.json?t=${Date.now()}`);
      if (!res.ok) throw new Error(`Failed to load ssl-data.json (HTTP ${res.status})`);

      const data: SslDataFile = await res.json();
      domains.value = data.domains;
      lastRefreshed.value = data.generatedAt;
    } catch (err) {
      loadError.value = err instanceof Error ? err.message : String(err);
      console.error('[SEM] Failed to load ssl-data.json:', loadError.value);
    } finally {
      isLoading.value = false;
    }
  }

  function addDomain(domain: Domain) {
    domains.value.push(domain);
  }

  return {
    domains,
    isLoading,
    loadError,
    lastRefreshed,
    sortedDomains,
    mostUrgentDomain,
    nextExpiringDomain,
    secondaryDomains,
    loadFromFile,
    addDomain,
  };
});
