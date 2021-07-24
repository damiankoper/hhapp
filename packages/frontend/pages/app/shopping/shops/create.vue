<template>
  <v-row>
    <v-col cols="12" md="6">
      <shop-form v-model="shop" :loading="loading" create @submit="submit" />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { useContext } from '@nuxtjs/composition-api'
import { navigationStore } from '~/store'
import { useCrud } from '~/composables/useCrud'
import ShopForm from '~/components/shop/ShopForm.vue'
import { Shop } from '~/store/models/shop.model'
const title = 'Shops'

export default {
  components: { ShopForm },
  middleware() {
    navigationStore.setTitle(title)
  },
  setup() {
    const { app } = useContext()
    const shopCrud = useCrud('shopping/shops', Shop, 'shop')
    const shop = new Shop()

    return {
      shop,
      loading: shopCrud.loading,
      async submit(submitShop: Shop) {
        await shopCrud.createOne(submitShop)
        app.router?.push(
          shopCrud.showOne(shopCrud.findOneResult.value?.id || 0)
        )
      },
    }
  },
  head() {
    return {
      title,
    }
  },
}
</script>
