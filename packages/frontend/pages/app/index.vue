<template>
  <v-row>
    <v-col :md="4" :cols="12">
      <counter
        :value="data.thisMonth"
        text="Expenses this month"
        icon="mdi-calendar-clock"
      />
    </v-col>
    <v-col :md="4" :cols="12">
      <counter
        :value="data.lastMonth"
        text="Expenses last month"
        icon="mdi-calendar-arrow-left"
      />
    </v-col>
    <v-col :md="4" :cols="12">
      <counter
        :value="data.avgMonth"
        text="Average monthly expenses"
        icon="mdi-calendar-multiple"
      />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted } from '@nuxtjs/composition-api'
import { DateTime } from 'luxon'
import Counter from '~/components/dashboard/Counter.vue'
import { useApi } from '~/composables/useApi'
import { navigationStore } from '~/store'
interface Counters {
  lastMonth: number
  thisMonth: number
  avgMonth: number
}

export default defineComponent({
  components: { Counter },
  middleware() {
    navigationStore.setTitle('App')
  },
  setup() {
    const { data, loading, fetch } = useApi<Counters>('/dashboard/counters', {
      params: {
        date: DateTime.now().toISODate(),
      },
    })

    onMounted(() => {
      fetch()
    })

    return {
      data: computed<Counters>(
        () => data.value || { lastMonth: 0, thisMonth: 0, avgMonth: 0 }
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
