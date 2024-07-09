function toggle($controller) {
  if (!$controller) {
    return
  }

  const $toggle = document.getElementById($controller.dataset.toggle)
  const showValues = $controller.dataset.toggleShow.split(',')
  const hideValues = $controller.dataset.toggleHide.split(',')

  function updateToggle() {
    const inputs = $controller.querySelectorAll('input, select')
    const checkableElements = ['radio', 'checkbox']
    inputs.forEach((input) => {
      const isChecked =
        input?.type && checkableElements.includes(input?.type) && input?.checked
      const isSelected =
        input?.tagName?.toLowerCase() === 'select' && input?.value
      const isCheckedRSelected = isChecked || isSelected
      if (isCheckedRSelected && showValues.includes(input?.value)) {
        $toggle.classList.remove('govuk-!-display-none')
        $toggle.classList.add('govuk-!-display-block')
      }
      if (isCheckedRSelected && hideValues.includes(input?.value)) {
        $toggle.classList.remove('govuk-!-display-block')
        $toggle.classList.add('govuk-!-display-none')
      }
    })
  }

  $controller.addEventListener('change', updateToggle, true)

  document.addEventListener('DOMContentLoaded', updateToggle)
}

export { toggle }
