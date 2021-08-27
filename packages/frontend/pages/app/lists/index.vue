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
      :loading="loading"
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
        <list-card
          :list="list"
          @delete="deleteList(list, n)"
          @update:list="(list) => updateList(list, n)"
          @updateQueued="queueUpdate"
        />
      </v-col>
      <v-row
        v-if="localData.length == 0"
        no-gutters
        justify="center"
        class="mt-4"
      >
        <v-col cols="auto">
          <v-img src="/box.svg" aspect-ratio="1" max-width="100" />
        </v-col>
        <v-col cols="12" class="text-center">
          <div class="text-h4">No lists found!</div>
          <div class="text-subtitle-1">Add one using top right button.</div>
        </v-col>
      </v-row>
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
  watch,
} from '@nuxtjs/composition-api'
import Vue from 'vue'
import _ from 'lodash'
import ListCard from '~/components/list/ListCard.vue'
import { useCrud } from '~/composables/useCrud'
import { navigationStore } from '~/store'
import { List } from '~/store/models/list.model'
import { User } from '~/store/models/user.model'
enum Status {
  SYNCED,
  QUEUED,
  SYNCING,
  ERROR,
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
        case Status.ERROR:
          return 'mdi-cloud-question'
      }
    })
    const localData = ref<List[]>([])

    const {
      loading,
      error,
      findManyResult,
      findMany,
      updateOne,
      createOne,
      deleteOne,
    } = useCrud('/lists', List, 'list')

    async function fetchLists() {
      await findMany((qb) => {
        qb.sortBy(['createdAt', 'DESC'])
        qb.setJoin(['createdBy'])
        qb.setJoin(['items'])
      })
    }

    onMounted(() => {
      fetchLists()
    })

    watch(findManyResult, (result: List[]) => {
      localData.value = result
    })

    const updateListsDebounced = _.debounce(async () => {
      for (const list of localData.value) {
        try {
          if (list.id) {
            await updateOne(list.id, list)
          } else {
            await createOne(list)
          }

          await fetchLists()
          syncStatus.value = Status.SYNCED
        } catch (e) {
          syncStatus.value = Status.ERROR
        }
      }
    }, 1000)

    return {
      Status,
      syncStatus,
      syncIcon,
      localData,
      loading,
      queueUpdate() {
        syncStatus.value = Status.QUEUED
      },
      addList() {
        const list = new List()
        list.createdBy = $auth.user as unknown as User
        localData.value.push(list)
      },
      updateList(list: List, n: number) {
        Vue.set(localData.value, n, list)
        updateListsDebounced()
      },
      deleteList(list: List, n: number) {
        localData.value.splice(n, 1)
        if (list.id) deleteOne(list.id)
      },
    }
  },
})
</script>

<style lang="scss" scoped></style>
