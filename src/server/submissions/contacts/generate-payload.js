/**
 * Generates a payload by updating or adding a contact entry.
 *
 * This function updates the contact information in the payload data. If a contact with the specified `cid` exists,
 * it merges the provided data with the existing contact. If the contact does not exist, it adds a new contact entry
 * with the given data and `cid`.
 *
 * @async
 * @function generatePayload
 * @param {Object} payloadData - The base payload data containing existing contacts and metadata.
 * @param {Object} data - The new data to be added or updated in the contact entry.
 * @param {string} cid - The unique identifier for the contact to be updated or added.
 * @returns {Promise<Object>} The updated payload object, including the updated contacts, entity type, and status.
 *
 * @example
 * const payloadData = {
 *   _id: 'someId',
 *   contacts: [{ cid: 'contactId1', name: 'John Doe' }],
 *   entity: 'contact',
 *   status: 'active'
 * };
 * const data = { name: 'Jane Doe' };
 * const cid = 'contactId1';
 *
 * const updatedPayload = await generatePayload(payloadData, data, cid);
 * console.log(updatedPayload);
 * // Output: {
 * //   contacts: [{ cid: 'contactId1', name: 'Jane Doe' }],
 * //   entity: 'contact',
 * //   status: 'active'
 * // }
 */
const generatePayload = async (payloadData, data, cid) => {
  // Destructure and remove the `_id` from the payloadData
  const { _id, ...payload } = payloadData
  const contacts = payload?.contacts ?? []

  // Find the index of the contact with the specified `cid`
  const index = contacts.findIndex((contact) => contact.cid === cid)

  if (index !== -1) {
    // If contact exists, merge the new data with the existing contact
    contacts[index] = { ...contacts[index], ...data }
  } else {
    // If contact does not exist, add a new contact with the given data and `cid`
    contacts.push({ ...data, cid })
  }

  // Return the updated payload
  return {
    contacts,
    entity: payload.entity,
    status: payload.status
  }
}

export { generatePayload }
