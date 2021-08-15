<template>
  <v-card :loading="loading" :disabled="loading">
    <v-card-title>
      Items
      <b class="mx-1">&#183;</b>
      {{ currency(sum(items)) }}
    </v-card-title>
    <v-list>
      <template v-for="(itemsShop, id, n) in byShop">
        <v-divider v-if="n > 0" :key="id + 'd'" />
        <v-subheader :key="id">
          {{ itemsShop[0].shop.name }}
          <b class="mx-1">&#183;</b>
          {{ isoDate(itemsShop[0].date) }}
          <b class="mx-1">&#183;</b>
          {{ currency(sum(itemsShop)) }}
        </v-subheader>
        <template v-for="item in itemsShop">
          <v-list-item
            :key="item.id"
            :class="{ 'grey lighten-4 elevation-8': item.id === current.id }"
            three-line
            class="tr"
            @click="$emit('click', item)"
          >
            <v-list-item-avatar
              style="overflow: visible"
              :color="item.category.color"
            >
              <v-icon v-if="item.category" color="white" size="1.75rem">
                {{ item.category.icon }}
              </v-icon>
              <v-tooltip v-if="item.shared" bottom>
                <template #activator="{ on, attrs }">
                  <v-sheet
                    elevation="1"
                    rounded="circle"
                    v-bind="attrs"
                    color="white"
                    class="white"
                    style="
                      position: absolute;
                      bottom: 0;
                      right: 0;
                      font-size: 0px;
                      transform: translate(12.5%, 12.5%);
                    "
                    v-on="on"
                  >
                    <v-icon color="primary" small> mdi-home-heart </v-icon>
                  </v-sheet>
                </template>
                <span> Shared </span>
              </v-tooltip>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>
                {{ item.name }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ currency(item.price) }} x {{ item.quantity }}

                <b class="mx-1">&#183;</b>
                -{{ currency(item.unitDiscount) }}
                <b class="mx-1">&#183;</b>

                <b>
                  {{
                    currency((item.price - item.unitDiscount) * item.quantity)
                  }}
                </b>

                <br />

                <v-icon x-small>mdi-account-arrow-right</v-icon>
                <v-icon
                  v-if="
                    item.boughtFor && item.boughtBy.id === item.boughtFor.id
                  "
                  x-small
                >
                  mdi-account-arrow-left
                </v-icon>
                {{ item.boughtBy.firstname }}
                {{ item.boughtBy.surname }}
                <template
                  v-if="
                    item.boughtFor && item.boughtBy.id !== item.boughtFor.id
                  "
                >
                  <b class="mx-1">&#183;</b>
                  <v-icon x-small>mdi-account-arrow-left</v-icon>
                  {{ item.boughtFor.firstname }}
                  {{ item.boughtFor.surname }}
                </template>
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn icon @click="$emit('delete', item)">
                <v-icon> mdi-delete </v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </template>
      </template>
      <v-list-item v-if="!items.length">
        <v-list-item-content>
          <v-list-item-title class="text-center">
            Create item to see summary of submited items.
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-card-actions> </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from '@nuxtjs/composition-api'
import _ from 'lodash'
import { useFilters } from '~/composables/useFilters'
import { Item } from '~/store/models/item.model'
export default defineComponent({
  props: {
    items: {
      required: false,
      default: () => [],
      type: Array as PropType<Item[]>,
    },
    current: {
      default: () => new Item(),
      type: Object as PropType<Item>,
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
  emits: ['click', 'delete'],
  setup(props) {
    return {
      ...useFilters(),
      sum(items: Required<Item>[]) {
        return items.reduce(
          (a, item) => a + (item.price - item.unitDiscount) * item.quantity,
          0
        )
      },
      byShop: computed(() => _.groupBy(props.items, 'shop.id')),
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
.tr {
  transition: box-shadow 0.3s, background-color 0.3s;
}
</style>
