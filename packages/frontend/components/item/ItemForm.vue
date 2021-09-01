<template>
  <v-card :loading="loading" :disabled="loading">
    <v-card-text>
      <v-row align="center" style="flex-wrap: nowrap">
        <v-col cols="auto">
          <v-fade-transition leave-absolute tag="span">
            <v-skeleton-loader v-if="!item" type="avatar" width="48" />
            <v-avatar
              v-else
              :color="item.category ? item.category.color : 'primary'"
            >
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
          <v-fade-transition leave-absolute>
            <span v-if="create">New item</span>
            <template v-else>
              <v-fade-transition leave-absolute>
                <v-skeleton-loader v-if="!item" type="text" max-width="300" />
                <span v-else style="width: 100%">{{ item.name }}</span>
              </v-fade-transition>
            </template>
          </v-fade-transition>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-form :readonly="readonly">
            <v-row>
              <v-col :cols="12">
                <v-combobox
                  ref="nameInput"
                  v-model="formItem.name"
                  label="Name"
                  prepend-icon="mdi-text"
                  :error-messages="$v.name.$errors.map((e) => e.$message)"
                  :search-input.sync="nameSearch"
                  :items="nameSearchResult"
                  :loading="nameSearchLoading"
                  item-text="name"
                  no-filter
                  @change="onAutocomplete"
                >
                  <template #item="{ item }">
                    <v-list-item-avatar :color="item.category.color">
                      <v-icon color="white" size="1.75rem">
                        {{ item.category.icon }}
                      </v-icon>
                    </v-list-item-avatar>
                    {{ item.name }}
                    <span class="grey--text">
                      <b class="mx-1">&#183;</b>
                      {{ item.shop.name }}
                      <b class="mx-1">&#183;</b>
                      {{ currency(item.price) }}
                      <b class="mx-1">&#183;</b>
                      {{ isoDate(item.date) }}
                    </span>
                  </template>
                </v-combobox>
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
                  ref="quantityInput"
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
                      if (formItem.shared) formItem.boughtFor = null
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
                      formItem.boughtFor = formItem.shared
                        ? null
                        : formItem.boughtFor
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
import { useVuelidate } from '@vuelidate/core'
import { required, requiredIf } from '@vuelidate/validators'
import {
  defineComponent,
  onMounted,
  reactive,
  Ref,
  ref,
  toRef,
  useContext,
  watch,
} from '@nuxtjs/composition-api'
import _ from 'lodash'
import { VueComponent } from '@nuxtjs/auth-next'
import { DateTime } from 'luxon'
import { plainToClass } from 'class-transformer'
import { Item } from '~/store/models/item.model'
import { Category } from '~/store/models/category.model'
import { Shop } from '~/store/models/shop.model'
import { User } from '~/store/models/user.model'
import { useCrud } from '~/composables/useCrud'
import { useFilters } from '~/composables/useFilters'
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
    const { $auth, $axios } = useContext()
    const item = toRef(props, 'value')
    const formItem = reactive<Item>(Object.assign(new Item()))
    watch(item, () => {
      Object.assign(formItem, item.value)
      focusName()
    })

    const nameInput = ref<VueComponent | null>(null)
    const quantityInput = ref<VueComponent | null>(null)
    const nameSearch = ref('')
    const nameSearchResult = ref<Item[]>([]) as Ref<Item[]>
    const nameSearchLoading = ref(false)
    async function nameSearchFn() {
      const names = nameSearchResult.value.map((n) => n.name)
      if (
        props.create &&
        nameSearch.value &&
        !names.includes(nameSearch.value)
      ) {
        nameSearchLoading.value = true
        try {
          const result = await $axios.get('/shopping/items/autocomplete', {
            params: {
              name: nameSearch.value,
              shopId: formItem.shop?.id,
            },
          })
          nameSearchResult.value = plainToClass(Item, result.data as Item[])
        } catch (e) {}
        nameSearchLoading.value = false
      }
    }
    watch(nameSearch, _.debounce(nameSearchFn, 500))

    const shopCrud = useCrud('shopping/shops', Shop, 'shop')
    const categoryCrud = useCrud('shopping/categories', Category, 'category')
    const userCrud = useCrud('users', User, 'user')

    function focusName() {
      if (props.create && nameInput.value) {
        const el = (nameInput.value as any).$el
        el.querySelector('input')?.focus()
      }
    }
    onMounted(async () => {
      focusName()
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
      ...useFilters(),
      item,
      formItem,
      nameInput,
      quantityInput,
      nameSearch,
      nameSearchResult,
      nameSearchLoading,
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
      onAutocomplete(data: string | Item) {
        if (!_.isString(data)) {
          Object.assign(formItem, _.omit(data, 'id', 'date', 'quantity'))
          formItem.date = formItem.date
            ? formItem.date
            : DateTime.now().toISODate()
          if (quantityInput.value) {
            const el = (quantityInput.value as any).$el
            el.querySelector('input')?.focus()
          }
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
