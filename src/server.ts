import { config } from './config/env'
import { appLocal } from './index.local.'
import { appTesting } from './index.testing'

let app = appLocal
if (config.nodeEnv !== 'production') {
  const port = config.port
  app.listen(port, () => {
    console.log(`🚀 Gaianix backend running on http://localhost:${port}`)
    console.log(`📑 Swagger docs: http://localhost:${config.port}/api/docs`)
  })
} else {
  app = appTesting
}

export default app
