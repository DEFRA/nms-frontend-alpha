/**
 * Generates a payload object based on the provided data, applying specific logic based on organization type and developer type.
 *
 * This function processes the input `payloadData`, filtering and including fields in the resulting payload based on the type
 * of organization and developer. Fields are conditionally included in the payload according to predefined types and values.
 *
 * @param {Object} payloadData - The input data object containing various fields related to the organization and developer.
 * @param {string} [payloadData._id] - The unique identifier of the document (not included in the resulting payload).
 * @param {string} [payloadData.orgName] - The name of the organization.
 * @param {string} [payloadData.orgType] - The type of the organization, used to determine which fields are included.
 * @param {string} [payloadData.typeOfDeveloper] - The type of developer, used to determine which fields are included.
 * @param {string} [payloadData.mitigationProviderSBI] - Specific field included if the organization type is 'Mitigation Provider SBI'.
 * @param {string} [payloadData.address1] - Address line 1, included if the organization type is 'Consultant' or 'Mitigation Provider SBI'.
 * @param {string} [payloadData.address2] - Address line 2, included if the organization type is 'Consultant' or 'Mitigation Provider SBI'.
 * @param {string} [payloadData.address3] - Address line 3, included if the organization type is 'Consultant' or 'Mitigation Provider SBI'.
 * @param {string} [payloadData.townRCity] - Town or city, included if the organization type is 'Consultant' or 'Mitigation Provider SBI'.
 * @param {string} [payloadData.postcode] - Postcode, included if the organization type is 'Consultant' or 'Mitigation Provider SBI'.
 * @param {string} [payloadData.crn] - Company registration number, included if the developer type is 'Company'.
 * @param {string} [payloadData.nationality] - Nationality, included if the developer type is 'Individual'.
 * @param {string} [payloadData.regAddress1] - Registered address line 1, included if the developer type is 'Company', 'Individual', or 'Public'.
 * @param {string} [payloadData.regAddress2] - Registered address line 2, included if the developer type is 'Company', 'Individual', or 'Public'.
 * @param {string} [payloadData.regAddress3] - Registered address line 3, included if the developer type is 'Company', 'Individual', or 'Public'.
 * @param {string} [payloadData.regTownRCity] - Registered town or city, included if the developer type is 'Company', 'Individual', or 'Public'.
 * @param {string} [payloadData.regPostcode] - Registered postcode, included if the developer type is 'Company', 'Individual', or 'Public'.
 * @param {string} [payloadData.entity] - The entity type being processed (e.g., 'organization').
 * @param {string} [payloadData.status] - The status of the submission (e.g., 'incomplete').
 *
 * @returns {Object} - The processed payload object, including only the fields relevant to the given organization and developer types.
 *
 * @example
 * const inputPayload = {
 *   orgName: 'Example Org',
 *   orgType: '930750001',
 *   typeOfDeveloper: '930750000',
 *   mitigationProviderSBI: 'SomeProvider',
 *   address1: '123 Example Street',
 *   address2: '',
 *   address3: '',
 *   townRCity: 'Example Town',
 *   postcode: 'EX1 2AB',
 *   crn: '12345678',
 *   nationality: 'British',
 *   regAddress1: '456 Registered Street',
 *   regAddress2: '',
 *   regAddress3: '',
 *   regTownRCity: 'Registered Town',
 *   regPostcode: 'RT1 3CD',
 *   entity: 'organization',
 *   status: 'complete'
 * };
 *
 * const payload = await generatePayload(inputPayload);
 * console.log(payload);
 * // Output will include only the fields relevant to the given orgType and typeOfDeveloper.
 */
const generatePayload = async (payloadData) => {
  const { _id, ...payload } = payloadData
  const isMitProSBI = payload?.orgType === '930750001'
  const isCons = payload?.orgType === '930750003'
  const isDev = payload?.orgType === '930750007'

  const isComp = payload?.typeOfDeveloper === '930750000'
  const isInd = payload?.typeOfDeveloper === '930750001'
  const isPub = payload?.typeOfDeveloper === '930750002'

  return {
    orgName: payload.orgName,
    orgType: payload.orgType,
    typeOfDeveloper: isDev ? payload?.typeOfDeveloper : '',
    mitigationProviderSBI: isMitProSBI ? payload?.mitigationProviderSBI : '',
    address1: isCons || isMitProSBI ? payload?.address1 : '',
    address2: isCons || isMitProSBI ? payload?.address2 : '',
    address3: isCons || isMitProSBI ? payload?.address3 : '',
    townRCity: isCons || isMitProSBI ? payload?.townRCity : '',
    postcode: isCons || isMitProSBI ? payload?.postcode : '',
    crn: isComp ? payload?.crn : '',
    ...(isInd && payload?.nationality && { nationality: payload?.nationality }),
    regAddress1: isComp || isInd || isPub ? payload?.regAddress1 : '',
    regAddress2: isComp || isInd || isPub ? payload?.regAddress2 : '',
    regAddress3: isComp || isInd || isPub ? payload?.regAddress3 : '',
    regTownRCity: isComp || isInd || isPub ? payload?.regTownRCity : '',
    regPostcode: isComp || isInd || isPub ? payload?.regPostcode : '',
    entity: payload.entity,
    status: payload.status
  }
}

export { generatePayload }
