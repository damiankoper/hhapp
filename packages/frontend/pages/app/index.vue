<template>
  <v-row>
    <v-col :md="4" :cols="12">
      <counter
        :value="+countersData.thisMonth"
        text="Expenses this month"
        icon="mdi-calendar-clock"
      />
    </v-col>
    <v-col :md="4" :cols="12">
      <counter
        :value="+countersData.lastMonth"
        text="Expenses last month"
        icon="mdi-calendar-arrow-left"
      />
    </v-col>
    <v-col :md="4" :cols="12">
      <counter
        :value="+countersData.avgMonth"
        text="Average monthly expenses"
        icon="mdi-calendar-multiple"
      />
    </v-col>
    <v-col :lg="6" :cols="12">
      <expenses-monthly-card />
    </v-col>
    <v-col :lg="6" :cols="12"> Expenses by user </v-col>
    <v-col :cols="12">
      <v-card
        height="400px"
        class="tradingview-widget-container"
        style="overflow: hidden; height: 400px"
      >
        <div
          id="tradingview_a3175"
          style="overflow: hidden; height: 400px"
        ></div>
        <script
          type="text/javascript"
          src="https://s3.tradingview.com/tv.js"
        ></script>
        <script type="text/javascript">
          new TradingView.widget({
            autosize: true,
            symbol: 'NYSE:NOK',
            interval: 'D',
            timezone: 'Etc/UTC',
            theme: 'dark',
            style: '1',
            locale: 'en',
            toolbar_bg: '#f1f3f6',
            enable_publishing: false,
            allow_symbol_change: true,
            container_id: 'tradingview_a3175',
          })
        </script>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted } from '@nuxtjs/composition-api'
import { DateTime } from 'luxon'
import Counter from '~/components/dashboard/Counter.vue'
import ExpensesMonthlyCard from '~/components/dashboard/ExpensesMonthlyCard.vue'
import { useApi } from '~/composables/useApi'
import { navigationStore } from '~/store'

interface Counters {
  lastMonth: number
  thisMonth: number
  avgMonth: number
}

export default defineComponent({
  components: { Counter, ExpensesMonthlyCard },
  middleware() {
    navigationStore.setTitle('App')
  },
  setup() {
    const {
      data: countersData,
      loading,
      fetch,
    } = useApi<Counters>('/dashboard/counters', {
      params: {
        date: DateTime.now().toISODate(),
      },
    })

    onMounted(() => {
      fetch()
    })

    return {
      countersData: computed<Counters>(
        () => countersData.value || { lastMonth: 0, thisMonth: 0, avgMonth: 0 }
      ),
      loading,
    }
  },
  head() {
    return {
      title: 'Dashboard',
    }
  },
})
</script>
