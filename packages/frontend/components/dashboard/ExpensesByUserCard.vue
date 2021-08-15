<template>
  <v-card :loading="loading">
    <v-card-title> Expenses monthly by user</v-card-title>
    <v-card-text>
      <line-chart :data="data" :options="options" class="mb-4" />
      <v-row justify="end">
        <v-col :lg="3" :md="2" :sm="3" :cols="6">
          <date-picker
            v-model="from"
            :max="to"
            type="month"
            label="From"
            dense
            prepend-icon="mdi-calendar-arrow-right"
            hide-details
          />
        </v-col>
        <v-col :lg="3" :md="2" :sm="3" :cols="6">
          <date-picker
            v-model="to"
            :min="from"
            type="month"
            label="To"
            dense
            prepend-icon="mdi-calendar-arrow-right"
            hide-details
          />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  ref,
  watch,
} from '@nuxtjs/composition-api'
import { ChartData } from 'chart.js'
import { DateTime } from 'luxon'
import _ from 'lodash'
import DatePicker from '../form/DatePicker.vue'
import LineChart from '~/components/dashboard/LineChart.vue'
import { useApi } from '~/composables/useApi'
import { useChartCommon } from '~/composables/useChartCommon'
import { useFilters } from '~/composables/useFilters'
export default defineComponent({
  components: { LineChart, DatePicker },
  setup() {
    const { currency } = useFilters()
    const month = DateTime.now().startOf('month')
    const from = ref(month.minus({ month: 5 }).toISODate())
    const to = ref(month.toISODate())

    const { data, loading, fetch } = useApi<ChartData<'line'>>(
      '/dashboard/by-user',
      () => ({
        params: {
          from: from.value,
          to: to.value,
        },
      })
    )

    const constFetch = _.throttle(() => {
      fetch()
    }, 300)

    onMounted(() => {
      constFetch()
    })

    watch([from, to], () => {
      constFetch()
    })

    const { expensesOptions: options } = useChartCommon()

    return {
      from,
      to,
      options: computed(() =>
        _.merge(options, {
          plugins: {
            tooltip: {
              callbacks: {
                label: (v: any) =>
                  ` ${v.dataset.label}: ${currency(
                    (v.raw as { y: string }).y
                  )}`,
              },
            },
          },
        })
      ),
      loading,
      data: computed(() => {
        const c = _.cloneDeep(data.value)
        c?.datasets.forEach((dataset) => {
          Object.assign(dataset, {
            fill: true,
            borderWidth: 4,
            tension: 0.1,
          })
        })
        return c as ChartData
      }),
    }
  },
})
</script>
