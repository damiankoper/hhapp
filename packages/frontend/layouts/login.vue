<template>
  <v-app>
    <v-main>
      <v-container class="fill-height">
        <nuxt />
      </v-container>
    </v-main>
    <v-footer absolute app>
      <span>Copyright © Damian Koper {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import { computed, useContext } from '@nuxtjs/composition-api'
import Vue from 'vue'

export default Vue.extend({
  auth: 'guest',
  setup() {
    const context = useContext()
    const isBig = computed(() => context.$vuetify.breakpoint.lgAndUp)
    return { isBig }
  },
})
</script>
