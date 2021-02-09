import { Store } from 'vuex'
import { getModule } from 'vuex-module-decorators'
import Navigation from '~/store/navigation'
import Session from '~/store/session'
import Snackbar from '~/store/snackbar'

let navigationStore: Navigation
let sessionStore: Session
let snackbarStore: Snackbar

function initialiseStores(store: Store<any>): void {
  navigationStore = getModule(Navigation, store)
  sessionStore = getModule(Session, store)
  snackbarStore = getModule(Snackbar, store)
}

export { initialiseStores, navigationStore, sessionStore, snackbarStore }
