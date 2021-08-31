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
      responsive: true,
      maintainAspectRatio: false,
    } as ChartOptions,
    categoriesOptions: {
      plugins: {
        tooltip: {
          callbacks: {
            label: (v: any) => ` ${v.dataset.label}: ${currency(v.raw)}`,
            footer: (items: any[]) => {
              let sum = 0
              for (let i = 0; i < items[0].chart.data.datasets.length; i++) {
                sum += items[0].parsed._stacks.y[i]
              }
              return 'Total: ' + currency(String(sum))
            },
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
      maintainAspectRatio: false,
    } as ChartOptions<'bar'>,
  }
}
