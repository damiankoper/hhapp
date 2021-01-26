<template>
  <v-app>
    <v-main
      style="height: 100vh"
      class="d-flex"
      :class="{ 'align-center': isBig }"
    >
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
    <v-footer absolute app>
      <span>Damian Koper &copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import { computed, useContext } from '@nuxtjs/composition-api'
import Vue from 'vue'

export default Vue.extend({
  middleware: ['auth'],
  setup() {
    const context = useContext()
    const isBig = computed(() => context.$vuetify.breakpoint.lgAndUp)
    return { isBig }
  },
})
</script>

<style lang="scss" scoped>
.main {
  position: absolute;
  top: 0;
  bottom: 0;
}
</style>
