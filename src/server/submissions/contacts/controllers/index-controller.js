import { routePaths } from '../../../common/helpers/constants.js'
import { provideSubmission } from '../../helpers/pre/index.js'

const indexController = {
  options: {
    pre: [provideSubmission]
  },
  handler: async (request, h) => {
    const { id, cid } = request.params
    let values = {}
    const route = `${routePaths.contact}/${id}`
    let contacts = []
    if (id) {
      const submission = request.pre.submission
      if (submission) {
        contacts = submission?.contacts ?? []
        if (cid && contacts.length) {
          const contact = contacts.find((contact) => contact.cid === cid)
          if (Object.keys(contact).length) {
            values = contact
          } else {
            return h.redirect(route)
          }
        }
      } else {
        return h.redirect(routePaths.organization)
      }
    } else {
      return h.redirect(routePaths.organization)
    }
    return h.view('submissions/contacts/index', {
      pageTitle: 'Contact',
      heading: 'Contact',
      formValues: values,
      route,
      contacts,
      postHandler: cid ? `${route}/${cid}` : route,
      orgPath: `${routePaths.organization}/${id}`
    })
  }
}

export { indexController }
