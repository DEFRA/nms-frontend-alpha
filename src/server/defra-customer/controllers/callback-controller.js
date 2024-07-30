import { config } from '~/src/config/index.js'
import { fetchProxyWrapper } from '../../common/helpers/fetchProxyWrapper.js'

const callbackController = {
  handler: async (request, h) => {
    const { code, state } = request.payload
    const storedState = request.yar.get('state')
    if (!code) {
      return h.response('Authorization code not found').code(400)
    }
    if (state !== storedState) {
      return h.response('Unauthorize').code(403)
    }
    try {
      const defraCustomer = config.get('defraCustomer')
      const {
        dcTenantName: tenant,
        dcPolicyName: policy,
        dcClientId: clientId,
        dcClientSecret: clientSecret,
        dcRedirectUrl: redirectUrl
      } = defraCustomer
      const params = new URLSearchParams()
      params.append('client_id', clientId)
      params.append('client_secret', clientSecret)
      params.append('grant_type', 'authorization_code')
      params.append('code', code)
      params.append('redirect_uri', redirectUrl)
      params.append('scope', `openid profile offline_access email ${clientId}`)

      const response = await fetchProxyWrapper(
        `https://${tenant}.b2clogin.com/${tenant}.onmicrosoft.com/${policy}/oauth2/v2.0/token`,
        {
          body: params,
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencode'
          }
        },
        true
      )
      const { data } = await response.body
      return h.response({ data })
    } catch (error) {
      return h.response(error)
    }
  }
}

export { callbackController }
