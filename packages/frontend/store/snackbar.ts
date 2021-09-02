import { Module, Mutation, VuexModule } from 'vuex-module-decorators'

@Module({
  name: 'snackbar',
  stateFactory: true,
  namespaced: true,
})
export default class Snackbar extends VuexModule {
  text = ''
  visible = false
  timeout = 1500
  type = 'success'

  @Mutation
  setVisible(v: boolean) {
    this.visible = v
  }

  @Mutation
  showSuccess(text: string) {
    this.visible = true
    this.text = text
    this.type = 'success'
  }

  @Mutation
  showError(text: string) {
    this.visible = true
    this.text = text
    this.type = 'error'
  }

  @Mutation
  showWarning(text: string) {
    this.visible = true
    this.text = text
    this.type = 'warning'
  }
}
