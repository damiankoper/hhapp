<template>
  <v-row justify="center" align="center">
    <v-col lg="6" cols="12" class="col-left">
      <Title class="title" :subtitle="titles[titleNum]" :size="titleSize" />
    </v-col>
    <v-col lg="6" md="8" sm="8" cols="12">
      <v-card>
        <v-card-title>Sign in</v-card-title>
        <v-card-text>
          <v-text-field label="Username" prepend-icon="mdi-account" />
          <v-text-field
            label="Password"
            type="password"
            prepend-icon="mdi-lock"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary">Sign in</v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { onBeforeUnmount, onMounted, ref } from '@vue/composition-api'
import Vue from 'vue'
export default Vue.extend({
  layout: 'sign',
  computed: {
    titleSize(): number {
      switch (true) {
        case this.$vuetify.breakpoint.mdAndUp:
          return 18
        default:
          return 12
      }
    },
  },
  head() {
    return {
      title: 'Welcome',
    }
  },
  setup(_props, _ctx) {
    const titles = [
      'app',
      'shopping',
      'watering',
      'lists',
      'relations',
      'love',
      'living',
    ]
    const titleNum = ref(0)
    let interval: NodeJS.Timeout
    onMounted(
      () =>
        (interval = setInterval(() => {
          titleNum.value = (titleNum.value + 1) % titles.length
        }, 3000))
    )
    onBeforeUnmount(() => {
      clearInterval(interval)
    })

    return { titles, titleNum }
  },
})
</script>
<style lang="scss" scoped>
.col-left {
  display: flex;
  align-items: center;
}
</style>
