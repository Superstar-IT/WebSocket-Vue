import localforage from 'localforage'

class Storage {
  constructor () {
    localforage.setDriver([ localforage.INDEXEDDB, localforage.LOCALSTORAGE ])
  }

  connect () {
    return new Promise((resolve, reject) => {
      localforage.getItem('version').then((curVersion) => {
        const version = 1

        if (version !== curVersion) {
          this.init(version)
          .then(() => {
            resolve(this)
          })
          .catch(() => {
            reject()
          })
        } else {
          resolve(this)
        }
      })
    })
  }

  init (version) {
    const promises = []

    promises.push(localforage.setItem('auth', {
      user: '',
      spaceId: '',
      idToken: '',
      expiresAt: ''
    }))

    promises.push(localforage.setItem('signin', {
      spaceId: '',
      username: ''
    }))

    promises.push(localforage.setItem('version', version))

    return Promise.all(promises)
  }

  getItem (key) {
    return localforage.getItem(key)
  }

  setItem (key, value) {
    return localforage.setItem(key, value)
  }
}

export default new Storage()
