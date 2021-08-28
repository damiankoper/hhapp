<template>
  <v-card>
    <v-card-title style="flex-wrap: nowrap">
      <Avatar
        :color="model.createdBy.color"
        :sex="model.createdBy.sex"
        class="mr-4"
        :size="48"
        tooltip="right"
      >
        Created by
        <b>
          {{ model.createdBy.firstname }}
          {{ model.createdBy.surname }}
        </b>
      </Avatar>
      <v-text-field
        ref="title"
        v-model="model.name"
        height="1.2em"
        style="font-size: 1.2em; min-width: 0"
        class="pt-0 mt-0 mb-0"
        append-icon="mdi-close"
        hide-details
        :persistent-hint="false"
        @click:append="$emit('delete')"
      >
      </v-text-field>
    </v-card-title>
    <v-card-text class="items">
      <v-slide-y-transition group leave-absolute>
        <v-text-field
          v-for="(item, n) in model.items"
          :key="item.order"
          ref="items"
          v-model="item.text"
          dense
          style="overflow: visible"
          append-icon="mdi-close"
          hide-details
          :persistent-hint="false"
          @click:append="removeItem(n)"
        >
          <template #prepend-inner>
            <v-simple-checkbox v-model="item.checked" color="primary" />
          </template>
        </v-text-field>
        <v-text-field
          key="nodata"
          dense
          class="create-input"
          prepend-inner-icon="mdi-plus"
          readonly
          value="Create item"
          @focus="addItem"
        >
        </v-text-field>
      </v-slide-y-transition>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import {
  defineComponent,
  PropType,
  toRef,
  watch,
  nextTick,
  onMounted,
  ref,
} from '@nuxtjs/composition-api'
import _ from 'lodash'
import Avatar from '../Avatar.vue'
import { ListItem } from '~/store/models/list-item'
import { List } from '~/store/models/list.model'
export default defineComponent({
  components: { Avatar },
  props: {
    list: {
      type: Object as PropType<List>,
      required: true,
    },
  },
  setup(props, { emit, refs }) {
    const list = toRef(props, 'list')
    const model = ref<List>(new List())
    watch(
      list,
      (list) => {
        if (!_.isEqual(list, model.value)) model.value = _.cloneDeep(list)
      },
      {
        immediate: true,
        deep: true,
      }
    )
    watch(
      model,
      (n) => {
        if (!_.isEqual(n, list.value)) {
          emit('update:list', _.cloneDeep(n))
        }
      },
      { deep: true }
    )

    onMounted(() => {
      const title = refs.title as HTMLInputElement
      if (model.value.name.length === 0) title.focus()
    })

    return {
      model,
      addItem: _.debounce(async () => {
        const item = new ListItem()
        item.order = Math.max(0, ...model.value.items.map((i) => i.order)) + 1
        model.value.items.push(item)
        await nextTick()
        const items = refs.items as HTMLInputElement[]
        ;(items[items.length - 1] as HTMLInputElement).focus()
      }, 100),
      removeItem(n: number) {
        model.value.items.splice(n, 1)
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
.items ::v-deep .v-input__slot::before {
  display: none;
}

.items ::v-deep .create-input .v-input__slot::after {
  display: none;
}

.items ::v-deep .v-text-field {
  transition: transform 0.15s;
}
</style>
