export default {
  install (Vue) {
    Vue.__broadcastEventTarget = document.createDocumentFragment()

    Vue.mixin({
      created () {
        this.__handlers = {}

        const prototype = Object.getPrototypeOf(this.$options)
        if (!prototype.on) return

        Object.keys(prototype.on).forEach(methodName => {
          const handler = prototype.on[methodName].bind(this)

          Vue.__broadcastEventTarget.addEventListener(methodName, handler)
          this.__handlers[methodName] = handler
        })
      },

      beforeDestroy () {
        const prototype = Object.getPrototypeOf(this.$options)
        if (!prototype.on) return

        Object.keys(prototype.on).forEach(methodName => {
          const handler = this.__handlers[methodName]

          Vue.__broadcastEventTarget.removeEventListener(methodName, handler)
          delete this.__handlers[methodName]
        })
      }
    })

    Vue.prototype.$emitGlobal = function (eventName, payload) {
      const event = new CustomEvent(eventName, { detail: payload })
      Vue.__broadcastEventTarget.dispatchEvent(event)
    }
  }
}
