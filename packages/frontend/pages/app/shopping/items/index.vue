<template>
  <v-sheet style="position: relative" class="pt-8 mt-8">
    <v-data-table
      :headers="headers"
      :items="items"
      :options.sync="options"
      :loading="loading"
      :server-items-length="serverItemsLength"
      :footer-props="{
        'items-per-page-options': [10, 50, 100, 500],
      }"
      @dblclick:row="(e, { item }) => $router.push(itemCrud.showOne(item.id))"
    >
      <!-- TODO: Ellpisis -->
      <template #[`item.category.icon`]="{ item }">
        <v-btn icon :to="categoryCrud.showOne(item.category.id)">
          <v-avatar :color="item.category.color" :size="32">
            <v-icon color="white">{{ item.category.icon }}</v-icon>
          </v-avatar>
        </v-btn>
      </template>
      <template #[`item.price`]="{ item }">
        {{ currency(item.price) }}
      </template>
      <template #[`item.quantity`]="{ item }">
        {{ number(item.quantity) }}
      </template>
      <template #[`item.unitDiscount`]="{ item }">
        <template v-if="item.unitDiscount > 0">
          {{ currency(item.unitDiscount) }}
        </template>
        <template v-else> --- </template>
      </template>
      <template #[`item.total`]="{ item }">
        {{ currency((item.price - item.unitDiscount) * item.quantity) }}
      </template>
      <template #[`item.shared`]="{ item }">
        <v-simple-checkbox :value="item.shared" />
      </template>
      <template #[`item.shop.name`]="{ item }">
        <v-btn icon x-small nuxt :to="shopCrud.showOne(item.shop.id)">
          <v-icon>mdi-open-in-new</v-icon>
        </v-btn>
        {{ item.shop.name }}
      </template>
      <template #[`item.bought`]="{ item }">
        <v-btn
          title="Bought by"
          icon
          x-small
          nuxt
          :to="userCrud.showOne(item.boughtBy.id)"
        >
          <v-icon>mdi-account-arrow-right</v-icon>
        </v-btn>
        {{ item.boughtBy.firstname }}
        {{ item.boughtBy.surname }}
        <br />
        <template v-if="item.boughtFor">
          <v-btn
            title="Bought for"
            icon
            x-small
            nuxt
            :to="userCrud.showOne(item.boughtFor.id)"
          >
            <v-icon>mdi-account-arrow-left</v-icon>
          </v-btn>
          {{ item.boughtFor.firstname }}
          {{ item.boughtFor.surname }}
        </template>
      </template>
      <template #[`item.date`]="{ item }">
        {{ isoDate(item.date) }}
      </template>
      <template #[`item.actions`]="{ item }">
        <action-buttons
          :item-id="item.id"
          :delete-one="itemCrud.deleteOne"
          :show-one="itemCrud.showOne"
          :reload-datatable="fetch"
        />
      </template>
    </v-data-table>

    <v-btn
      color="primary"
      absolute
      top
      right
      fab
      to="/app/shopping/items/receipt"
    >
      <v-icon>mdi-text-box-plus</v-icon>
    </v-btn>
    <v-btn
      color="primary"
      style="margin-right: 72px"
      absolute
      top
      right
      fab
      :to="createUrl"
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>
    <v-btn
      color="primary lighten-2"
      style="margin-right: 144px"
      small
      absolute
      top
      right
      fab
      :disabled="loading"
      @click="fetch"
    >
      <v-icon>mdi-refresh</v-icon>
    </v-btn>
  </v-sheet>
</template>

<script lang="ts">
import { DataTableHeader } from 'vuetify'
import { RequestQueryBuilder } from '@nestjsx/crud-request'
import { navigationStore } from '~/store'
import { useDatatable } from '~/composables/useDatatable'
import { useFilters } from '~/composables/useFilters'
import ActionButtons from '~/components/datatable/ActionButtons.vue'
import { useCrud } from '~/composables/useCrud'
import { Item } from '~/store/models/item.model'
import { Category } from '~/store/models/category.model'
import { Shop } from '~/store/models/shop.model'
import { User } from '~/store/models/user.model'
const title = 'Shopping items'

export default {
  components: { ActionButtons },
  middleware() {
    navigationStore.setTitle(title)
  },
  setup() {
    function qbFn(qb: RequestQueryBuilder) {
      qb.setJoin([['category'], ['shop'], ['boughtBy'], ['boughtFor']])
      qb.sortBy(['createdAt', 'DESC'])
    }
    const { items, fetch, loading, serverItemsLength, options } = useDatatable(
      Item,
      'shopping/items',
      qbFn
    )
    options.value.sortBy.push('date')
    options.value.sortDesc.push(true)

    const itemCrud = useCrud('shopping/items', Item, 'item')
    const categoryCrud = useCrud('shopping/categories', Category, 'category')
    const shopCrud = useCrud('shopping/shops', Shop, 'shop')
    const userCrud = useCrud('users', User, 'user')

    const headers: DataTableHeader[] = [
      {
        text: '',
        value: 'category.icon',
        width: 1,
        sortable: false,
      },
      {
        text: 'Name',
        value: 'name',
        width: '100%',
        class: 'text-no-wrap',
      },

      {
        text: 'Price',
        value: 'price',
        align: 'end',
        class: 'text-no-wrap',
      },
      {
        text: 'Quantity',
        value: 'quantity',
        align: 'end',
        class: 'text-no-wrap',
      },
      {
        text: 'U. d.',
        value: 'unitDiscount',
        align: 'end',
        class: 'text-no-wrap',
      },
      {
        text: 'Total',
        value: 'total',
        align: 'end',
        sortable: false,
        class: 'text-no-wrap',
      },

      {
        text: 'Shop',
        value: 'shop.name',
        cellClass: 'text-no-wrap',
      },

      {
        text: 'Bought',
        value: 'bought',
        sortable: false,
        cellClass: 'text-no-wrap',
      },
      {
        text: 'Shared',
        value: 'shared',
        align: 'center',
        width: 80,
        sortable: false,
        class: 'text-no-wrap',
      },
      {
        text: 'Date',
        value: 'date',
        width: 110,
        class: 'text-no-wrap',
      },
      {
        text: 'Actions',
        value: 'actions',
        sortable: false,
        width: 100,
        align: 'end',
      },
    ]

    return {
      ...useFilters(),
      items,
      headers,
      itemCrud,
      shopCrud,
      userCrud,
      categoryCrud,
      loading,
      serverItemsLength,
      options,
      fetch,
      createUrl: itemCrud.createUrl,
    }
  },
  head() {
    return {
      title,
    }
  },
}
</script>
