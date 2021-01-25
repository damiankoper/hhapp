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
          @click.stop="item.click"
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
    </v-app-bar>
    <v-main class="main">
      <v-container fluid>
        <nuxt />
      </v-container>
    </v-main>
    <v-footer absolute app>
      <span>Damian Koper &copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import { navigationStore, sessionStore } from '~/store'

export default Vue.extend({
  middleware: ['auth'],
  data() {
    return {
      items: [
        { icon: 'mdi-apps', title: 'Dashboard', to: '/app', click: () => {} },
        {
          icon: 'mdi-account',
          title: 'Users',
          to: '/app/users',
          click: () => {},
        },
        {
          icon: 'mdi-logout',
          title: 'Sign out',
          click: () => {
            sessionStore.logout()
            this.$router.push('/')
          },
        },
      ],
      drawer: true,
      miniVariant: true,
    }
  },
  computed: {
    title(): string {
      return navigationStore.title
    },
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
</style>
