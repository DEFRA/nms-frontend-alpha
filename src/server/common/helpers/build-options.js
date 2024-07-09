const getDefaultOption = (selectedItem) => ({
  value: '',
  text: ' - - select - - ',
  disabled: true,
  ...(!selectedItem && { attributes: { selected: true } })
})

const buildOptions = (items, selectedItem = null, withDefault = true) => {
  const defaultOption = getDefaultOption(selectedItem)
  return [
    ...(withDefault ? [defaultOption] : []),
    ...items.map((item) => {
      if (item?.value && item?.text) {
        return {
          value: item.value,
          text: item.text,
          ...(selectedItem &&
            parseInt(selectedItem) === parseInt(item.value) && {
              attributes: { selected: true }
            })
        }
      }

      return {
        value: item,
        text: item,
        ...(selectedItem &&
          selectedItem === item && { attributes: { selected: true } })
      }
    })
  ]
}

export { buildOptions }
