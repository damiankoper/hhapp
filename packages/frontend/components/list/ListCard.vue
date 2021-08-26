<template>
  <v-card>
    <v-card-title>
      <v-text-field
        ref="title"
        v-model="model.name"
        height="1.2em"
        style="font-size: 1.2em"
        class="pt-0 mt-0 mb-0"
        :error-messages="$v.name.$errors.map((e) => e.$message)"
        append-icon="mdi-close"
        hide-details
        :persistent-hint="false"
        @click:append="() => {}"
      />
    </v-card-title>
    <v-card-text>
      <v-text-field
        v-for="(item, n) in model.items"
        :key="n"
        ref="items"
        v-model="item.text"
        dense
        style="overflow: visible"
        append-icon="mdi-close"
        :error-messages="
          $v.items.$each.$response.$errors[n].text.map((e) => e.$message)
        "
        hide-details
        :persistent-hint="false"
        @click:append="removeItem(n)"
      >
        <template #prepend-inner>
          <v-simple-checkbox v-model="item.checked" color="primary" />
        </template>
      </v-text-field>
      <div class="create-input">
        <v-text-field
          dense
          prepend-inner-icon="mdi-plus"
          readonly
          value="Create item"
          @focus="addItem"
        >
        </v-text-field>
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import {
  defineComponent,
  PropType,
  reactive,
  toRef,
  watch,
  nextTick,
} from '@nuxtjs/composition-api'
import useVuelidate from '@vuelidate/core'
import { helpers, required } from '@vuelidate/validators'
import _ from 'lodash'
import { ListItem } from '~/store/models/list-item'
import { List } from '~/store/models/list.model'
export default defineComponent({
  props: {
    list: {
      type: Object as PropType<List>,
      required: true,
    },
  },
  setup(props, { emit, refs }) {
    const list = toRef(props, 'list')
    const model = reactive<List>(new List())
    watch(list, () => _.merge(model, props.list))
    watch(
      model,
      _.debounce((n, o) => {
        $v.value.$touch()
        if (!_.isEqual(n, o)) emit('update:list', model)
      }, 500),
      { deep: true }
    )

    const $v = useVuelidate(
      {
        name: { required },
        items: {
          $each: helpers.forEach({
            id: {},
            text: { required },
            checked: {},
            list: {},
          }) as any,
        },
      },
      model as any
    )

    return {
      model,
      $v,
      async addItem() {
        model.items.push(new ListItem())
        await nextTick()
        const items = refs.items as HTMLInputElement[]
        ;(items[items.length - 1] as HTMLInputElement).focus()
      },
      removeItem(n: number) {
        model.items.splice(n, 1)
      },
    }
  },
})
</script>

<style lang="scss" scoped>
.create-input ::v-deep {
  .v-input__slot,
  input {
    cursor: pointer !important;
  }
}
</style>
