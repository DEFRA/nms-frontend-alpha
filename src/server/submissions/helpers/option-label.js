/**
 * Retrieves the label text for a given ID from a collection of options.
 *
 * This asynchronous function searches through a collection of options to find an item with a matching ID.
 * The ID is compared to the `value` property of each item in the collection. If a matching item is found,
 * the function returns the `text` property of that item. If no matching item is found, the function returns `null`.
 *
 * @async
 * @function optionsLabel
 * @param {Array<Object>} collection - An array of option objects. Each object should have a `value` and `text` property.
 * @param {string|number} id - The ID to search for within the `value` properties of the option objects.
 * @returns {Promise<string|null>} A promise that resolves to the `text` of the matching option if found, or `null` if no match is found.
 *
 * @example
 * const options = [
 *   { value: '1', text: 'Option 1' },
 *   { value: '2', text: 'Option 2' }
 * ];
 * const id = '1';
 *
 * optionsLabel(options, id).then(label => {
 *   console.log(label); // Outputs: 'Option 1'
 * });
 */
const optionsLabel = async (collection, id) => {
  const data = collection.find((item) => item.value.toString() === id)
  if (data) {
    return data.text
  } else {
    return null
  }
}

export default optionsLabel
