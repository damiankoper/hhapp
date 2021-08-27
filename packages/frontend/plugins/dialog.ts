import { Context } from '@nuxt/types'
import Vue from 'vue'
import VuetifyConfirm from 'vuetify-confirm'

export default ({ app }: Context) => {
  Vue.use(VuetifyConfirm, { vuetify: app.vuetify })
}
