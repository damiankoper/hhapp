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
          <!--        <v-text-field
            v-model="from"
            hide-details
            type="month"
            :max="to"
            dense
            prepend-icon="mdi-calendar-arrow-right"
          /> -->
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
import { ChartData, ChartOptions } from 'chart.js'
import { DateTime } from 'luxon'
import _ from 'lodash'
import DatePicker from '../form/DatePicker.vue'
import LineChart from '~/components/dashboard/LineChart.vue'
import { useApi } from '~/composables/useApi'
import { useFilters } from '~/composables/useFilters'
export default defineComponent({
  components: { LineChart, DatePicker },
  setup() {
    const { currency } = useFilters()
    const month = DateTime.now().startOf('month')
    const from = ref(month.minus({ month: 5 }).toISODate())
    const to = ref(month.toFormat('yyyy-MM'))

    const { data, loading, fetch } = useApi<ChartData<'line'>>(
      '/dashboard/monthly/',
      () => ({
        params: {
          from: from.value,
          to: to.value,
        },
      })
    )

    watch(
      from,
      (f) => {
        const fd = DateTime.fromFormat(f, 'yyyy-MM')
        const td = DateTime.fromFormat(to.value, 'yyyy-MM')
        if (fd > td) from.value = to.value
      },
      { flush: 'pre' }
    )

    watch(
      to,
      (t) => {
        const fd = DateTime.fromFormat(from.value, 'yyyy-MM')
        const td = DateTime.fromFormat(t, 'yyyy-MM')
        if (td < fd) to.value = from.value
      },
      { flush: 'pre' }
    )

    const constFetch = _.debounce(() => {
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

    const options: ChartOptions = {
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: { label: (v) => ' ' + currency(v.raw as string) },
        },
      },
      scales: {
        y: {
          ticks: { callback: (v) => currency(v as string) },
        },
        x: {
          type: 'category',
        },
      },
      aspectRatio: 3,
      responsive: true,
    }

    return {
      from,
      to,
      options,
      loading,
      data: computed(() => {
        return _.merge(data.value, {
          datasets: [
            {
              borderColor: theme.currentTheme.primary,
              backgroundColor: theme.currentTheme.accent,
              fill: true,
              borderWidth: 4,
              tension: 0.1,
            },
          ],
        } as ChartData)
      }),
    }
  },
})
</script>
