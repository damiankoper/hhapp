<template>
  <div
    class="avatar-container"
    :style="{
      width: size + 'px',
      height: size + 'px',
    }"
  >
    <div
      class="avatar"
      :style="{
        width: size + 'px',
        height: size + 'px',
        borderWidth: 4 * resizeFactor + 'px',
      }"
    >
      <img v-if="isMale" src="@/assets/icons/boy.svg" />
      <img v-else src="@/assets/icons/girl.svg" />
    </div>
    <div
      class="color-circle"
      :style="{
        borderColor: color,
        width: size / 2 + 'px',
        height: size / 2 + 'px',

        right: -1 * resizeFactor + 'px',
        bottom: -1 * resizeFactor + 'px',
        borderWidth: 6 * resizeFactor + 'px',
      }"
    ></div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from '@nuxtjs/composition-api'
import { Sex } from '~/store/session/user.model'
export default defineComponent({
  props: {
    color: {
      default: '#ffffff',
      type: String,
    },
    size: {
      default: 48,
      type: Number,
    },
    sex: {
      default: Sex.MALE,
      type: String as PropType<Sex>,
    },
  },
  setup(props) {
    const isMale = computed(() => props.sex === Sex.MALE)
    const resizeFactor = computed(() =>
      Math.max(1, Math.round((props.size as number) / 48))
    )
    return {
      isMale,
      resizeFactor,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '~vuetify/src/styles/styles.sass';
.avatar-container {
  position: relative;
  background-color: map-get($grey, 'lighten-4');
  border-radius: 999px;
  display: inline-block;

  .avatar {
    border-style: solid;
    border-color: $color-primary;
    border-radius: 999px;
    overflow: hidden;
  }
  .color-circle {
    border-bottom-right-radius: 999px;
    border-bottom-style: solid;
    border-right-style: solid;
    position: absolute;
    overflow: hidden;
    //box-shadow: 1px 1px 4px 0px rgba(0, 0, 0, 0.33);
  }
  img {
    margin-top: 4px;
  }
}
</style>
