import StackTrace from 'stacktrace-js'
import grandcentral from '@/api/grandcentral.js'

function hasError (res) {
  return res.error ||
    (
      (res.status || res.statusCode) &&
      (!res.status.toString().startsWith('2') || !res.statusCode.toString().startsWith('2'))
    )
}

function logError (state, err) {
  StackTrace.get()
  .then((frames) => {
    const stack = frames.splice(1)
    if (process.env.NODE_ENV === 'production') {
      grandcentral.logBug(state, {
        apiError: true, stack
      })
    } else {
      console.warn('API Error:', stack)
    }
  })
  .catch((stErr) => {
    console.warn(stErr)
  })

  return { error: err }
}

export {
  hasError,
  logError
}
