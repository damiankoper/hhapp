<template>
  <v-row>
    <v-col cols="12" md="6">
      <shop-form v-model="user" :loading="loading" @submit="submit" />
    </v-col>

    <v-col cols="12" md="6">
      <v-card class="mb-6">
        <v-card-text class="text-center">
          <v-icon size="120px" color="primary lighten-2">
            mdi-home-lightbulb-outline
          </v-icon>
          <br />
          <span class="text-h4">Card placeholder</span>
        </v-card-text>
      </v-card>
      <v-card>
        <v-card-text class="text-center">
          <v-icon size="120px" color="primary lighten-2">
            mdi-home-heart
          </v-icon>
          <br />
          <span class="text-h4">Card placeholder</span>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { useContext } from '@nuxtjs/composition-api'
import { navigationStore, snackbarStore } from '~/store'
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
    const ctx = useContext()
    const shopCrud = useCrud(
      'shopping/shops',
      Shop,
      'shop',
      snackbarStore.showSuccess,
      snackbarStore.showError
    )
    const user = shopCrud.findOneResult

    shopCrud.findOne(+ctx.route.value.params.id)

    return {
      user,
      loading: shopCrud.loading,
      async submit(submitShop: Shop) {
        if (submitShop.id) {
          await shopCrud.updateOne(submitShop.id, submitShop)
        }
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
