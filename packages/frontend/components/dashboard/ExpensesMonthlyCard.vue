<template>
  <v-card :loading="loading">
    <v-card-title> Expenses monthly </v-card-title>
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
  useContext,
  watch,
} from '@nuxtjs/composition-api'
import { ChartData } from 'chart.js'
import { DateTime } from 'luxon'
import _ from 'lodash'
import Color from 'color'
import DatePicker from '../form/DatePicker.vue'
import LineChart from '~/components/dashboard/LineChart.vue'
import { useApi } from '~/composables/useApi'
import { useChartCommon } from '~/composables/useChartCommon'

export default defineComponent({
  components: { LineChart, DatePicker },
  setup() {
    const month = DateTime.now().startOf('month')
    const from = ref(month.minus({ months: 11 }).toISODate())
    const to = ref(month.toISODate())

    const { data, loading, fetch } = useApi<ChartData<'line'>>(
      '/dashboard/monthly/',
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

    const {
      $vuetify: { theme },
    } = useContext()

    const { expensesOptions: options } = useChartCommon()

    return {
      from,
      to,
      options: computed(() => _.merge(options, { plugins: { legend: false } })),
      loading,
      data: computed(() => {
        const c = _.cloneDeep(data.value)
        c?.datasets.forEach((dataset) => {
          const color = Color(theme.currentTheme.primary)
          Object.assign(dataset, {
            backgroundColor: color.fade(0.8).string(),
            borderColor: color.string(),
            fill: true,
            borderWidth: 4,
            tension: 0.4,
          })
        })
        return c as ChartData
      }),
    }
  },
})
</script>
