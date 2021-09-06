<template>
  <v-row no-gutters justify="center" class="mt-4">
    <v-col cols="auto">
      <v-img src="/box.svg" aspect-ratio="1" max-width="100" />
    </v-col>
    <v-col cols="12" class="text-center">
      <div class="text-h4">{{ title }}</div>
      <div class="text-subtitle-1">Try elsewhere.</div>
    </v-col>
  </v-row>
</template>

<script>
import { navigationStore } from '~/store'
export default {
  layout: 'empty',
  middleware() {
    navigationStore.setTitle('error')
  },
  props: {
    error: {
      type: Object,
      default: null,
    },
  },
  setup(props) {
    const text = {
      pageNotFound: '404 Not Found',
      otherError: 'An error occurred',
    }
    return {
      title:
        props.error.statusCode === 404 ? text.pageNotFound : text.otherError,
      ...text,
    }
  },
  head() {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    return {
      title,
    }
  },
}
</script>

<style scoped>
h1 {
  font-size: 20px;
}
</style>
