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
          <v-list-item :key="item.id" three-line @click="$emit('click', item)">
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
                    <v-icon small> mdi-home-heart </v-icon>
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
                <v-icon v-if="item.boughtBy.id === item.boughtFor.id" x-small>
                  mdi-account-arrow-left
                </v-icon>
                {{ item.boughtBy.firstname }}
                {{ item.boughtBy.surname }}
                <template v-if="item.boughtBy.id !== item.boughtFor.id">
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
      default: () => [
        {
          id: 4,
          name: 'Bardzo długa nazwa produktu heheh hehehe heheh',
          price: '120.00',
          quantity: '1',
          unitDiscount: '0',
          date: '2021-07-25T00:00:00.000Z',
          shared: false,
          category: {
            id: 2,
            name: 'Domestic items and detergents',
            icon: 'mdi-spray-bottle',
            color: '#555BDA',
            sharedByDefault: true,
          },
          shop: { id: 5, name: 'Frog Shop' },
          boughtBy: {
            id: 1,
            firstname: 'Damian',
            surname: 'Koper',
            username: 'damiankoper',
            color: '#bada55',
            sex: 'MALE',
          },
          boughtFor: {
            id: 1,
            firstname: 'Damian',
            surname: 'Koper',
            username: 'damiankoper',
            color: '#bada55',
            sex: 'MALE',
          },
        },
        {
          id: 2,
          name: 'Bułka hajzerka',
          price: '0.69',
          quantity: '2137',
          unitDiscount: '0.3',
          date: '2021-07-23T00:00:00.000Z',
          shared: true,
          category: {
            id: 1,
            name: 'Groceries',
            icon: 'mdi-food-apple',
            color: '#FF2474',
            sharedByDefault: true,
          },
          shop: { id: 5, name: 'Frog Shop' },
          boughtBy: {
            id: 1,
            firstname: 'Damian',
            surname: 'Koper',
            username: 'damiankoper',
            color: '#bada55',
            sex: 'MALE',
          },
          boughtFor: {
            id: 1,
            firstname: 'Damian',
            surname: 'Koper',
            username: 'damiankoper',
            color: '#bada55',
            sex: 'MALE',
          },
        },
      ],
      type: Array as PropType<Item[]>,
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
      // TODO: Group by shop -> date
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
</style>
