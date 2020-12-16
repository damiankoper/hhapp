import { Module, Mutation, VuexModule } from 'vuex-module-decorators'

@Module({
  name: 'navigation',
  stateFactory: true,
  namespaced: true,
})
export default class Navigation extends VuexModule {
  title = 'App'

  @Mutation
  setTitle(title: string) {
    this.title = title
  }
}
