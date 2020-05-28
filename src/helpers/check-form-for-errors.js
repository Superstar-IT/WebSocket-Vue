function checkChildren (errors, parent, checkIgnored) {
  parent.$children.forEach(child => {
    if (child.$children) {
      checkChildren(errors, child, checkIgnored)
    }

    if (child.checkForErrors) {
      const childErrors = child.checkForErrors(child, checkIgnored)
      if (childErrors) {
        errors[childErrors.name] = childErrors.errors
      }
    }
  })
}

function indexInParent (node, parent) {
  const children = parent.querySelectorAll('input, textarea, select')

  let index = -1

  children.forEach((child, i) => {
    if (child === node) index = i
  })

  return index
}

export default function checkFormForErrors (component, checkIgnored = false, parentSelector = '.field') {
  const errors = {}

  const inputs = component.$el.querySelectorAll('input, textarea, select')
  inputs.forEach(input => {
    if (!checkIgnored) {
      const ignore = input.getAttribute('data-ignore')
      if (ignore !== null) return
    }

    const key = input.name || indexInParent(input, input.closest(parentSelector))
    const valid = input.getAttribute('data-valid')
    const required = input.getAttribute('data-required')

    if (required !== null && input.value.trim() === '') {
      errors[key] = { required: true }
    }

    if (valid !== null) {
      if (required === null && input.value.trim() === '') {
        return
      }

      const regx = new RegExp(valid, 'g')
      if (!input.value.match(regx)) {
        if (errors[key]) {
          errors[key].invalid = true
        } else {
          errors[key] = { invalid: true }
        }
      }
    }
  })

  checkChildren(errors, component, checkIgnored)

  if (Object.keys(errors).length) {
    return errors
  }

  return false
}
