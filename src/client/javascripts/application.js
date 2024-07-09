import {
  createAll,
  Button,
  Checkboxes,
  ErrorSummary,
  Header,
  Radios,
  SkipLink
} from 'govuk-frontend'

import { initModule } from '~/src/client/common/helpers/init-module.js'
import { toggle } from '../common/helpers/toggle.js'
import { reveal } from '../common/helpers/reveal.js'

createAll(Button)
createAll(Checkboxes)
createAll(ErrorSummary)
createAll(Header)
createAll(Radios)
createAll(SkipLink)

// Toggle
initModule('app-toggle', toggle)

// Reveal
initModule('app-reveal', reveal)
