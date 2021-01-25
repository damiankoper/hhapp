import { Store } from 'vuex'
import { getModule } from 'vuex-module-decorators'
import Navigation from '~/store/navigation'
import Session from '~/store/session'

let navigationStore: Navigation
let sessionStore: Session

function initialiseStores(store: Store<any>): void {
  navigationStore = getModule(Navigation, store)
  sessionStore = getModule(Session, store)
}

export { initialiseStores, navigationStore, sessionStore }
