const generatePayload = async (payloadData, data, cid) => {
  const { _id, ...payload } = payloadData
  const contacts = payload?.contacts ?? []
  const index = contacts.findIndex((contact) => contact.cid === cid)
  if (index !== -1) {
    contacts[index] = { ...contacts[index], ...data }
  } else {
    contacts.push({ ...data, cid })
  }
  return {
    contacts,
    entity: payload.entity,
    status: payload.status
  }
}

export { generatePayload }
