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
    <v-col :lg="6" :cols="12">
      <expenses-by-user-card />
    </v-col>
    <v-col :lg="6" :cols="12">
      <expenses-by-category-card />
    </v-col>
    <v-col :lg="6" :cols="12">
      <debts-card />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  onUnmounted,
  useContext,
} from '@nuxtjs/composition-api'
import { DateTime } from 'luxon'
import { NuxtSocketOpts } from 'nuxt-socket-io'
import Counter from '~/components/dashboard/Counter.vue'
import ExpensesMonthlyCard from '~/components/dashboard/ExpensesMonthlyCard.vue'
import ExpensesByUserCard from '~/components/dashboard/ExpensesByUserCard.vue'
import ExpensesByCategoryCard from '~/components/dashboard/ExpensesByCategoryCard.vue'
import DebtsCard from '~/components/dashboard/DebtsCard.vue'
import { useApi } from '~/composables/useApi'
import { navigationStore } from '~/store'

interface Counters {
  lastMonth: number
  thisMonth: number
  avgMonth: number
}

export default defineComponent({
  components: {
    Counter,
    ExpensesMonthlyCard,
    ExpensesByUserCard,
    ExpensesByCategoryCard,
    DebtsCard,
  },
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

    const ctx = useContext()
    const { $nuxtSocket, $auth } = ctx

    const socket = ctx.$nuxtSocket({
      auth: { token: ($auth.strategy as any).token.get() },
    } as NuxtSocketOpts)

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
