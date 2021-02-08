<template>
  <v-menu v-model="visible" :close-on-content-click="false">
    <template v-slot:activator="{ on, attrs }">
      <slot :on="on" v-bind="attrs" name="activator" />
    </template>
    <v-card>
      <v-card-text>
        <v-color-picker
          v-model="inputColor"
          flat
          hide-inputs
          hide-mode-switch
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="cancel"> Cancel </v-btn>
        <v-btn text color="primary" @click="submit"> Save </v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script lang="ts">
import { ref, toRefs, watch } from '@nuxtjs/composition-api'
import Vue, { PropOptions } from 'vue'
export default Vue.extend({
  props: {
    value: {
      required: true,
      type: String,
    } as PropOptions<string>,
  },
  setup(props: any, { emit }) {
    props = toRefs(props)
    const inputColor = ref<string>(props.value)
    const visible = ref(false)

    watch(props.value, () => (inputColor.value = props.value.value))
    return {
      inputColor,
      visible,
      cancel() {
        visible.value = false
        inputColor.value = props.value
      },
      submit() {
        visible.value = false
        emit('input', inputColor)
      },
    }
  },
})
</script>

<style scoped></style>
