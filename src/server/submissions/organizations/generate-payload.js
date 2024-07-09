const generatePayload = async (payloadData) => {
  const { _id, ...payload } = payloadData
  const isMitProSBI = payload?.orgType === '930750001'
  const isCons = payload?.orgType === '930750003'
  const isDev = payload?.orgType === '930750007'

  const isComp = payload?.typeOfDeveloper === '930750000'
  const isInd = payload?.typeOfDeveloper === '930750001'
  const isPub = payload?.typeOfDeveloper === '930750002'

  return {
    ...payload,
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
    regPostcode: isComp || isInd || isPub ? payload?.regPostcode : ''
  }
}

export { generatePayload }
