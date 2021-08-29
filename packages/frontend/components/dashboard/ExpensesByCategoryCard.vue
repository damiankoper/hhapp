<template>
  <v-card :loading="loading">
    <v-card-title> Expenses by cateogry</v-card-title>
    <v-card-text>
      <bar-chart :data="data" :options="options" class="mb-4" />
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
import BarChart from '~/components/dashboard/BarChart.vue'
import { useApi } from '~/composables/useApi'
import { useChartCommon } from '~/composables/useChartCommon'
export default defineComponent({
  components: { BarChart, DatePicker },
  setup() {
    const month = DateTime.now().startOf('month')
    const from = ref(month.minus({ months: 11 }).toISODate())
    const to = ref(month.toISODate())

    const { data, loading, fetch } = useApi<ChartData<'line'>>(
      '/dashboard/by-category',
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

    const { categoriesOptions: options } = useChartCommon()
    return {
      from,
      to,
      options,
      loading,
      data: computed(() => {
        const c = _.cloneDeep(data.value)
        c?.datasets.forEach((dataset) => {
          Object.assign(dataset, {
            borderWidth: 2,
            borderRadius: 2,
          })
        })
        return c as ChartData<'bar'>
      }),
    }
  },
})
</script>
