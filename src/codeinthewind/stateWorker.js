import { pendingDataToSync, store } from './store'
import { authStateAvailablePromise, auth } from './firebase'
import { signInWithCustomToken } from 'firebase/auth'
import {
  child,
  get,
  getDatabase,
  ref,
  serverTimestamp,
  set,
} from 'firebase/database'

export async function go() {
  await authStateAvailablePromise
  const locationMatch = window.location.hash.match(/auth_token=([^&]+)/)
  if (locationMatch) {
    const token = locationMatch[1]
    await signInWithCustomToken(auth, token)
    window.location.replace(
      window.location.hash.replace(/auth_token=[^&]+/, '_=_')
    )
  }
  if (!auth.currentUser) {
    store.state = {
      state: 'error',
      message: 'You are not authenticated',
      details:
        'Changes will not be saved. Please access Code in the Wind Editor from the link provided to you in Discord.',
    }
    return
  }
  const user = auth.currentUser
  const result = await user.getIdTokenResult()
  const userName = result.claims.name
  store.state = {
    state: 'idle',
    message: `[${userName}] Authenticated`,
  }
  const dbRef = ref(getDatabase())
  const roomRef = child(dbRef, `rooms/citw`)
  const submissionRef = child(roomRef, `publicSubmissions/${user.uid}`)
  const initialData = await get(submissionRef)
  const synchronizeToken = 'meow'
  let currentData = {}
  if (initialData.exists()) {
    const data = initialData.child('data').val()
    currentData = JSON.parse(data)
    store.state = {
      ...store.state,
      state: 'idle',
      message: `[${userName}] Content restored (size=${data.length})`,
      overrideInitialContent: {
        ...(currentData.html ? { html: currentData.html } : {}),
        ...(currentData.css ? { css: currentData.css } : {}),
        ...(currentData.compiledCss
          ? { compiledCss: currentData.compiledCss }
          : {}),
      },
      synchronizeToken,
    }
  } else {
    store.state = {
      ...store.state,
      synchronizeToken,
    }
  }

  for (;;) {
    try {
      const keysToUpdate = Object.keys(pendingDataToSync)
      let changed = 0
      for (const key of keysToUpdate) {
        if (currentData[key] !== pendingDataToSync[key]) {
          currentData[key] = pendingDataToSync[key]
          changed++
        }
        delete pendingDataToSync[key]
      }
      if (changed > 0) {
        const dataToSave = JSON.stringify(currentData)
        await set(submissionRef, {
          data: dataToSave,
          submittedAt: serverTimestamp(),
        })
        const now = new Date()
        const z = (x) => (x < 10 ? '0' + x : x)
        const time =
          now.getHours() + ':' + z(now.getMinutes()) + ':' + z(now.getSeconds())
        store.state = {
          ...store.state,
          state: 'idle',
          message: `[${userName}] Saved at ${time} (size=${dataToSave.length})`,
        }
      }
    } catch (error) {
      console.error(error)
      store.state = {
        ...store.state,
        state: 'error',
        message: `[${userName}] Sync error`,
        details: String(error),
      }
    }
    await new Promise((resolve) => setTimeout(resolve, 3000))
  }
}
