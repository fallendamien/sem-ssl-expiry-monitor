import { ref, onMounted, onUnmounted, computed } from 'vue'

export function useCountdown(targetDate: string | Date) {
  const now = ref(new Date())
  let timer: number

  const target = computed(() => new Date(targetDate))

  const updateNow = () => {
    now.value = new Date()
  }

  onMounted(() => {
    timer = window.setInterval(updateNow, 1000)
  })

  onUnmounted(() => {
    window.clearInterval(timer)
  })

  const timeRemaining = computed(() => {
    const diff = target.value.getTime() - now.value.getTime()
    if (diff <= 0) return { months: 0, days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 }

    const seconds = Math.floor((diff / 1000) % 60)
    const minutes = Math.floor((diff / 1000 / 60) % 60)
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
    const days = Math.floor((diff / (1000 * 60 * 60 * 24)) % 30.44) // Average month length
    const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30.44))

    return { months, days, hours, minutes, seconds, total: diff }
  })

  return {
    timeRemaining
  }
}
