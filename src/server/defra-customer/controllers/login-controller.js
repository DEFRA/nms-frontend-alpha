import { config } from '~/src/config/index.js'

const loginController = {
  handler: (request, h) => {
    try {
      const state = Math.random().toString(36).substring(7)
      const nonce = Math.random().toString(36).substring(7)

      const defraCustomer = config.get('defraCustomer')
      const {
        dcTenantName: tenant,
        dcPolicyName: policy,
        dcClientId: clientId,
        dcServiceId: serviceId,
        dcRedirectUrl: redirectUrl
      } = defraCustomer

      request.yar.set('state', state)
      request.yar.set('nonce', nonce)

      const authorizationUrl =
        `https://${tenant}.b2clogin.com/${tenant}.onmicrosoft.com/${policy}/oauth2/v2.0/authorize` +
        `?client_id=${clientId}` +
        `&serviceId=${serviceId}` +
        `&response_type=code` +
        `&redirect_uri=${encodeURIComponent(redirectUrl)}` +
        `&response_mode=form_post` +
        `&scope=openid profile offline_access email ${clientId}` +
        `&state=${state}` +
        `&nonce=${nonce}`

      return h.redirect(authorizationUrl)
    } catch (error) {
      request.logger.error(JSON.stringify(error))
      return h.response(error.message)
    }
  }
}

export { loginController }
