<template>
  <v-row dense>
    <v-col cols="6">
      <v-btn :disabled="!showEnabled" icon @click="showOneFn">
        <v-icon>mdi-eye</v-icon>
      </v-btn>
    </v-col>
    <v-col cols="6">
      <v-btn :disabled="!deleteEnabled" icon @click="deleteOneFn">
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { useContext } from '@nuxtjs/composition-api'
export default {
  props: {
    itemId: {
      required: true,
      type: Number,
    },
    deleteOne: {
      required: true,
      type: Function,
    },
    showOne: {
      required: true,
      type: Function,
    },
    reloadDatatable: {
      required: true,
      type: Function,
    },
    showVisible: {
      required: false,
      default: true,
      type: Boolean,
    },
    showEnabled: {
      required: false,
      default: true,
      type: Boolean,
    },
    deleteVisible: {
      required: false,
      default: true,
      type: Boolean,
    },
    deleteEnabled: {
      required: false,
      default: true,
      type: Boolean,
    },
  },
  setup(props: any) {
    const ctx = useContext()

    return {
      showOneFn() {
        ctx.app.router?.push(props.showOne(props.itemId))
      },
      async deleteOneFn() {
        await props.deleteOne(props.itemId)
        await props.reloadDatatable()
      },
    }
  },
}
</script>

<style scoped></style>
