import Storage from '@/helpers/storage.js'

export default class AuthService {
  constructor (rootComponent) {
    this.store = rootComponent.$store
    this.route = rootComponent.$route
    this.component = rootComponent
  }

  getCached () {
    console.log('get cached')

    return new Promise((resolve, reject) => {
      Storage.connect().then((storage) => {
        storage.getItem('auth').then((auth) => {
          if (!auth.user || !auth.idToken || !auth.expiresAt) {
            reject()
            return
          }

          if (Date.now() >= auth.expiresAt) {
            reject()
            return
          }

          resolve({
            user: auth.user,
            spaceId: auth.spaceId,
            auth: {
              idToken: auth.idToken,
              expiresAt: Number.MAX_VALUE
            }
          })
        })
      })
    })
  }

  authenticate () {
    const { store } = this

    // Already logged in
    if (store.state.auth.auth) return true

    // Look for cached token
    return new Promise((resolve, reject) => {
      this.getCached()
        .then((cached) => {
          store.commit('SET_SPACE_ID', cached.spaceId)
          store.commit('auth/SET_AUTH', cached.auth)
          store.commit('auth/SET_USER', cached.user)

          store.dispatch('auth/fetchProfile').then(() => {
            resolve()
          })
        })
        .catch(() => {
          reject()
        })
    })
  }
}
