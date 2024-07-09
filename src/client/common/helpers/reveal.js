function reveal($controller) {
  if (!$controller) {
    return
  }

  const reveals = $controller.dataset.reveals.split(',')

  function toggleVisibility($element, visible) {
    if (visible) {
      $element.classList.remove('govuk-!-display-none')
      $element.classList.add('govuk-!-display-block')
    } else {
      $element.classList.remove('govuk-!-display-block')
      $element.classList.add('govuk-!-display-none')
    }
  }

  function toggleNestedReveals($element, shouldBeVisible) {
    toggleVisibility($element, shouldBeVisible)
    const nestedReveals = $element.dataset.reveals
      ? $element.dataset.reveals.split(',')
      : []
    nestedReveals.forEach((reveal) => {
      const $nestedReveal = document.getElementById(reveal)
      if ($nestedReveal) {
        toggleNestedReveals($nestedReveal, shouldBeVisible)
      }
    })
  }

  function updateVisibility() {
    const inputs = $controller.querySelectorAll('select')
    inputs.forEach((input) => {
      reveals.forEach((revealId) => {
        const $reveal = document.getElementById(revealId)
        if ($reveal) {
          const allFields = $reveal.querySelectorAll('[data-options]')
          allFields.forEach(($field) => {
            const revealOptions = $field.getAttribute('data-options').split(',')
            const doRefresh = $field.getAttribute('data-refresh')
            const shouldBeVisible = revealOptions.includes(input.value)
            if (shouldBeVisible) {
              toggleVisibility($reveal, true)
              toggleVisibility($field, true)
            } else {
              toggleVisibility($reveal, false)
              toggleVisibility($field, false)
            }
            if (doRefresh) {
              const nestedReveals = $field.dataset.reveals
                ? $field.dataset.reveals.split(',')
                : []
              nestedReveals.forEach((reveal) => {
                const $nestedReveal = document.getElementById(reveal)
                if ($nestedReveal) {
                  toggleNestedReveals($nestedReveal, shouldBeVisible)
                }
              })
            }
          })
        }
      })
    })
  }

  $controller.addEventListener('change', updateVisibility, true)

  document.addEventListener('DOMContentLoaded', updateVisibility)
}

export { reveal }
