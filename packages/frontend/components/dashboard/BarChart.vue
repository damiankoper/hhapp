<template>
  <div style="min-height: 200px; max-height: 400px">
    <canvas ref="canvas" />
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  ref,
  PropType,
  computed,
  watch,
} from '@nuxtjs/composition-api'
import Chart, { ChartData, ChartOptions } from 'chart.js/auto'

export default defineComponent({
  props: {
    data: {
      type: Object as PropType<ChartData<'bar'>>,
      default: () => ({
        labels: [],
        datasets: [],
      }),
    },
    options: {
      type: Object as PropType<ChartOptions<'bar'>>,
      default: () => ({}),
    },
  },
  setup(props) {
    const canvas = ref<HTMLCanvasElement | null>(null)
    const config = computed(() => ({
      data: props.data,
      options: {
        responsive: true,
        ...props.options,
      },
    }))
    let chart: Chart<'bar'> | null = null
    onMounted(() => {
      const ctx = canvas.value?.getContext('2d')
      if (ctx) {
        chart = new Chart(ctx, {
          type: 'bar',
          ...config.value,
        })
      }
    })

    watch(
      config,
      () => {
        Object.assign(chart, config.value)
        chart?.update()
      },
      { deep: true }
    )

    return { canvas }
  },
})
</script>
