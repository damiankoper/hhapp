<template>
  <v-card :loading="loading" :disabled="loading">
    <v-card-text>
      <v-row align="center" style="flex-wrap: nowrap">
        <v-col cols="auto">
          <v-fade-transition leave-absolute tag="span">
            <v-skeleton-loader v-if="!item" type="avatar" width="48" />
            <v-avatar v-else color="primary">
              <v-icon v-if="item.category" color="white" size="2rem">
                {{ item.category.icon }}
              </v-icon>
              <v-icon v-else color="white" size="2rem"> mdi-storefront </v-icon>
            </v-avatar>
          </v-fade-transition>
        </v-col>
        <v-col
          class="flex-grow-1 text-h5 font-weight-bold mb-0"
          style="line-height: 1.375rem; position: relative"
        >
          <template v-if="create"> New item </template>
          <template v-else>
            <v-fade-transition leave-absolute>
              <v-skeleton-loader v-if="!item" type="text" max-width="300" />
              <span v-else>{{ item.name }}</span>
            </v-fade-transition>
          </template>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-form :readonly="readonly">
            <v-row>
              <v-col :cols="12">
                <v-text-field
                  ref="nameInput"
                  v-model="formItem.name"
                  label="Name"
                  prepend-icon="mdi-text"
                  :error-messages="$v.name.$errors.map((e) => e.$message)"
                  @keydown.enter.prevent="submit"
                />
              </v-col>
              <v-col :md="6" :cols="12">
                <v-text-field
                  v-model="formItem.price"
                  label="Unit price"
                  type="number"
                  suffix="PLN"
                  prepend-icon="mdi-cash"
                  :error-messages="$v.price.$errors.map((e) => e.$message)"
                  @keydown.enter.prevent="submit"
                  @focus="
                    (e) => {
                      formItem.price = formItem.price ? formItem.price : 0
                      $nextTick(() => e.target.select())
                    }
                  "
                />
              </v-col>
              <v-col :md="6" :cols="12">
                <v-text-field
                  v-model="formItem.quantity"
                  label="Quantity"
                  type="number"
                  prepend-icon="mdi-numeric"
                  :error-messages="$v.quantity.$errors.map((e) => e.$message)"
                  @keydown.enter.prevent="submit"
                  @focus="
                    (e) => {
                      formItem.quantity = formItem.quantity
                        ? formItem.quantity
                        : 1
                      $nextTick(() => e.target.select())
                    }
                  "
                />
              </v-col>
              <v-col :md="6" :cols="12">
                <v-text-field
                  v-model="formItem.unitDiscount"
                  :label="
                    isDiscountOverall ? 'Overall discount' : 'Unit discount'
                  "
                  type="number"
                  suffix="PLN"
                  prepend-icon="mdi-cash"
                  :error-messages="
                    $v.unitDiscount.$errors.map((e) => e.$message)
                  "
                  @keydown.enter.prevent="submit"
                  @focus="
                    (e) => {
                      formItem.unitDiscount = formItem.unitDiscount
                        ? formItem.unitDiscount
                        : 0
                      $nextTick(() => e.target.select())
                    }
                  "
                />
              </v-col>
              <v-col :md="6" :cols="12">
                <v-switch
                  v-model="isDiscountOverall"
                  label="Overall discount"
                />
              </v-col>
              <v-col :md="6" :cols="12">
                <v-text-field
                  v-model="formItem.date"
                  label="Date"
                  type="date"
                  prepend-icon="mdi-calendar"
                  :error-messages="$v.date.$errors.map((e) => e.$message)"
                  @keydown.enter.prevent="submit"
                  @focus="
                    (e) => {
                      formItem.date = formItem.date ? formItem.date : now()
                    }
                  "
                />
              </v-col>
              <v-col :md="6" :cols="12">
                <v-switch
                  v-model="formItem.shared"
                  label="Shared"
                  @change="
                    () => {
                      if (formItem.shared) formItem.boughtFor = undefined
                    }
                  "
                />
              </v-col>
              <v-col :md="6" :cols="12">
                <v-autocomplete
                  v-model="formItem.shop"
                  prepend-icon="mdi-storefront"
                  label="Shop"
                  cache-items
                  :error-messages="$v.shop.$errors.map((e) => e.$message)"
                  :loading="shopCrudLoading"
                  :items="shopCrudFindManyResult"
                  item-text="name"
                  return-object
                  @focus="(e) => e.target.click()"
                />
              </v-col>
              <v-col :md="6" :cols="12">
                <v-autocomplete
                  v-model="formItem.category"
                  prepend-icon="mdi-inbox-multiple"
                  label="Category"
                  cache-items
                  :error-messages="$v.category.$errors.map((e) => e.$message)"
                  :loading="categoryCrudLoading"
                  :items="categoryCrudFindManyResult"
                  item-text="name"
                  return-object
                  @focus="(e) => e.target.click()"
                >
                  <template #item="{ item }">
                    <v-icon :color="item.color" class="mr-2">
                      {{ item.icon }}
                    </v-icon>
                    {{ item.name }}
                  </template>
                </v-autocomplete>
              </v-col>
              <v-col :md="6" :cols="12">
                <v-autocomplete
                  v-model="formItem.boughtBy"
                  prepend-icon="mdi-account-arrow-right"
                  label="Bought by"
                  cache-items
                  :error-messages="$v.boughtBy.$errors.map((e) => e.$message)"
                  :loading="userCrudLoading"
                  :items="userCrudFindManyResult"
                  :item-text="(o) => `${o.firstname} ${o.surname}`"
                  return-object
                  @focus="(e) => e.target.click()"
                  @change="
                    (e) => {
                      formItem.boughtFor = formItem.boughtFor
                        ? formItem.boughtFor
                        : formItem.boughtBy
                    }
                  "
                />
              </v-col>
              <v-col :md="6" :cols="12">
                <v-autocomplete
                  v-model="formItem.boughtFor"
                  :disabled="formItem.shared"
                  prepend-icon="mdi-account-arrow-left"
                  label="Bought for"
                  cache-items
                  :error-messages="$v.boughtFor.$errors.map((e) => e.$message)"
                  :loading="userCrudLoading"
                  :items="userCrudFindManyResult"
                  :item-text="(o) => `${o.firstname} ${o.surname}`"
                  return-object
                  @focus="(e) => e.target.click()"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn :disabled="readonly" color="primary" @click="submit">
        <template v-if="create"> Create </template>
        <template v-else> Save {{ formItem.shared ? 'shared' : '' }} </template>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import useVuelidate from '@vuelidate/core'
import { required, requiredIf } from '@vuelidate/validators'
import {
  defineComponent,
  onMounted,
  reactive,
  ref,
  toRef,
  useContext,
  watch,
} from '@nuxtjs/composition-api'
import _ from 'lodash'
import { VueComponent } from '@nuxtjs/auth-next'
import { DateTime } from 'luxon'
import { Item } from '~/store/models/item.model'
import { Category } from '~/store/models/category.model'
import { Shop } from '~/store/models/shop.model'
import { User } from '~/store/models/user.model'
import { useCrud } from '~/composables/useCrud'
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
  setup(props, { emit }) {
    const { $auth } = useContext()
    const item = toRef(props, 'value')
    const formItem = reactive<Item>(Object.assign(new Item()))
    watch(item, () => Object.assign(formItem, item.value))

    const nameInput = ref<VueComponent | null>(null)

    const shopCrud = useCrud('shopping/shops', Shop, 'shop')
    const categoryCrud = useCrud('shopping/categories', Category, 'category')
    const userCrud = useCrud('users', User, 'user')
    onMounted(async () => {
      if (props.create && nameInput.value) {
        const el = (nameInput.value as any).$el
        el.querySelector('input')?.focus()
      }
      shopCrud.findMany()
      categoryCrud.findMany()
      await userCrud.findMany()
      formItem.boughtBy = userCrud.findManyResult.value.find(
        (u) => u.id === $auth.user?.id
      )
    })

    const isDiscountOverall = ref(false)
    watch(isDiscountOverall, (n) => {
      if (formItem.unitDiscount && formItem.quantity)
        if (n) formItem.unitDiscount *= formItem.quantity
        else formItem.unitDiscount /= formItem.quantity
    })

    const $v = useVuelidate(
      {
        name: { required },
        price: { required },
        quantity: { required },
        date: { required },
        unitDiscount: { required },
        shop: { required },
        category: { required },
        boughtBy: { required },
        boughtFor: { requiredIf: requiredIf(() => !formItem.shared) },
      },
      formItem
    )
    return {
      $v,
      item,
      formItem,
      nameInput,
      categoryCrudLoading: categoryCrud.loading,
      categoryCrudFindManyResult: categoryCrud.findManyResult,
      shopCrudLoading: shopCrud.loading,
      shopCrudFindManyResult: shopCrud.findManyResult,
      userCrudLoading: userCrud.loading,
      userCrudFindManyResult: userCrud.findManyResult,
      isDiscountOverall,
      now() {
        return DateTime.now().toISODate()
      },
      submit() {
        $v.value.$touch()
        const submitItem = _.cloneDeep(formItem)
        if (!$v.value.$invalid && (submitItem.id || props.create)) {
          if (
            submitItem.unitDiscount &&
            submitItem.quantity &&
            isDiscountOverall.value
          ) {
            submitItem.unitDiscount /= submitItem.quantity
          }
          emit('submit', submitItem)
          isDiscountOverall.value = false
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
