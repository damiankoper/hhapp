<template>
  <v-card :loading="loading">
    <v-card-text>
      <v-row dense align="end" justify="end">
        <v-col cols="auto">
          <v-icon
            style="line-height: 0.88em"
            size="3.5rem"
            color="primary lighten-1"
          >
            {{ icon }}
          </v-icon>
        </v-col>
        <v-col class="text-right">
          {{ text }}
          <div class="primary--text text-h3">
            {{ currency(value) }}
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import { useFilters } from '~/composables/useFilters'

export default defineComponent({
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: String,
      default: 'mdi-account-cash',
    },
    text: {
      type: String,
      default: 'Expenses last month',
    },
    value: {
      type: Number,
      default: 0,
    },
  },
  setup() {
    return {
      ...useFilters(),
    }
  },
})
</script>

<style scoped></style>
