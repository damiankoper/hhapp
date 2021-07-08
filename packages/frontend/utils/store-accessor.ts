import { Store } from 'vuex'
import { getModule } from 'vuex-module-decorators'
import Navigation from '~/store/navigation'
import Snackbar from '~/store/snackbar'

let navigationStore: Navigation
let snackbarStore: Snackbar

function initialiseStores(store: Store<any>): void {
  navigationStore = getModule(Navigation, store)
  snackbarStore = getModule(Snackbar, store)
}

export { initialiseStores, navigationStore, snackbarStore }
