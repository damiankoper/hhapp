<template>
  <transition
    :appear="appear"
    :css="false"
    @before-enter="beforeEnter"
    @enter="enter"
    @after-enter="$emit('after-enter')"
    @before-leave="beforeLeave"
    @leave="leave"
    @after-leave="$emit('after-leave')"
  >
    <span v-if="visible" class="br-container">
      <span ref="brContent" class="br-content">
        <slot />
      </span>
      <span
        ref="brBackground"
        class="br-background"
        :style="{ backgroundColor: color }"
      ></span>
    </span>
  </transition>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import anime from 'animejs'

export default Vue.extend({
  props: {
    visible: {
      type: Boolean,
      default: true,
    } as PropOptions<boolean>,
    appear: {
      type: Boolean,
      default: true,
    } as PropOptions<boolean>,
    duration: {
      type: Number,
      default: 1000,
    } as PropOptions<number>,
    delay: {
      type: Number,
      default: 0,
    } as PropOptions<number>,
    color: {
      type: String,
      default: '#0197F6',
    } as PropOptions<string>,
  },
  computed: {
    animeCommon(): object {
      return {
        easing: 'cubicBezier(0.65, 0.01, 0.41, 1)',
        duration: this.duration / 2,
      }
    },
  },
  methods: {
    beforeEnter() {
      const elBackground = this.$refs.brBackground as HTMLDivElement
      const elContent = this.$refs.brContent as HTMLDivElement

      elContent.style.visibility = 'hidden'
      elBackground.style.right = '100%'
      elBackground.style.left = '0%'
    },
    async enter(_el: HTMLElement, done: () => void) {
      await this.transition('visible', done)
    },
    beforeLeave() {
      const elBackground = this.$refs.brBackground as HTMLDivElement
      const elContent = this.$refs.brContent as HTMLDivElement

      elContent.style.visibility = 'visible'
      elBackground.style.right = '100%'
      elBackground.style.left = '0%'
    },
    async leave(_el: HTMLElement, done: () => void) {
      await this.transition('hidden', done)
    },
    async transition(visibility: 'hidden' | 'visible', done: () => void) {
      const elBackground = this.$refs.brBackground as HTMLDivElement
      const elContent = this.$refs.brContent as HTMLDivElement
      await new Promise((resolve) => setTimeout(resolve, this.delay))
      await anime({
        targets: elBackground,
        right: '0%',
        ...this.animeCommon,
      }).finished
      elContent.style.visibility = visibility
      await anime({
        targets: elBackground,
        left: '100%',
        ...this.animeCommon,
      }).finished
      done()
    },
  },
})
</script>

<style lang="scss" scoped>
.br-container {
  position: relative;
  display: inline-block;
  .br-content {
    display: inline-block;
  }
  .br-background {
    display: inline-block;
    position: absolute;
    left: 0%;
    top: -16%;
    right: 100%;
    bottom: 0%;
  }
}
</style>
