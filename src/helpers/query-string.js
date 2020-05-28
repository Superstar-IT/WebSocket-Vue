export function queryArr (arr, combinator) {
  if (!arr || !arr.length) return undefined

  arr.__combinator = combinator
  return arr
}

export function queryString (obj) {
  for (let key in obj) {
    if (obj[key] === undefined) delete obj[key]
  }

  if (Object.keys(obj).length === 0) return ''

  const values = []

  for (let key in obj) {
    let value = obj[key]

    if (value instanceof Array) {
      value = obj[key].join(value.__combinator)
    }

    values.push(`${key}=${encodeURIComponent(value)}`)
  }

  return '?' + values.join('&')
}

