import constants from '@/constants.js'

const apiUrl = constants.apis.gus.url

export default {
  async fetchProfile (state) {
    const { source, spaceId } = state.config

    const response = await fetch(`${apiUrl}/space/${spaceId}/profile/${source}`)
    const data = await response.json()

    return data
  }
}
