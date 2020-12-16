import { Store } from 'vuex'
import { getModule } from 'vuex-module-decorators'
import Navigation from '~/store/navigation'

let navigationStore: Navigation

function initialiseStores(store: Store<any>): void {
  navigationStore = getModule(Navigation, store)
}

export { initialiseStores, navigationStore }
