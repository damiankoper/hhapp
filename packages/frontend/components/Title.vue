<template>
  <div class="title">
    <div>
      <block-reveal
        :color="$vuetify.theme.themes.light.primary"
        :duration="900"
      >
        <div class="upper" :style="{ fontSize: size * 4 + 'px' }">
          <span>HOUSE</span>
          <span>HOLD</span>
        </div>
      </block-reveal>
    </div>
    <div
      class="lower"
      :style="{
        paddingLeft: size * 13.2 + 'px',
        fontSize: size * 2.5 + 'px',
      }"
    >
      <block-reveal
        :color="$vuetify.theme.themes.light.accent"
        :delay="400"
        :duration="500"
        :visible="subtitleVisible"
        @after-leave="subtitleVisible = true"
      >
        <span class="lower">{{ subtitleUpper }}</span>
      </block-reveal>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import BlockReveal from './style/BlockReveal.vue'

export default Vue.extend({
  name: 'Title',
  components: { BlockReveal },
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

  data() {
    return { subtitleVisible: true }
  },

  computed: {
    subtitleUpper(): string {
      return this.subtitle.toUpperCase()
    },
  },
  watch: {
    subtitle() {
      this.subtitleVisible = false
    },
  },
})
</script>

<style scoped lang="scss">
.title {
  * {
    line-height: 1em;
  }
  font-weight: 900;
  position: relative;
  text-align: left;
  .upper {
    display: flex;
    span:first-child {
      color: $color-primary;
    }
  }
  .lower {
    position: relative;
    top: -0.125em;
  }
}
</style>
