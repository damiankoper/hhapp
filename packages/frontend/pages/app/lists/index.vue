<template>
  <div style="position: relative" class="pt-8 mt-8">
    <v-btn color="primary" absolute top right fab @click="addList">
      <v-icon>mdi-plus</v-icon>
    </v-btn>
    <v-btn
      color="primary"
      small
      absolute
      top
      right
      fab
      :loading="syncStatus === Status.SYNCING"
      style="margin-right: 72px"
    >
      <v-icon>{{ syncIcon }}</v-icon>
    </v-btn>
    <v-row>
      <v-col
        v-for="(list, n) in localData"
        :key="list.id || n"
        :cols="12"
        :md="6"
      >
        <list-card :list="list" @update:list="(list) => updateList(list, n)" />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  ref,
  useContext,
} from '@nuxtjs/composition-api'
import Vue from 'vue'
import ListCard from '~/components/list/ListCard.vue'
import { useCrud } from '~/composables/useCrud'
import { navigationStore } from '~/store'
import { List } from '~/store/models/list.model'
import { User } from '~/store/models/user.model'
enum Status {
  SYNCED,
  QUEUED,
  SYNCING,
}

export default defineComponent({
  components: { ListCard },
  middleware() {
    navigationStore.setTitle('lists')
  },
  setup() {
    const { $auth } = useContext()
    const syncStatus = ref<Status>(Status.SYNCED)
    const syncIcon = computed(() => {
      switch (syncStatus.value) {
        case Status.SYNCED:
          return 'mdi-cloud-check'
        case Status.QUEUED:
          return 'mdi-cloud-alert'
        case Status.SYNCING:
          return 'mdi-cloud-sync'
      }
    })
    const localData = ref<List[]>([new List()])

    const { loading, findManyResult, findMany } = useCrud(
      '/lists',
      List,
      'list'
    )

    onMounted(() => {
      findMany((qb) => {
        qb.sortBy(['createdAt', 'DESC'])
      })
    })

    return {
      Status,
      syncStatus,
      syncIcon,
      localData,
      addList() {
        const list = new List()
        list.createdBy = $auth.user as unknown as User
        localData.value.push(new List())
      },
      updateList(list: List, n: number) {
        Vue.set(localData.value, n, list)
      },
    }
  },
})
</script>

<style lang="scss" scoped></style>
