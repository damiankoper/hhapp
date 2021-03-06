<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      clipped
      fixed
      app
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
          @click.stop="() => (item.click ? item.click() : null)"
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click.stop="miniVariant = !miniVariant">
          <v-list-item-action>
            <v-icon>
              mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}
            </v-icon>
          </v-list-item-action>
          <v-list-item-content>Mini&nbsp;menu</v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar clipped-left fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <Title class="ml-1" :subtitle="title" :size="8" />
      <v-spacer />
      <v-slide-x-transition>
        <v-btn
          v-if="$vuetify.breakpoint.smAndUp && user"
          outlined
          :to="{ path: `/app/users/${user.id}` }"
          class="btn-profile"
        >
          Hello {{ user.firstname }}
          <Avatar
            style="z-index: 1"
            :size="48"
            :color="user.color"
            :sex="user.sex"
            class="ml-2"
          />
        </v-btn>
      </v-slide-x-transition>
    </v-app-bar>
    <v-main class="main">
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
    <Snackbar />
    <v-footer absolute app>
      <span>Copyright © Damian Koper {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import { computed, ref, useContext } from '@nuxtjs/composition-api'
import Vue from 'vue'
import Snackbar from '~/components/Snackbar.vue'
import { navigationStore } from '~/store'
import User from '~/store/session/user.model'

export default Vue.extend({
  components: { Snackbar },
  setup() {
    const ctx = useContext()
    const items = [
      { icon: 'mdi-apps', title: 'Dashboard', to: '/app' },
      {
        icon: 'mdi-account',
        title: 'Users',
        to: '/app/users',
      },
      {
        icon: 'mdi-logout',
        title: 'Sign out',
        click: () => {
          ctx.$auth.logout()
          ctx.app.router?.push('/')
        },
      },
    ]
    const title = computed(() => navigationStore.title)
    const drawer = ref(true)
    const miniVariant = ref(true)
    const user = computed(() => ctx.$auth.user as unknown as User)
    return { title, drawer, miniVariant, items, user }
  },
})
</script>

<style lang="scss" scoped>
.main {
  background-image: url(~assets/bg.jpg);
  background-color: hsla(0, 0%, 100%, 0.9);
  background-blend-mode: screen;
  background-size: cover;
}
.btn-profile::v-deep {
  &.v-btn--active::before {
    opacity: 0.06;
  }
}
</style>
