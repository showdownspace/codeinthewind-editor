import { SyncExternalStore } from 'sync-external-store'
import { useSyncExternalStore } from 'use-sync-external-store/shim'

export const store = new SyncExternalStore({
  state: 'idle',
  message: 'Connecting to real-time servers...',
  details: '',
  synchronizeToken: null,
  overrideInitialContent: null,
})

export const pendingDataToSync = {}

export function useCodeInTheWindStore() {
  return useSyncExternalStore(store.subscribe, store.getSnapshot)
}

export function synchronizeToBackend(synchronizeToken, dataToSync) {
  if (!store.state.synchronizeToken) {
    return
  }
  if (synchronizeToken === store.state.synchronizeToken) {
    Object.assign(pendingDataToSync, dataToSync)
  }
}
