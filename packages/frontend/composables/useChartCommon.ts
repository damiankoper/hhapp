import { ChartOptions } from 'chart.js'
import { DateTime } from 'luxon'
import { useFilters } from './useFilters'

export function useChartCommon() {
  const { currency } = useFilters()

  return {
    expensesOptions: {
      plugins: {
        tooltip: {
          callbacks: {
            title: (v) =>
              DateTime.fromISO((v[0].raw as { x: string }).x).toFormat(
                'yyyy-MM'
              ),
            label: (v) => ' ' + currency((v.raw as { y: string }).y),
          },
        },
      },
      scales: {
        y: {
          ticks: { callback: (v) => currency(v as string) },
        },
        x: {
          type: 'time',
          time: {
            unit: 'month',
          },
        },
      },
      aspectRatio: 2.5,
      responsive: true,
    } as ChartOptions,
    categoriesOptions: {
      plugins: {
        tooltip: {
          callbacks: {
            label: (v: any) => ` ${v.dataset.label}: ${currency(v.raw)}`,
            footer: (items: any[]) =>
              'Total: ' + currency(items.reduce((a, b) => a + b.parsed.y, 0)),
          },
        },
      },
      scales: {
        y: {
          ticks: { callback: (v) => currency(v as string) },
          stacked: true,
        },
        x: {
          stacked: true,
        },
      },
      responsive: true,
      aspectRatio: 2.5,
    } as ChartOptions<'bar'>,
  }
}
