import { DateTime } from 'luxon'

export function useFilters() {
  return {
    number(s: string) {
      return new Intl.NumberFormat('pl-PL', {
        maximumFractionDigits: 3,
        minimumFractionDigits: 3,
      }).format(+s)
    },
    currency(s: string) {
      return new Intl.NumberFormat('pl-PL', {
        style: 'currency',
        currency: 'PLN',
      }).format(+s)
    },
    isoDate(s: string) {
      return DateTime.fromISO(s).toISODate()
    },
  }
}
