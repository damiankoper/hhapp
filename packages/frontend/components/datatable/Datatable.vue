<template>
  <div>{{ test }}</div>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'

export default defineComponent({
  setup() {
    const test = ref('test')
    return { test }
  },
})
</script>

<style scoped></style>
