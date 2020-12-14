<template>
  <div class="title">
    <block-reveal>
      <div class="upper" :style="{ fontSize: size * 4 + 'px' }">
        <span>HOUSE</span>
        <span>HOLD</span>
      </div>
    </block-reveal>
    <div
      class="lower"
      :style="{ marginLeft: size * 13.2 + 'px', fontSize: size * 2.5 + 'px' }"
    >
      <span>{{ subtitleUpper }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import BlockReveal from './style/BlockReveal.vue'

export default Vue.extend({
  components: { BlockReveal },
  name: 'Title',
  props: {
    subtitle: {
      type: String,
      default: '',
    } as PropOptions<string>,
    size: {
      type: Number,
      default: 6,
    } as PropOptions<number>,
  },

  computed: {
    subtitleUpper(): string {
      return this.subtitle.toUpperCase()
    },
  },
})
</script>

<style scoped lang="scss">
.title {
  line-height: 0.85;
  font-weight: 900;
  .upper {
    display: flex;
    span:first-child {
      color: $color-primary;
    }
  }
}
</style>
