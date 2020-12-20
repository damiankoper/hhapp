<template>
  <v-app>
    <v-main
      style="height: 100vh"
      class="d-flex"
      :class="{ 'align-center': big }"
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
import Vue from 'vue'

export default Vue.extend({
  computed: {
    big(): boolean {
      return this.$vuetify.breakpoint.lgAndUp
    },
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
