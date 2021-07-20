<template>
  <v-card :loading="loading">
    <v-card-text>
      <v-row align="center">
        <v-col cols="auto">
          <v-fade-transition leave-absolute tag="span">
            <v-skeleton-loader v-if="!category" type="avatar" width="48" />
            <v-avatar v-else :color="category.color">
              <v-icon color="white" size="210%"> {{ category.icon }} </v-icon>
            </v-avatar>
          </v-fade-transition>
        </v-col>
        <v-col cols="auto">
          <template v-if="create"> <h1>New category</h1> </template>
          <template v-else>
            <v-fade-transition leave-absolute>
              <v-skeleton-loader v-if="!category" key="1" type="text" />
              <h1 v-else key="3">{{ category.name }}</h1>
            </v-fade-transition>
          </template>
          <color-picker v-model="formCategory.color" :readonly="readonly">
            <template #activator="{ on, attrs }">
              <v-btn x-small text class="mt-1 ml-n2" v-bind="attrs" v-on="on">
                <v-row dense align="center">
                  <v-col cols="auto">
                    <div
                      :style="{
                        backgroundColor: formCategory.color,
                        width: 16 + 'px',
                        height: 16 + 'px',
                        borderRadius: 4 + 'px',
                      }"
                    ></div>
                  </v-col>
                  <v-col> Pick color </v-col>
                </v-row>
              </v-btn>
            </template>
          </color-picker>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-form :readonly="readonly">
            <v-text-field
              v-model="formCategory.name"
              label="Name"
              prepend-icon="mdi-text"
              :error-messages="$v.name.$errors.map((e) => e.$message)"
              @keydown.enter="submit"
            />
            <v-text-field
              v-model="formCategory.icon"
              label="Icon"
              :prepend-icon="formCategory.icon"
              :error-messages="$v.icon.$errors.map((e) => e.$message)"
              @keydown.enter="submit"
            />
            <v-checkbox
              v-model="formCategory.sharedByDefault"
              label="Shared by default"
              prepend-icon="mdi-cash-refund"
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
import ColorPicker from '../ColorPicker.vue'
import { Category } from '~/store/models/category.model'
export default defineComponent({
  components: { ColorPicker },
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
    const category = toRef(props, 'value')
    const formCategory = reactive<Category>(Object.assign(new Category()))
    watch(category, () => Object.assign(formCategory, category.value))

    const $v = useVuelidate(
      {
        name: { required },
        icon: { required },
      },
      formCategory
    )
    return {
      $v,
      category,
      formCategory,
      submit() {
        $v.value.$touch()
        const submitCategory = _.cloneDeep(formCategory)
        if (!$v.value.$invalid && (submitCategory.id || props.create)) {
          emit('submit', submitCategory)
          $v.value.$reset()
        }
      },
    }
  },
})
</script>

<style scoped></style>
