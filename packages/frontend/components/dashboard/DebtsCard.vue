<template>
  <v-card :loading="loading">
    <v-card-title> Debts </v-card-title>
    <v-card-text>
      <v-simple-table class="table">
        <template #default>
          <tbody v-if="data && data.length">
            <tr v-for="debt in data" :key="debt.from.id + '' + debt.to.id" Z>
              <td>
                <div
                  class="d-flex align-center text-subtitle-1"
                  style="line-height: 1.2rem"
                >
                  <avatar
                    :color="debt.from.color"
                    :sex="debt.from.sex"
                    class="mr-2 my-2"
                    :size="40"
                  />
                  {{ debt.from.firstname }}
                  {{ debt.from.surname }}
                </div>
              </td>
              <td>
                <v-chip class="d-flex align-center text-h5">
                  {{ currency(debt.debt) }}
                  <v-btn icon class="ml-2">
                    <v-icon size="2em">mdi-arrow-right</v-icon>
                  </v-btn>
                </v-chip>
              </td>
              <td>
                <div
                  class="d-flex align-center text-subtitle-1"
                  style="line-height: 1.2rem"
                >
                  <avatar
                    class="mr-2 my-2"
                    :color="debt.to.color"
                    :sex="debt.to.sex"
                    :size="40"
                  />
                  {{ debt.to.firstname }}
                  {{ debt.to.surname }}
                </div>
              </td>
            </tr>
          </tbody>
          <tbody v-else class="text-center">
            <tr>
              <td>No debts this month</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
      <v-row justify="end" class="mt-4">
        <v-col :lg="3" :md="2" :sm="3" :cols="6">
          <date-picker
            v-model="date"
            type="month"
            label="Month"
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
import { defineComponent, onMounted, ref, watch } from '@nuxtjs/composition-api'
import { ChartData } from 'chart.js'
import { DateTime } from 'luxon'
import _ from 'lodash'
import DatePicker from '../form/DatePicker.vue'
import Avatar from '../Avatar.vue'
import { useApi } from '~/composables/useApi'
import { useFilters } from '~/composables/useFilters'

export default defineComponent({
  components: { DatePicker, Avatar },
  setup() {
    const { currency } = useFilters()
    const month = DateTime.now().startOf('month')
    const date = ref(month.toISODate())

    const { data, loading, fetch } = useApi<ChartData<'line'>>(
      '/dashboard/debts/',
      () => ({
        params: {
          date: date.value,
        },
      })
    )

    const constFetch = _.throttle(() => {
      fetch()
    }, 300)

    onMounted(() => {
      constFetch()
    })

    watch(date, () => {
      constFetch()
    })

    return {
      date,
      currency,
      loading,
      data,
    }
  },
})
</script>

<style lang="scss" scoped>
.table {
  line-height: 1em;
}
</style>
