<template>
  <div>
    {{ visible }}
    <v-snackbar
      :value="visible"
      :color="type"
      :timeout="timeout"
      top
      @input="(v) => setVisible(v)"
    >
      {{ text }}
      <template #action="{ attrs }">
        <v-btn color="white" text v-bind="attrs" @click="setVisible(false)">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script lang="ts">
import { computed } from '@nuxtjs/composition-api'
import { snackbarStore } from '~/store'
export default {
  setup() {
    return {
      timeout: computed(() => snackbarStore.timeout),
      text: computed(() => snackbarStore.text),
      type: computed(() => snackbarStore.type),
      visible: computed(() => snackbarStore.visible),
      setVisible: snackbarStore.setVisible,
    }
  },
}
</script>

<style scoped></style>
