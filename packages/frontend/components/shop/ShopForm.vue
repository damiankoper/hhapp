<template>
  <v-card :loading="loading" :disabled="loading">
    <v-card-text>
      <v-row align="center">
        <v-col cols="auto">
          <v-fade-transition leave-absolute tag="span">
            <v-skeleton-loader v-if="!shop" type="avatar" width="48" />
            <v-avatar v-else color="primary">
              <v-icon color="white" size="210%"> mdi-storefront</v-icon>
            </v-avatar>
          </v-fade-transition>
        </v-col>
        <v-col
          cols="auto"
          class="flex-grow-1 text-h5 font-weight-bold mb-0"
          style="line-height: 1.375rem; position: relative"
        >
          <template v-if="create"> New shop </template>
          <template v-else>
            <v-fade-transition leave-absolute>
              <v-skeleton-loader v-if="!shop" type="text" max-width="300" />
              <span v-else>{{ shop.name }}</span>
            </v-fade-transition>
          </template>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-form :readonly="readonly">
            <v-text-field
              v-model="formShop.name"
              label="Name"
              prepend-icon="mdi-text"
              :error-messages="$v.name.$errors.map((e) => e.$message)"
              @keydown.enter.prevent="submit"
            />
          </v-form>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn :disabled="readonly" color="primary" @click="submit">
        <template v-if="create"> Create </template>
        <template v-else> Save </template>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import {
  defineComponent,
  reactive,
  toRef,
  watch,
} from '@nuxtjs/composition-api'
import _ from 'lodash'
import { Shop } from '~/store/models/shop.model'
export default defineComponent({
  props: {
    value: {
      required: false,
      default: undefined,
      type: Object,
    },
    readonly: {
      required: false,
      default: false,
      type: Boolean,
    },
    loading: {
      required: false,
      default: false,
      type: Boolean,
    },
    create: {
      required: false,
      default: false,
      type: Boolean,
    },
  },
  setup(props: any, { emit }) {
    const shop = toRef(props, 'value')
    const formShop = reactive<Shop>(Object.assign(new Shop()))
    watch(shop, () => Object.assign(formShop, shop.value))

    const $v = useVuelidate(
      {
        name: { required },
      },
      formShop
    )
    return {
      $v,
      shop,
      formShop,
      submit() {
        $v.value.$touch()
        const submitShop = _.cloneDeep(formShop)
        if (!$v.value.$invalid && (submitShop.id || props.create)) {
          emit('submit', submitShop)
          $v.value.$reset()
        }
      },
    }
  },
})
</script>

<style scoped lang="scss">
.v-skeleton-loader {
  ::v-deep .v-skeleton-loader__text {
    height: 1.5rem;
    border-radius: 0.75rem;
    margin-bottom: 0;
  }
}
</style>
