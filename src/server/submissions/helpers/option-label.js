const optionsLabel = async (collection, id) => {
  const data = collection.find((item) => item.value.toString() === id)
  if (data) {
    return data.text
  } else {
    return null
  }
}

export default optionsLabel
